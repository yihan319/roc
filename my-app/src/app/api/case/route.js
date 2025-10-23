// src/app/api/case/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Case from "@/model/report";
import { MemberData, VolunteerData } from "@/model/User";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";

async function getUserFromToken(req) {
  const token = req.cookies.get("token")?.value;
  console.log("Received token:", token ? "Present" : "Absent");
  if (!token) {
    console.log("No token found in request");
    return null;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    const { userId, role } = decoded;
    let user;

    if (role === "admin") {
      user = await MemberData.findById(userId).lean();
    } else if (role === "volunteer") {
      user = await VolunteerData.findOne({ memberId: userId }).lean();
      if (!user) {
        // 備用從 MemberData 查找
        user = await MemberData.findById(userId).lean();
        if (user && user.role !== "volunteer") {
          console.log("Role mismatch or volunteer record not found for userId:", userId);
          return null;
        }
      }
    } else if (role === "member") {
      user = await MemberData.findById(userId).lean();
      const volunteer = await VolunteerData.findOne({ email: user.email }).lean();
      if (volunteer) {
        user.volunteerStatus = volunteer.status;
        if (volunteer.status === "approved") {
          return { user, role: "volunteer" };
        }
      }
    }

    if (!user) {
      console.log("User not found for userId:", userId);
      return null;
    }
    return { user, role };
  } catch (err) {
    console.error("Token verification error:", err.message);
    return null;
  }
}

// ✅ GET：根據角色取回案件
export async function GET(req) {
  await connectDB();
  const session = await getUserFromToken(req);
  if (!session?.user) {
    console.log("Unauthorized GET request - No valid session", {
      cookies: req.cookies.getAll(),
    });
    return NextResponse.json({ error: "未登入", details: "No valid session" }, { status: 401 });
  }

  try {
    let cases;
    if (session.role === "admin") {
      cases = await Case.find().lean();
    } else if (session.role === "volunteer" || (session.user && session.user.volunteerStatus === "approved")) {
      cases = await Case.find({
        $or: [
          { status: "approved" },
          { status: "in_progress", volunteers: { $in: [session.user.email] } },
        ],
      }).lean();
    } else {
      cases = await Case.find({ createdBy: session.user.email }).lean();
    }

    const formatted = cases.map((c) => ({
      ...c,
      _id: c._id.toString(),
      photoUrl: c.photoUrl
        ? c.photoUrl.startsWith("http")
          ? c.photoUrl
          : `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${c.photoUrl}`
        : null,
      completionPhotoUrl: c.completionPhotoUrl
        ? c.completionPhotoUrl.startsWith("http")
          ? c.completionPhotoUrl
          : `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}${c.completionPhotoUrl}`
        : null,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("GET cases error:", err);
    return NextResponse.json({ error: "伺服器錯誤", details: err.message }, { status: 500 });
  }
}

// ✅ PATCH：更新案件狀態（支援多志工）
export async function PATCH(req) {
  await connectDB();
  const session = await getUserFromToken(req);
  if (!session?.user) {
    console.log("Unauthorized PATCH request - No valid session", {
      cookies: req.cookies.getAll(),
    });
    return NextResponse.json({ error: "未登入", details: "No valid session" }, { status: 401 });
  }

  try {
    let caseId, action, completionPhoto;

    const contentType = req.headers.get("content-type");
    console.log("Received PATCH Content-Type:", contentType);

    if (contentType?.includes("multipart/form-data")) {
      const formData = await req.formData();
      caseId = formData.get("caseId");
      action = formData.get("action");
      completionPhoto = formData.get("completionPhoto");
    } else {
      const body = await req.json();
      caseId = body.caseId;
      action = body.action;
    }

    console.log("Parsed PATCH data:", { caseId, action, hasPhoto: !!completionPhoto });

    if (!caseId || !action) {
      return NextResponse.json({ error: "缺少參數" }, { status: 400 });
    }

    const c = await Case.findById(caseId);
    if (!c) return NextResponse.json({ error: "找不到案件" }, { status: 404 });

    if (session.role === "admin") {
      if (!["approve", "reject", "approve_completion", "reject_completion"].includes(action)) {
        return NextResponse.json({ error: "非法操作" }, { status: 400 });
      }
      if (action === "approve") c.status = "approved";
      else if (action === "reject") c.status = "rejected";
      else if (action === "approve_completion") c.status = "completed";
      else if (action === "reject_completion") {
        c.status = "approved";
        c.completionPhotoUrl = null;
        c.volunteers = [];
      }
    } else if (session.role === "volunteer" || (session.user && session.user.volunteerStatus === "approved")) {
      if (action === "take") {
        if (c.status !== "approved" && c.status !== "in_progress") {
          return NextResponse.json({ error: "無法接案" }, { status: 400 });
        }
        if (!c.volunteers) c.volunteers = [];
        if (!c.volunteers.includes(session.user.email)) {
          c.volunteers.push(session.user.email);
        }
        c.status = "in_progress";
      } else if (action === "complete") {
        if (!c.volunteers?.includes(session.user.email)) {
          return NextResponse.json({ error: "無法完成案件" }, { status: 400 });
        }
        if (!completionPhoto || typeof completionPhoto.name !== "string") {
          return NextResponse.json({ error: "請上傳完成照片" }, { status: 400 });
        }
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await fs.mkdir(uploadDir, { recursive: true });

        const arrayBuffer = await completionPhoto.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filename = `${Date.now()}-${completionPhoto.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, buffer);

        c.completionPhotoUrl = `/uploads/${filename}`;
        c.status = "awaiting_review";
      }
    }

    await c.save();
    return NextResponse.json({ success: true, case: c.toObject() });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json({ error: "伺服器錯誤", details: err.message }, { status: 500 });
  }
}