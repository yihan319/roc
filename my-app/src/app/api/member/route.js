import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import { MemberData, VolunteerData } from "@/model/User";

export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "請先登入" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, role } = decoded;

    let user = await MemberData.findById(userId).lean();
    if (!user) return NextResponse.json({ error: "會員不存在" }, { status: 404 });

    // 檢查是否有志工申請
    const volunteer = await VolunteerData.findOne({ email: user.email }).lean();
    user.volunteerStatus = volunteer ? volunteer.status : "not_applied";

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "伺服器錯誤", details: err.message }, { status: 500 });
  }
}
