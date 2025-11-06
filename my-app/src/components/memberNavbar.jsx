// src/components/memberNavbar.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

// 定義不同角色的導覽列項目
const NAV_ITEMS = {
  member: [
    { name: "首頁", href: "/dashboard" },
    { name: "道路影像", href: "/pages/camerasearch" },
    { name: "天氣狀況", href: "/pages/weather" },
    { name: "地圖路徑", href: "/pages/map" },
    { name: "通報", href: "/pages/reports" },
    { name: "我的案件", href: "/pages/member-case" },
  ],
  volunteer: [
    { name: "首頁", href: "/dashboard" },
    { name: "道路影像", href: "/pages/camerasearch" },
    { name: "天氣狀況", href: "/pages/weather" },
    { name: "地圖路徑", href: "/pages/map" },
    { name: "通報", href: "/pages/reports" },
    { name: "志工接案", href: "/pages/volunteer-case" },
  ],
  admin: [
    { name: "首頁", href: "/dashboard" },
    { name: "道路影像", href: "/pages/camerasearch" },
    { name: "天氣狀況", href: "/pages/weather" },
    { name: "地圖路徑", href: "/pages/map" },
    { name: "通報", href: "/pages/reports" },
    { name: "AI辨識", href: "/pages/AI" },
    { name: "案件審核", href: "/pages/admin-case" },
    { name: "證照認證", href: "/pages/licenses" },
  ],
};

export default function MemberNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  // 取得使用者登入資訊
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/verify", { credentials: "include" });
        const data = await res.json();
        setUserData(data.isLogin ? data : null);
      } catch (err) {
        setUserData(null);
      }
    }
    fetchUser();
  }, []);

  // 登出
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  // 防止 userData 還沒抓到
  const role = userData?.role || "member";
  const navItems = NAV_ITEMS[role] || NAV_ITEMS["member"];

  return (
    <div className="fixed top-0 left-0 w-full bg-[#8EB9CC] shadow-lg p-3 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-6 px-2">
          <Image src="/logonew.svg" alt="Logo" width={40} height={40} />
        </div>

        {/* 桌機版 */}
        <div className="hidden md:flex justify-between items-center w-full text-xl lg:text-2xl">
          <ul className="flex gap-[12px] px-0">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="font-bold text-[#2C3E50] hover:text-blue-800 transition"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="flex gap-6 ml-8">
            {userData ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="font-bold text-red-600 hover:text-red-800"
                >
                  登出
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    href="/pages/signup"
                    className="font-bold text-[#2C3E50] hover:text-blue-600"
                  >
                    註冊
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pages/signin"
                    className="font-bold text-[#2C3E50] hover:text-blue-600"
                  >
                    登入
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* 手機版按鈕 */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#2C3E50]"
        >
          {menuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* 手機版選單 */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 md:hidden bg-[#BFD7E4] rounded-lg p-4 shadow-md"
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2 font-bold text-[#2C3E50]"
            >
              {item.name}
            </Link>
          ))}

          <div className="border-t border-blue-200 mt-2 pt-2">
            {userData ? (
              <button
                onClick={handleLogout}
                className="block w-full py-2 font-bold text-red-600 text-center"
              >
                登出
              </button>
            ) : (
              <>
                <Link
                  href="/pages/signup"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 font-bold text-[#2C3E50]"
                >
                  註冊
                </Link>
                <Link
                  href="/pages/signin"
                  onClick={() => setMenuOpen(false)}
                  className="block py-2 font-bold text-[#2C3E50]"
                >
                  登入
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
