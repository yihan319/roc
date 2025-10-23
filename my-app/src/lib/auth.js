// lib/auth.js
import jwt from "jsonwebtoken";
import { MemberData, VolunteerData } from "@/model/User";

export async function getUserFromToken(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, role } = decoded;
    let user;
    if (role === "member" || role === "admin") user = await MemberData.findById(userId).lean();
    else if (role === "volunteer") user = await VolunteerData.findById(userId).lean();
    return { user, role };
  } catch {
    return null;
  }
}