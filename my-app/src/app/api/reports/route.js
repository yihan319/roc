import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Case from "@/model/report"; // 注意：這裡使用 Case，確保匯入正確
import { MemberData, VolunteerData } from "@/model/User";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 重用 getUserFromToken
// 重用 getUserFromToken —— 改成「動態判斷 role」
async function getUserFromToken(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decoded;

    // 1. 先從 member_data 找人（所有人都從這裡開始）
    const member = await MemberData.findById(userId).lean();
    if (!member) return null;

    // 2. 檢查是否有志工身份
    const volunteer = await VolunteerData.findOne({ email: member.email }).lean();
    const isVolunteer = !!volunteer;

    // 3. 動態決定 role
    const role = isVolunteer ? "volunteer" : "member";

    // 4. 回傳真實使用者資料（用 member 資料，志工也用同一個）
    return {
      user: member,
      role, // 這才是真實身份！
    };

  } catch (err) {
    console.error("Token 驗證失敗:", err);
    return null;
  }
}
export async function POST(req) {
  try {
    // 檢查身份驗證
    const session = await getUserFromToken(req);
    if (!session?.user || !["member", "admin", "volunteer"].includes(session.role)) {
  return NextResponse.json({ error: "未登入或無權限" }, { status: 401 });
}

    const form = await req.formData();
    const name = form.get("name");
    const email = form.get("email");
    const address = form.get("address");
    const phone = form.get("phone");
    const detail = form.get("detail");
    const files = form.getAll("files") || [];

    if (!name || !email || !address || !phone || !detail) {
      return NextResponse.json({ error: "缺少必要欄位" }, { status: 400 });
    }

    const photoUrls = [];
for (const file of files) {
    if (file && typeof file === "object" && "arrayBuffer" in file) {
      const MAX = 5 * 1024 * 1024;
      if (file.size > MAX) {
        return NextResponse.json({ error: "檔案過大（上限 5MB）" }, { status: 400 });
      }

      const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif"];
      if (!allowed.includes(file.type)) {
        return NextResponse.json({ error: "僅允許上傳圖片檔" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      const safeName = String(file.name).replace(/\s+/g, "_");
      const filename = `${Date.now()}_${safeName}`;
      const filepath = path.join(uploadDir, filename);

      fs.writeFileSync(filepath, buffer);
      photoUrls.push( `/uploads/${filename}`);
    }
  }
    await connectDB();

    const doc = await Case.create({
      name,
      email,
      address,
      phone,
      detail,
      photoUrls,
      createdBy: session.user.email, // 從 session 設定 createdBy
      status: "pending", // 預設狀態
      volunteers: [] // 預設無志工
    });

    return NextResponse.json({ message: "通報成功", data: doc.toObject() }, { status: 201 });
  } catch (err) {
    console.error("通報 API 錯誤:", err);
    // 如果檔案已寫入但 MongoDB 失敗，考慮刪除檔案（選項）
    return NextResponse.json({ error: "伺服器錯誤" }, { status: 500 });
  }
}