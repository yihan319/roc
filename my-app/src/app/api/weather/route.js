export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "臺北市";

  const key = process.env.CWA_API_KEY;
  const api = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${key}&locationName=${encodeURIComponent(city)}`;

  try {
    const res = await fetch(api);
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "取得氣象資料失敗" }), { status: 500 });
  }
}