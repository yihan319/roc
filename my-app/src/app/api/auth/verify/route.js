import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import { MemberData, VolunteerData } from "@/model/User";

export async function GET(req) {
  await connectDB();

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ isLogin: false }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user =
      (await MemberData.findById(decoded.userId)) ||
      (await VolunteerData.findById(decoded.userId));

    if (!user) throw new Error("User not found");

    return NextResponse.json({
      isLogin: true,
      role: decoded.role,
      user: { email: user.email, name: user.name },
    });
  } catch (err) {
    return NextResponse.json({ isLogin: false, error: "Token 無效" }, { status: 401 });
  }
}
