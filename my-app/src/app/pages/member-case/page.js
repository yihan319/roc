'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MemberCasePage() {
  const [cases, setCases] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/member", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        if (data.role !== "member") {
          alert("無權限訪問此頁面");
          router.push("/dashboard");
        }
      } else {
        router.push("/pages/signin");
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchCases = async () => {
      const res = await fetch("/api/case", { credentials: "include" });
      if (res.ok) setCases(await res.json());
    };
    if (user && user.role === "member") fetchCases();
  }, [user]);

  if (!user || user.role !== "member") return <p className="text-center mt-10">載入中或無權限...</p>;

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center">
      <div className="fixed top-0 left-0 w-full shadow-lg p-2 z-50" style={{ backgroundColor: '#8EB9CC' }}>
        <div className="flex justify-between items-center">
          <ul className="flex gap-4 text-xl">
            <li><Link href="/dashboard" className="font-bold text-[#2C3E50]">首頁</Link></li>
            <li><Link href="/pages/member-case" className="font-bold text-[#2C3E50]">我的案件</Link></li>
            <li><Link href="/pages/admin-case" className="font-bold text-[#2C3E50]" style={{ display: user?.role === "admin" ? "block" : "none" }}>案件審核</Link></li>
            <li><Link href="/pages/volunteer-case" className="font-bold text-[#2C3E50]" style={{ display: user?.role === "volunteer" ? "block" : "none" }}>志工接案</Link></li>
          </ul>
          <ul className="flex gap-4 text-xl">
            {user ? (
              <li className="font-bold text-[#2C3E50]">歡迎, {user.name}</li>
            ) : (
              <>
                <li><Link href="/pages/signup" className="font-bold text-[#2C3E50]">註冊</Link></li>
                <li><Link href="/pages/signin" className="font-bold text-[#2C3E50]">登入</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="pt-24 px-4 sm:px-20 flex flex-col items-start gap-8 w-full max-w-4xl">
        <h1 className="text-3xl font-bold" style={{color: 'black'}}>我的案件</h1>
        {cases.length === 0 && <p>目前沒有案件</p>}
        {cases.map(c => (
          <div key={c._id} className="border p-4 mb-4 rounded bg-white w-full" style={{color: 'black'}}>
            <p><strong>姓名:</strong> {c.name}</p>
            <p><strong>Gmail:</strong> {c.email}</p>
            <p><strong>電話:</strong> {c.phone}</p>
            <p><strong>地址:</strong> {c.address}</p>
            <p><strong>描述:</strong> {c.detail}</p>
            <p>
              <strong>狀態:</strong>{" "}
              {{
                pending: "審核中",
                approved: "審核通過",
                rejected: "已拒絕",
                in_progress: "處理中",
                completed: "已完成",
              }[c.status] || c.status}
            </p>
            {c.photoUrl ? (
              <img src={c.photoUrl} alt="案件圖片" className="w-full max-w-xs h-auto mt-2 rounded" />
            ) : (
              <p><strong>圖片:</strong> 無圖片</p>
            )}
            {c.status === "rejected" && (
              <p className="text-red-500 mt-2">此案件已被拒絕</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}