// app/api/member/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import { MemberData, VolunteerData } from "@/model/User";

export async function GET(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "登入過期" }, { status: 401 });
    }

    const { userId, role } = decoded;

    // 所有人都先從 member_data 找（因為一開始都是會員）
    const user = await MemberData.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ error: "會員不存在" }, { status: 404 });
    }

    // 檢查是否為志工（看 VolunteerData 有沒有這筆）
    const volunteerRecord = await VolunteerData.findOne({ email: user.email }).lean();
    const isVolunteer = !!volunteerRecord;

    // 回傳統一格式
    return NextResponse.json({
      ...user,
      role: isVolunteer ? "volunteer" : role, // 優先用實際狀態
      volunteerStatus: isVolunteer ? volunteerRecord.status : "not_applied",
    });

  } catch (err) {
    console.error("API /member error:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}