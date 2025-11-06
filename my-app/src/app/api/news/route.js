import { connectDB } from "@/lib/mongodb";
import News from "@/model/news";

export async function GET(req, res) {
  await connectDB();

  try {
    const newsList = await News.find().sort({ crawled_at: -1 }).limit(20);
    console.log("查詢成功");
    return new Response(JSON.stringify(newsList), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("錯誤細節:", err);
    return new Response(JSON.stringify({ error: "無法取得資料", details: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}