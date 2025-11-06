// src/components/Navbar.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "首頁", href: "/" },
    { name: "道路影像", href: "/pages/camerasearch" },
    { name: "天氣狀況", href: "/pages/weather" },
    { name: "地圖路徑", href: "/pages/map"},
    
  ];

  const authItems = [
    { name: "註冊", href: "/pages/signup" },
    { name: "登入", href: "/pages/signin" },
  ];

  return (
    <div className="fixed top-0 left-0 w-full bg-[#8EB9CC] shadow-lg p-3 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-6 px-2">
          <Image src="/logonew.svg" alt="Logo" width={40} height={40} />
        </div>

        {/* 桌機版 */}
        <div className="hidden md:flex justify-between items-center w-full text-xl lg:text-2xl ">
          <ul className="flex gap-[12px] px-0">
            {navItems.map((item) =>
              item.external ? (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#2C3E50] hover:text-blue-800 transition"
                  >
                    {item.name}
                  </a>
                </li>
              ) : (
                <li key={item.name}>
                  <Link href={item.href} className="font-bold text-[#2C3E50] hover:text-blue-800 transition">
                    {item.name}
                  </Link>
                </li>
              )
            )}
          </ul>
          <ul className="flex gap-6 ml-8">
            {authItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="font-bold text-[#2C3E50] hover:text-blue-600">
                  {item.name}
                </Link>
              </li>
            ))}
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
          {navItems.map((item) =>
            item.external ? (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="block py-2 font-bold text-[#2C3E50]"
              >
                {item.name}
              </a>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2 font-bold text-[#2C3E50]"
              >
                {item.name}
              </Link>
            )
          )}
          <div className="border-t border-blue-200 mt-2 pt-2">
            {authItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2 font-bold text-[#2C3E50]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}