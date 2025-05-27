"use client";
import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
 const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("密碼與確認密碼不一致!");
      return;
    }

    alert("註冊成功！請確認Email信息");

    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  
  return (
   
  <div className="row">
    <div className="col-12 col-md-4">
    <div className="bg-[#2894FF] grid grid-rows-[20px_1fr_20px]  min-h-screen p-4 pb-20 gap-12 sm:p-20 font-[family-name:var(--font-geist-sans)]">
     <div className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#00BB00] to-[#0066CC] shadow-lg p-2 z-50">
   <div className="flex justify-between items-center">
  <ul className="menu flex gap-4 text-xl lg:text-3xl">
    <li><a href="/">首頁</a></li>
    <li><a href="/map">地圖</a></li>
    <li><a href="#">通報狀況</a></li>
  </ul>
  <ul className="menu flex gap-4 text-xl lg:text-3xl">
    <li><a href="/signup">註冊</a></li>
    <li><a href="/signin">登入</a></li>
  </ul>
</div>
</div>
<main>
<div className="max-w-md mx-auto bg-white shadow-xl rounded-xl p-4 mt-10">
      <h2 className="text-2xl font-bold text-center text-[#000000] mb-6">
        註冊資料
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-[#000000]">姓名</label>
          <input
            type="text"
            name="name"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#000000]"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-[#000000]">Email</label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#000000]"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
  <label className="block mb-1 font-medium text-[#000000]">密碼</label>
  <input
    type="password"
    name="password"
    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#000000] text-[#000000]"
    value={formData.password}
    onChange={handleChange}
    required
  />

  <label className="block mt-4 mb-1 font-medium text-[#000000]">確認密碼</label>
  <input
    type="password"
    name="confirmPassword"
    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#000000] text-[#000000]"
    value={formData.confirmPassword}
    onChange={handleChange}
    required
  />
</div>

        <button
          type="submit"
          className="w-full bg-[#005AB5] text-white py-2 px-4 rounded hover:bg-[#003f80] transition duration-200"
        >
          送出
        </button>
      </form>
    </div>
</main>
</div>

</div>

</div>

  )}