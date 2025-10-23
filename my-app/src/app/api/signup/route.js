import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { MemberData } from "@/model/User";

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!name || !email || !password) {
      return NextResponse.json({ error: "請填寫所有欄位" }, { status: 400 });
    }

    const existingMember = await MemberData.findOne({ email });
    if (existingMember) {
      return NextResponse.json({ error: "此 Email 已被註冊" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newMember = await MemberData.create({
      name,
      email,
      password: hashedPassword,
      role: "member",
    });

    return NextResponse.json({ success: true, user: newMember }, { status: 201 });
  } catch (error) {
    console.error("❌ Signup error:", error);
    return NextResponse.json({ error: "伺服器錯誤", details: error.message }, { status: 500 });
  }
}
