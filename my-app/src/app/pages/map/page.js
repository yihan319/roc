'use client';
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [floodData, setFloodData] = useState([]);

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
    <div className="min-h-screen bg-[#F5F5F5] font-[family-name:var(--font-geist-sans)] flex flex-col items-center justify-center">
      
      {/* 導覽列 */}
      <div className="fixed top-0 left-0 w-full shadow-lg p-2 z-50" style={{ backgroundColor: '#8EB9CC' }}>
        <div className="flex justify-between items-center">
          <ul className="menu flex gap-4 text-xl lg:text-3xl">
            <li><Link href="/" className="font-bold" style={{ color: '#2C3E50' }}>首頁</Link></li>
            <li><a href="https://fhy.wra.gov.tw/fhyv2/alert/warn" className="font-bold" style={{ color: '#2C3E50' }}>水情資訊</a></li>
            <li><a href="https://www.cwa.gov.tw/V8/C/" className="font-bold" style={{ color: '#2C3E50' }}>天氣狀況</a></li>
            <li><Link href="http://127.0.0.1:5000" className="font-bold" style={{ color: '#2C3E50' }}>地圖路徑</Link></li>
             <li><Link href="http://127.0.0.1:5000" className="font-bold" style={{ color: '#2C3E50' }}>影像辨識</Link></li>
          </ul>
          <ul className="menu flex gap-4 text-xl lg:text-3xl">
            <li><Link href="/pages/signup" className="font-bold" style={{ color: '#2C3E50' }}>註冊</Link></li>
            <li><Link href="/pages/signin" className="font-bold" style={{ color: '#2C3E50' }}>登入</Link></li>
          </ul>
        </div>
      </div>
<iframe
src="http://127.0.0.1:5000/map"
width="100%"
height="600"
style={{border:0}}
></iframe>
     

    </div>
  );
}