export async function GET(req, { params }) {
  const city = decodeURIComponent(params.city);
  const url = "https://www.twipcam.com/api/v1/cam-list.json";

  try {
    const res = await fetch(url, { cache: "no-store" });
    const all = await res.json();

    const cityCams = all.filter(
      (cam) => cam.name && cam.name.includes(city)
    );

    // 提取公路種類
    const roads = [...new Set(
      cityCams.map((cam) => {
        const match = cam.name.match(/(國道\d+號|台\d+線)/);
        return match ? match[1] : "其他道路";
      })
    )];

    console.log(`[Twipcam] 城市：${city} → ${roads.length} 條公路`);

    return new Response(JSON.stringify(roads), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Twipcam /city 錯誤：", err);
    return new Response(JSON.stringify({ error: "無法取得監視器資料" }), {
      status: 500,
    });
  }
}