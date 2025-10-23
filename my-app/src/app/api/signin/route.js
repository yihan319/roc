import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { MemberData, VolunteerData } from "@/model/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "請輸入 email 與密碼" }, { status: 400 });
  }

  let user = await MemberData.findOne({ email });
  let userType = "member";

  if (!user) {
    user = await VolunteerData.findOne({ email });
    userType = "volunteer";
  }

  if (!user) {
    return NextResponse.json({ error: "帳號不存在" }, { status: 404 });
  }

  // 新增：檢查志工狀態
  if (userType === "volunteer" && user.status !== "approved") {
    return NextResponse.json({ error: "帳號尚未通過審核" }, { status: 403 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ error: "密碼錯誤" }, { status: 401 });
  }

  // 修正：使用 user.role 而非 userType
  const role = user.role || userType; // 如果 user.role 存在則使用，否則退回到 userType
  const token = jwt.sign(
    { userId: user._id.toString(), role: role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const response = NextResponse.json({ message: "登入成功" });
  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}