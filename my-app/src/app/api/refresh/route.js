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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decoded;

    // 取得會員資料
    const user = await MemberData.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ error: "用戶不存在" }, { status: 404 });
    }

    // 檢查該會員是否已通過志工審核
    const volunteer = await VolunteerData.findOne({ email: user.email }).lean();
    if (volunteer && volunteer.status === "approved") {
      decoded.role = "volunteer";

      const newToken = jwt.sign(decoded, process.env.JWT_SECRET, { expiresIn: "7d" });

      const res = NextResponse.json({
        success: true,
        message: "身分已更新為志工",
      });

      // ✅ 把新 token 寫回 cookie（前端自動帶入）
      res.cookies.set("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7天
      });

      return res;
    }

    return NextResponse.json({ message: "無需更新" });
  } catch (error) {
    console.error("❌ refresh error:", error.stack);
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}
