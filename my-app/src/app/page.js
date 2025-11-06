'use client';
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { Menu, X } from "lucide-react"; // 安裝：npm install lucide-react

export default function Home() {
  const [floodData, setFloodData] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // 抓資料庫資料
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        setFloodData(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
   <>
    <Navbar />
    <div className="pt-10 min-h-screen bg-[#F5F5F5] font-[family-name:var(--font-geist-sans)] flex flex-col items-center justify-center">
      
      
      {/* 主標題區 */}
      <div className="pt-10 px-4 sm:px-20 flex flex-col items-start gap-8">
        <div className="flex items-center gap-4">
          <Image
            src="/logonew.svg"
            alt="logo"
            className="h-16 w-25 md:h-25 md:w-30"
            width={90}   
            height={50} 
          />
          <h1 className="text-3xl lg:text-5xl font-bold py-1 text-left" style={{color: 'black'}}>
            淹水預測及通報系統
            <p className="text-sm lg:text-base py-1" style={{color: 'black'}}>
              FLOODING WATER AND FORECAST REPORTING SYSTEM
            </p>
          </h1>
        </div>

        {/* 最新消息區塊 */}
        <div className="w-full max-w-4xl">
          <div className="flex justify-start mb-4" style={{ marginLeft: 'auto', marginRight: '1rem' }}>
            <h2 className="text-2xl font-semibold text-gray-800">最新消息</h2>
          </div>
          <div className="overflow-y-auto h-96 py-4" style={{ maxHeight: '24rem' }}>
            {floodData.length === 0 && (
              <p className="text-gray-500">目前沒有資料</p>
            )}
            {floodData.map((item) => (
              <div key={item._id} className="bg-white shadow-md rounded-lg p-4 mb-4 w-full">
                <h2 className="text-xl font-semibold">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {item.title}
                  </a>
                </h2>
                <p className="text-sm text-gray-600 overflow-hidden line-clamp-3" style={{ maxHeight: '4.5em' }}>
                  {item.summary}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(item.published_at || item.crawled_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
