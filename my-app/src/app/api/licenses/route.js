import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MemberData, VolunteerData } from "@/model/User";
import jwt from "jsonwebtoken";
import { writeFile } from "fs/promises";
import path from "path";

// ✅ GET：取得所有志工申請
export async function GET() {
  try {
    await connectDB();

    const volunteers = await VolunteerData.find().lean();

    const results = await Promise.all(
      volunteers.map(async (v) => {
        const member = await MemberData.findOne({ email: v.email }).lean();
        return {
          _id: v._id,
          email: v.email,
          name: member?.name || "未填姓名",
          role: member?.role || "member",
          licenses: v.licenses || [],
          status: v.status || "pending",
          createdAt: v.createdAt,
        };
      })
    );

    return NextResponse.json(results);
  } catch (err) {
    console.error("❌ 取得志工申請資料錯誤:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ POST：提交志工申請與上傳證照
export async function POST(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "請先登入" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const member = await MemberData.findById(decoded.userId);
    if (!member) return NextResponse.json({ error: "會員不存在" }, { status: 404 });

    const existing = await VolunteerData.findOne({ email: member.email });
    if (existing) return NextResponse.json({ error: "已申請過，請等待審核" }, { status: 400 });

    const formData = await req.formData();
    const files = formData.getAll("licenses"); // input name="licenses"
    const categories = formData.getAll("licenseCategories"); // 可選類別
    const licenses = [];

    if (!files.length) return NextResponse.json({ error: "請至少上傳一張證照" }, { status: 400 });

    // 將每個檔案存到 public/uploads
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filepath = path.join(process.cwd(), "public", "uploads", filename);
      await writeFile(filepath, buffer);

      licenses.push({
        url: `/uploads/${filename}`,
        category: categories[i] || "未分類",
      });
    }

    // 建立志工申請
    await VolunteerData.create({
      memberId: member._id,
      name: member.name,
      email: member.email,
      licenses,
      status: "pending",
    });

    return NextResponse.json({ message: "申請已提交，等待審核", success: true });
  } catch (err) {
    console.error("❌ POST 志工申請錯誤:", err);
    return NextResponse.json({ error: err.message, success: false }, { status: 500 });
  }
}

// ✅ PATCH：審核通過/拒絕
export async function PATCH(req) {
  try {
    await connectDB();
    const { memberId, status } = await req.json();

    const volunteer = await VolunteerData.findById(memberId);
    if (!volunteer) return NextResponse.json({ error: "找不到志工申請資料" }, { status: 404 });

    volunteer.status = status;
    await volunteer.save();

    if (status === "approved") {
      await MemberData.findOneAndUpdate({ email: volunteer.email }, { role: "volunteer" });
      const member = await MemberData.findOne({ email: volunteer.email });
      const token = jwt.sign({ userId: member._id, role: member.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

      return NextResponse.json({ message: "已通過審核", token });
    }

    return NextResponse.json({ message: "狀態更新成功" });
  } catch (err) {
    console.error("❌ 更新志工狀態錯誤:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ❌ DELETE：刪除未通過的志工申請
export async function DELETE(req) {
  try {
    await connectDB();
    const { memberId } = await req.json();

    const volunteer = await VolunteerData.findByIdAndDelete(memberId);
    if (!volunteer) return NextResponse.json({ error: "找不到該志工資料" }, { status: 404 });

    return NextResponse.json({ message: "志工申請已刪除" });
  } catch (err) {
    console.error("❌ 刪除志工錯誤:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
