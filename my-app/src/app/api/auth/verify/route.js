import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import { MemberData, VolunteerData } from "@/model/User";

// 唯一的一個 GET 函數
export async function GET(req) {
  await connectDB();

  const token = req.cookies.get("token")?.value;

  // 沒有 token → 未登入
  if (!token) {
    return NextResponse.json({ isLogin: false });
  }

  try {
    // 驗證 JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 查找使用者（Member 或 Volunteer）
    const user =
      (await MemberData.findById(decoded.userId)) ||
      (await VolunteerData.findById(decoded.userId));

    if (!user) {
      return NextResponse.json({ isLogin: false, error: "User not found" });
    }

    // 成功登入，回傳資訊
    return NextResponse.json({
      isLogin: true,
      role: decoded.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("JWT verify error:", err.message);
    return NextResponse.json(
      { isLogin: false, error: "Token 無效或過期" },
      { status: 401 }
    );
  }
}