"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react"; // 只 import 一次
import Navbar from "@/components/Navbar";

export default function CameraSearch() {
  // 所有 useState 都要在 component 內部
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [selectedRoad, setSelectedRoad] = useState("");
  const [cams, setCams] = useState([]);
  const [loading, setLoading] = useState(false);

  // 三層分類資料
  const categories = {
    fastHighway: {
      title: "快速公路即時影像",
      icon: "🚗",
      items: [
        "台61線","台62線","台64線","台65線","台66線","台68線",
        "台72線","台74線","台76線","台78線","台82線",
        "台84線","台86線","台88線"
      ],
    },
    provincialRoad: {
      title: "省道公路即時影像",
      icon: "🛣️",
      items: [
        "北宜公路","基隆","新北","桃園","新竹","苗栗",
        "台中","南投","彰化","雲林","嘉義","台南",
        "高雄","屏東","台東","花蓮","宜蘭",
      ],
    },
    cityRoad: {
      title: "市區道路即時影像",
      icon: "🏙️",
      items: [
        "台北市","新北市","桃園市","台中市","台南市","高雄市",
        "基隆市","新竹市","南投縣","彰化縣","嘉義市",
        "屏東縣","台東縣","宜蘭縣","金門縣",
      ],
    },
  };

  // 點擊第二層路線
  const handleRoadClick = async (road) => {
    setSelectedRoad(road);
    setLoading(true);
    try {
      const res = await fetch(`/api/twipcam/road/${encodeURIComponent(road)}`);
      const data = await res.json();
      setCams(data);
    } catch (err) {
      console.error("載入監視器失敗：", err);
      setCams([]); // 錯誤時清空
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <Navbar />
      {/* 主要內容區（加上 pt 避免被導覽列蓋到） */}
      <div className="pt-24 p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
          道路即時影像監視系統
        </h1>

        {/* 第一層分類 */}
        <div className="flex justify-center flex-wrap gap-3 mb-6">
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => {
                setCategory(key);
                setSelectedRoad("");
                setCams([]);
              }}
              className={`px-5 py-3 rounded-full shadow-md font-semibold flex items-center gap-2 transition ${
                category === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-blue-400 hover:text-white"
              }`}
            >
              <span>{cat.icon}</span> {cat.title}
            </button>
          ))}
        </div>

        {/* 第二層路線按鈕 */}
        {category && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories[category].items.map((road) => (
              <button
                key={road}
                onClick={() => handleRoadClick(road)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  selectedRoad === road
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-blue-300 hover:text-white"
                }`}
              >
                {road}
              </button>
            ))}
          </div>
        )}

        {/* 載入中提示 */}
        {loading && (
          <p className="text-center text-gray-500 mt-6 animate-pulse">
            正在載入 {selectedRoad} 即時影像…
          </p>
        )}

        {/* 監視器顯示區 */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cams.map((cam) => (
            <div
              key={cam.id}
              className="flex flex-col border rounded-2xl shadow-md bg-white overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative bg-black">
                <iframe
                  src={cam.cam_url}
                  title={cam.name}
                  scrolling="no"
                  allow="autoplay"
                  className="w-full h-auto object-contain"
                  style={{
                    aspectRatio: "4 / 3",
                    minHeight: "240px",
                    backgroundColor: "black",
                  }}
                />
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <h2 className="font-semibold text-sm mb-1 line-clamp-2 text-gray-800">
                  {cam.name}
                </h2>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  📍 {cam.lat}, {cam.lon}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 若沒有資料 */}
        {!loading && cams.length === 0 && selectedRoad && (
          <p className="text-center text-gray-400 mt-6">
            此路線暫無可用監視器資料
          </p>
        )}
      </div>
    </>
  );
}