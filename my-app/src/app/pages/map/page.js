"use client";
import Navbar from "@/components/Navbar";
import React from "react";

export default function MapPage() {
  return (
     <>
        <Navbar />
    <div className="w-full h-screen pt-13">
      <iframe
        id="mapFrame"
        src="http://localhost:5000"  // ✅ 地圖專案的網址
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="地圖功能"
      />
    </div>
    
    </>
  );
}
