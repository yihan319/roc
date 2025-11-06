export async function GET(req, { params }) {
  const city = decodeURIComponent(params.city);
  const road = decodeURIComponent(params.road);
  const url = "https://www.twipcam.com/api/v1/cam-list.json";

  try {
    const res = await fetch(url, { cache: "no-store" });
    const all = await res.json();

    const filtered = all.filter(
      (cam) => cam.name.includes(city) && cam.name.includes(road)
    );

    console.log(`[Twipcam] 城市：${city} + 公路：${road} → ${filtered.length} 筆`);

    return new Response(JSON.stringify(filtered), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Twipcam /city/[city]/[road] 錯誤：", err);
    return new Response(JSON.stringify({ error: "無法取得監視器資料" }), {
      status: 500,
    });
  }
}
