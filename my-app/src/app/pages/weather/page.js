"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // 手機選單狀態

  // 只在第一次載入時抓資料
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(
        "https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-F6358ECB-4522-4F60-A6B4-34D0F485592A"
      );
      const data = await res.json();
      setWeatherData(data.records.location || []);
      setLastUpdate(new Date().toLocaleString("zh-TW"));
    } catch (error) {
      console.error("天氣資料抓取失敗：", error);
      setWeatherData([]);
    }
  };

  // 篩選功能
  const filteredData = weatherData.filter(
    (item) =>
      item.locationName.includes(search) &&
      (selectedCity === "" || item.locationName === selectedCity)
  );

  // 天氣 icon
  const getWeatherIcon = (wx) => {
    if (wx.includes("晴")) return "☀️";
    if (wx.includes("多雲")) return "⛅";
    if (wx.includes("陰")) return "☁️";
    if (wx.includes("雨")) return "🌧️";
    if (wx.includes("雷")) return "⛈️";
    if (wx.includes("雪")) return "❄️";
    return "🌤️";
  };

  return (
   <>
   <Navbar/>
      {/* ==================== 主要內容（避開導覽列） ==================== */}
      <div className="pt-24 min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 p-6">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            className="text-4xl font-bold text-center mb-6 text-blue-800"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            全台天氣預報（今明36小時）
          </motion.h1>

          <p className="text-center text-gray-600 mb-6">
            ⏰ 最新更新時間：{lastUpdate || "載入中..."}
          </p>

          {/* 搜尋列 */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
            <input
              type="text"
              placeholder="🔍 搜尋縣市..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-2 border-blue-300 rounded-lg px-4 py-2 w-full sm:w-64 focus:outline-none focus:border-blue-500"
            />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="border-2 border-blue-300 rounded-lg px-4 py-2 w-full sm:w-48 focus:outline-none"
            >
              <option value="">全部地區</option>
              {weatherData.map((item) => (
                <option key={item.locationName} value={item.locationName}>
                  {item.locationName}
                </option>
              ))}
            </select>
          </div>

          {/* 天氣卡片 */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.length > 0 ? (
              filteredData.map((loc, index) => {
                const wx = loc.weatherElement[0]?.time[0]?.parameter?.parameterName || "未知";
                const pop = loc.weatherElement[1]?.time[0]?.parameter?.parameterName || "0";
                const minT = loc.weatherElement[2]?.time[0]?.parameter?.parameterName || "0";
                const maxT = loc.weatherElement[4]?.time[0]?.parameter?.parameterName || "0";
                const icon = getWeatherIcon(wx);

                return (
                  <motion.div
                    key={loc.locationName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-2xl font-bold text-blue-700">
                        {loc.locationName}
                      </h2>
                      <span className="text-4xl">{icon}</span>
                    </div>
                    <p className="text-lg text-gray-700 mb-2 font-medium">{wx}</p>
                    <div className="space-y-1 text-gray-600">
                      <p>🌡 溫度：{minT}°C ～ {maxT}°C</p>
                      <p>🌧 降雨機率：{pop}%</p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <p className="col-span-full text-center text-gray-500 text-xl">
                {weatherData.length === 0 ? "載入中..." : "找不到符合的地區 🌱"}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}