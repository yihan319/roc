'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function LicensesPage() {
  const [members, setMembers] = useState([]);

 
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch("/api/licenses", { cache: "no-store" });
        if (!res.ok) throw new Error("無法取得會員資料");
        const data = await res.json();
        setMembers(data);
      } catch (error) {
        console.error("❌ 取得會員錯誤:", error);
      }
    };
    fetchMembers();
  }, []);

  
  // pages/licenses/page.js
// pages/licenses/page.js
const handleApprove = async (memberId) => {
  try {
    const res = await fetch("/api/licenses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId, status: "approved" }),
    });
    if (!res.ok) throw new Error("更新失敗");
    const data = await res.json(); // 取得回應數據

    // 更新 Token（如果後端返回新 Token）
    if (data.token) {
      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
    }

    setMembers((prev) => prev.filter((m) => m._id !== memberId));
    alert("✅ 該會員已通過審核！");
  } catch (error) {
    console.error("❌ 通過失敗:", error);
    alert("❌ 審核失敗");
  }
};

const handleDeleteMember = async (memberId) => {
  if (!confirm("確定要拒絕並刪除申請嗎？")) return;

  try {
    const res = await fetch("/api/licenses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId }),
    });
    if (!res.ok) throw new Error("刪除失敗");
    
    setMembers((prev) => prev.filter((m) => m._id !== memberId));
    alert("✅ 申請已拒絕並刪除");
  } catch (err) {
    alert("❌ 刪除失敗");
  }
};

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center font-[family-name:var(--font-geist-sans)]">
      <div className="fixed top-0 left-0 w-full shadow-lg p-2 z-50" style={{ backgroundColor: "#8EB9CC" }}>
        <div className="flex justify-between items-center">
          <ul className="menu flex gap-4 text-xl lg:text-3xl">
            <li><Link href="/dashboard" className="font-bold text-[#2C3E50]">首頁</Link></li>
            
            <li><Link href="/pages/licenses" className="font-bold text-[#2C3E50]">證照認證</Link></li>
          </ul>
        </div>
      </div>

   
      <div className="pt-24 px-4 sm:px-20 flex flex-col items-start gap-8 w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-4">志工會員證照管理</h1>
        {members.length === 0 && <p className="text-gray-500">目前沒有志工會員或證照</p>}

        {members.map((member) => (
          <div key={member._id} className="bg-white shadow-md rounded-lg p-4 mb-4 w-full relative">
            
           
            <div className="absolute bottom-2 right-2 flex gap-2">
              <button
                onClick={() => handleDeleteMember(member._id)}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
              >
                未通過
              </button>
              <button
                onClick={() => handleApprove(member._id)}
                className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
              >
                通過
              </button>
            </div>

            <h2 className="text-xl font-semibold">{member.name} ({member.email})</h2>

            {member.licenses.length > 0 ? (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {member.licenses.map((license, index) =>
                  license && license.url && license.url.startsWith("/uploads/") ? (
                    <div key={index} className="border p-2 rounded">
                      <img
                        src={license.url}
                        alt={`證照 ${license.category || "未分類"}`}
                        className="w-full h-40 object-cover rounded"
                      />
                      <p className="text-sm text-gray-500 mt-1">{license.category || "未分類"}</p>
                    </div>
                  ) : (
                    <p key={index} className="text-red-500">
                      無效的證照資料（索引 {index}）：{JSON.stringify(license)}
                    </p>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500 mt-2">尚未上傳證照</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
