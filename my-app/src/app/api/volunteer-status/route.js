import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { VolunteerData } from "@/model/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "未登入" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, role } = decoded;

    // 查找志工申請資料
    const volunteer = await VolunteerData.findOne({ userId }).lean();

    if (!volunteer) {
      return NextResponse.json({ status: "none" }); // 尚未申請
    }

    return NextResponse.json({ status: volunteer.status, data: volunteer });
  } catch (err) {
    console.error("❌ 查詢志工狀態錯誤:", err);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
