"use client";
import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("請輸入有效的 Gmail 地址");
      return;
    }
    if (!password) {
      setError("請輸入密碼");
      return;
    }
    if (password !== confirmPassword) {
      setError("密碼與確認密碼不符");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("email", email);
      formDataToSend.append("password", password);
      formDataToSend.append("role", "member");

      const res = await fetch("/api/signup", {
        method: "POST",
        body: formDataToSend,
      });

      const text = await res.text();
      console.log("Signup API response:", text);
      const data = JSON.parse(text);

      if (res.ok) {
        alert("註冊成功！");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setError(data.error || "註冊失敗");
      }
    } catch (err) {
      console.error(err);
      setError("系統錯誤");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center">
      {/* 導覽列 */}
      <div
        className="fixed top-0 left-0 w-full shadow-lg p-2 z-50"
        style={{ backgroundColor: "#8EB9CC" }}
      >
        <div className="flex justify-between items-center">
          <ul className="menu flex gap-4 text-xl lg:text-3xl">
            <li>
              <Link href="/" className="font-bold" style={{ color: "#2C3E50" }}>
                首頁
              </Link>
            </li>
            <li>
              <a
                href="https://water.taiwanstat.com/"
                className="font-bold"
                style={{ color: "#2C3E50" }}
              >
                水情資訊
              </a>
            </li>
            <li>
              <a
                href="https://fhy.wra.gov.tw/fhyv2/alert/warn"
                className="font-bold"
                style={{ color: "#2C3E50" }}
              >
                天氣狀況
              </a>
            </li>
            <li>
              <Link
                href="/map"
                className="font-bold"
                style={{ color: "#2C3E50" }}
              >
                地圖路徑
              </Link>
            </li>
          </ul>
          <ul className="menu flex gap-4 text-xl lg:text-3xl">
            <li>
              <Link
                href="/pages/signup"
                className="font-bold"
                style={{ color: "#2C3E50" }}
              >
                註冊
              </Link>
            </li>
            <li>
              <Link
                href="/pages/signin"
                className="font-bold"
                style={{ color: "#2C3E50" }}
              >
                登入
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* 註冊表單 */}
      <div className="flex items-center justify-center pt-32 pb-10">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-center text-black mb-6">
            會員註冊
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="姓名"
              className="w-full px-4 py-2 border rounded"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="輸入密碼"
              className="w-full px-4 py-2 border rounded"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="確認密碼"
              className="w-full px-4 py-2 border rounded"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="w-full bg-[#005AB5] text-white py-2 px-4 rounded hover:bg-[#003f80] transition"
            >
              註冊
            </button>
          </form>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
}
