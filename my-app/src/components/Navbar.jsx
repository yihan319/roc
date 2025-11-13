'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

// 共用選單（登入前後都有）
const COMMON_ITEMS = [
  { name: '首頁', href: '/' },
  { name: '道路影像', href: '/pages/camerasearch' },
  { name: '天氣狀況', href: '/pages/weather' },
  { name: '地圖路徑', href: '/pages/map' },
];

// 各角色專屬選單（不含共用）
const ROLE_MENUS = {
  member: [
    { name: '通報', href: '/pages/reports' },
    { name: '我的案件', href: '/pages/member-case' },
    { name: '會員頁面', href: '/dashboard' },
  ],
  volunteer: [
    { name: '通報', href: '/pages/reports' },
    { name: '志工接案', href: '/pages/volunteer-case' },
    { name: '會員頁面', href: '/dashboard' },
  ],
  admin: [
    { name: '通報', href: '/pages/reports' },
    { name: 'AI辨識', href: '/pages/AI' },
    { name: '案件審核', href: '/pages/admin-case' },
    { name: '證照認證', href: '/pages/licenses' },
    { name: '會員頁面', href: '/dashboard' },
  ],
};

export default function Navbar() {
  const [user, setUser] = useState(null); // { role, ... }
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const router = useRouter();

  // 取得登入狀態
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/verify', { credentials: 'include' });
        const data = await res.json();
        setUser(data.isLogin ? data : null);
      } catch (err) {
        setUser(null);
      }
    }
    checkAuth();
  }, []);

  const role = user?.role || 'guest';
  const isLoggedIn = role !== 'guest';

  // 登出
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  // 點專區（未登入 → 註冊）
  const handleZoneClick = (zone) => {
    if (!isLoggedIn) {
      router.push('/pages/signup');
    }
  };

  // 渲染下拉選單
  const renderDropdown = (title, items, zone) => {
    const isOpen = openDropdown === zone;

    return (
      <div className="relative group">
        <button
          onClick={() => handleZoneClick(zone)}
          className={`flex items-center gap-1 px-3 py-1 text-lg font-bold text-[#2C3E50] hover:text-blue-800 transition ${
            !isLoggedIn ? 'cursor-pointer' : ''
          }`}
        >
          {title}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* 下拉內容 */}
        {(isLoggedIn || isOpen) && (
          <div
            className={`absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border transition-all ${
              isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            } group-hover:opacity-100 group-hover:visible z-50`}
            onMouseEnter={() => setOpenDropdown(zone)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setOpenDropdown(null)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  // 組合完整選單（共用 + 專屬）
  const fullNavItems = [
    ...COMMON_ITEMS,
    ...(ROLE_MENUS[role] || []),
  ];

  return (
    <div className="fixed top-0 left-0 w-full bg-[#8EB9CC] shadow-lg p-3 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-6 px-2">
          <Image src="/logonew.svg" alt="Logo" width={40} height={40} />
        </Link>

        {/* 桌機版 */}
        <div className="hidden md:flex items-center justify-between w-full text-xl lg:text-2xl">
          <ul className="flex gap-4 items-center">
            {COMMON_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-bold text-[#2C3E50] hover:text-blue-800 transition"
                >
                  {item.name}
                </Link>
              </li>
            ))}

            {/* 一般會員專區 */}
            {(role === 'member' || role === 'guest'|| role === 'admin') &&
              renderDropdown('一般會員專區', [...ROLE_MENUS.member], 'member','admin')}

            {/* 志工專區 */}
            {(role === 'volunteer' || role === 'admin' ) &&
              renderDropdown('志工專區', [...ROLE_MENUS.volunteer], 'volunteer','admin')}

            {/* 管理員專區 */}
            {role === 'admin' &&
              renderDropdown('管理員專區', [...ROLE_MENUS.admin], 'admin')}
          </ul>

          {/* 右側按鈕 */}
          <div className="flex gap-6 ml-8">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="font-bold text-red-600 hover:text-red-800"
              >
                登出
              </button>
            ) : (
              <>
                <Link
                  href="/pages/signup"
                  className="font-bold text-[#2C3E50] hover:text-blue-600"
                >
                  註冊
                </Link>
                <Link
                  href="/pages/signin"
                  className="font-bold text-[#2C3E50] hover:text-blue-600"
                >
                  登入
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 手機版漢堡 */}
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
          {fullNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2 font-bold text-[#2C3E50]"
            >
              {item.name}
            </Link>
          ))}

          <div className="border-t border-blue-200 mt-2 pt-2">
            {isLoggedIn ? (
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