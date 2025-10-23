"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("請輸入有效的 Gmail 地址");
      return;
    }
    if (password.length === 0) {
      setError("請輸入密碼");
      return;
    }

    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "登入失敗");
        return;
      }

      // 移除無效的 localStorage (token 是 httpOnly cookie，前端無法存取)
      // localStorage.setItem("token", data.token);

      alert("登入成功！");
      window.location.href = "/dashboard";
    } catch (err) {
      setError("伺服器錯誤");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-[family-name:var(--font-geist-sans)] flex flex-col items-center justify-center">
      <div className="fixed top-0 left-0 w-full shadow-lg p-2 z-50" style={{ backgroundColor: '#8EB9CC' }}>
        <div className="flex justify-between items-center">
          <ul className="menu flex gap-4 text-xl lg:text-3xl">
            <li><Link href="/" className="font-bold" style={{ color: '#2C3E50' }}>首頁</Link></li>
            <li><a href="https://fhy.wra.gov.tw/fhyv2/alert/warn" className="font-bold" style={{ color: '#2C3E50' }}>水情資訊</a></li>
            <li><a href="https://www.cwa.gov.tw/V8/C/" className="font-bold" style={{ color: '#2C3E50' }}>天氣狀況</a></li>
            <li><Link href="/map" className="font-bold" style={{ color: '#2C3E50' }}>地圖路徑</Link></li>
          </ul>
          <ul className="menu flex gap-4 text-xl lg:text-3xl">
            <li><Link href="/pages/signup" className="font-bold" style={{ color: '#2C3E50' }}>註冊</Link></li>
            <li><Link href="/pages/signin" className="font-bold" style={{ color: '#2C3E50' }}>登入</Link></li>
          </ul>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-black text-center text-2xl font-semibold">登入</h2>

            <div>
              <label className="block mb-1 text-black"></label>
              <input
                type="email"
                value={email}
                placeholder="輸入Email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 text-lg text-black border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-black"></label>
              <input
                type="password"
                value={password}
                placeholder="輸入密碼"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 text-lg text-black border border-gray-300 rounded"
                required
              />
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#005AB5] text-white py-2 px-4 rounded hover:bg-[#003f80] transition"
            >
              登入
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}