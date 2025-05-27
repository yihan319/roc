"use client";
import React, { useState } from "react";
import Link from "next/link";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
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
    alert(`登入成功！\nEmail: ${email}\n密碼長度: ${password.length}`);
  };

 return (
  <>
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#00BB00] to-[#0066CC] shadow-lg px-4 py-2 z-50">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <ul className="flex gap-4 text-white text-xl lg:text-2xl">
          <li><Link href="/">首頁</Link></li>
          <li><Link href="/map">地圖</Link></li>
          <li><Link href="#">通報狀況</Link></li>
        </ul>
        <ul className="flex gap-4 text-white text-xl lg:text-2xl">
          <li><Link href="/signup">註冊</Link></li>
          <li><Link href="/signin">登入</Link></li>
        </ul>
      </nav>
    </header>

    {/* 給 main 區塊加上 padding-top，避免被 fixed header 蓋到 */}
    <div className="bg-white min-h-screen pt-24 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-300 p-8 rounded-lg shadow-md w-80"
      >
        <h2 className="text-black mb-6 text-center text-2xl font-semibold">登入</h2>
        <label className="block mb-1 text-black">Gmail:</label>
        <input
          type="email"
          value={email}
          placeholder="example@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 text-lg text-black border border-gray-300 rounded"
        />
        <label className="block mb-1 text-black">密碼:</label>
        <input
          type="password"
          value={password}
          placeholder="輸入密碼"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 text-lg text-black border border-gray-300 rounded"
        />
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-black text-white p-3 rounded hover:bg-blue-700 transition"
        >
          登入
        </button>
      </form>
    </div>
  </>
);

}