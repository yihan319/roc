export async function GET() {
  const url = "https://www.twipcam.com/api/v1/cam-list.json";

  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Fetch Twipcam Error:", err);
    return new Response(JSON.stringify({ error: "無法取得監視器資料" }), {
      status: 500,
    });
  }
}