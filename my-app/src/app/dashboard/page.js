"use client";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [cases, setCases] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    licenses: [],
    licensePhoto: null,
  });
  const [error, setError] = useState("");

// dashboard/page.js
useEffect(() => {
  const fetchData = async () => {
    try {
      const userRes = await fetch("/api/member", { credentials: "include" });
      if (!userRes.ok) throw new Error(`HTTP error! status: ${userRes.status}`);
      const userData = await userRes.json();
      console.log("Fetched user data:", userData);
      setUser(userData);

      if (userData) {
        const caseRes = await fetch("/api/case", { credentials: "include" });
        if (!caseRes.ok) {
          const errorData = await caseRes.json().catch(() => ({ error: "未知錯誤" }));
          console.error("Failed to fetch cases:", errorData.error);
          setCases([]); // 即使 401 也設置空陣列，避免崩潰
        } else {
          const caseData = await caseRes.json();
          setCases(caseData);
        }
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setUser(null);
      setCases([]);
    }
  };

  fetchData();
}, []); // 僅在掛載時執行
  // 狀態對照表
  const statusLabels = {
    pending: "審核中",
    approved: "審核通過",
    rejected: "已退回",
    in_progress: "處理中",
    completed: "已完成",
    available: "可接案件",
  };

  // 根據身分顯示不同的分頁
  const getTabsByRole = () => {
    if (user?.role === "admin" || user?.role === "volunteer") {
      return [
        { key: "all", label: "全部案件" },
        { key: "pending", label: "審核中" },
        { key: "approved", label: "審核通過" },
       
        { key: "in_progress", label: "處理中" },
        { key: "completed", label: "已完成" },
      ];
    } else {
      return [
        { key: "all", label: "全部案件" },
        { key: "pending", label: "審核中" },
        { key: "completed", label: "已完成" },
      ];
    }
  };

  // 篩選案件
  const filteredCases = (() => {
    if (activeTab === "all") return cases;
    if (activeTab === "rejected") {
      return cases.filter((c) =>  c.rejectionNotes && c.rejectionNotes.length > 0);
  }
    if (user?.role === "volunteer" && activeTab === "available") {
      return cases.filter((c) => c.status === "approved" && (!c.volunteerId || c.volunteerId === ""));
    }

    return cases.filter((c) => c.status === activeTab);
  })();

  // 處理志工申請提交
 const handleVolunteerSubmit = async (e) => {
  e.preventDefault();
  if (!formData.licenses.length) {
    setError("請上傳至少一張志工證照");
    return;
  }

  const formDataToSend = new FormData();
  formData.licenses.forEach((item) => {
    formDataToSend.append("licenses", item.file);
    formDataToSend.append("licenseCategories", item.customCategory || item.category);
  });

  try {
    const res = await fetch("/api/licenses", {
      method: "POST",
      body: formDataToSend,
      credentials: "include",
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "未知錯誤" }));
      throw new Error(errorData.error || "伺服器錯誤");
    }
    const data = await res.json();
    alert(data.message || "申請已提交，等待審核");
    setShowVolunteerForm(false);
    setFormData({ licenses: [] });

    // 重新抓取使用者資料
    const newUserRes = await fetch("/api/member", { credentials: "include" });
    if (newUserRes.ok) setUser(await newUserRes.json());
  } catch (err) {
    console.error("Volunteer application failed:", err);
    setError(err.message);
  }
};

  const handleLicenseChange = (e) => {
    const newLicenses = Array.from(e.target.files || []).map((file) => ({
      file,
      category: "",
      customCategory: "",
    }));
    setFormData({ ...formData, licenses: newLicenses });
  };

  const handleLicenseCategoryChange = (index, field, value) => {
    const newLicenses = [...formData.licenses];
    newLicenses[index][field] = value;
    setFormData({ ...formData, licenses: newLicenses });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center font-[family-name:var(--font-geist-sans)]">
     <Navbar user={user} />
      
      


      {/* 主內容 */}
      <div className="pt-24 px-4 sm:px-20 flex flex-col items-start gap-8 w-full max-w-5xl" style={{ color: "black" }}>
        {/* 頁面標題 */}
        <div className="flex items-center gap-4">
          <Image src="/logonew.svg" alt="logo" width={50} height={50} className="h-25 w-30" />
          <h1 className="text-3xl lg:text-5xl font-bold py-1 text-left">
            淹水預測及通報系統
            <p className="text-sm lg:text-xl py-1">會員管理中心</p>
          </h1>
        </div>

        {/* 個人資訊 */}
        {user ? (
          <div className="w-full bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold">個人資訊</h2>
            <p className="text-gray-700 mt-2">姓名: {user.name}</p>
            <p className="text-gray-700 mt-1">Email: {user.email}</p>
            <p className="text-gray-700 mt-1">
              角色: {user.role === "admin" ? "管理員" : user.role === "volunteer" ? "志工" : "一般會員"}
            </p>

            {/* 志工申請狀態小卡（只給一般會員） */}
            {user.role === "member" && user.volunteerStatus && (
              <div
                className={`mt-4 p-4 rounded-lg border ${
                  user.volunteerStatus === "approved"
                    ? "bg-green-100 border-green-500"
                    : user.volunteerStatus === "pending"
                    ? "bg-yellow-100 border-yellow-500"
                    : "bg-red-100 border-red-500"
                }`}
              >
                <p className="font-semibold">
                  志工申請狀態：
                  {user.volunteerStatus === "approved" && "✅ 已通過"}
                  {user.volunteerStatus === "pending" && "⌛ 審核中"}
                  {user.volunteerStatus === "rejected" && "❌ 已被拒絕"}
                </p>
              </div>
            )}

            {/* 申請志工按鈕（僅在 not_applied 或 rejected 時顯示） */}
            {user.role === "member" && (user.volunteerStatus === "not_applied" || user.volunteerStatus === "rejected") && (
              <button
                onClick={() => setShowVolunteerForm(true)}
                className="mt-4 bg-[#005AB5] text-white px-4 py-2 rounded hover:bg-[#003f80]"
              >
                申請成為志工
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-500">正在載入使用者資料...</p>
        )}

        {/* 志工申請表單 */}
        {showVolunteerForm && (
          <div className="w-full bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">申請成為志工</h2>
            <form onSubmit={handleVolunteerSubmit} className="space-y-4">
              <div>
                <input
                  type="file"
                  name="licenses"
                  accept="image/*,application/pdf"
                  className="w-full px-4 py-2 border rounded"
                  onChange={handleLicenseChange}
                  multiple
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  可上傳多張志工證照 (jpg/png/pdf)，並為每張選擇類別
                </p>

                {formData.licenses.map((item, index) => (
                  <div key={index} className="mt-2 p-2 border rounded">
                    <p className="text-sm font-semibold">{item.file.name}</p>
                    <select
                      className="mt-1 w-full border px-2 py-1 rounded"
                      value={item.category}
                      onChange={(e) =>
                        handleLicenseCategoryChange(index, "category", e.target.value)
                      }
                    >
                      <option value="">請選擇證照類別</option>
                      <option value="emergency">急救證照</option>
                      <option value="teaching">教學證照</option>
                      <option value="other">其他</option>
                    </select>
                    {item.category === "other" && (
                      <input
                        type="text"
                        placeholder="請輸入證照類別"
                        className="mt-2 w-full border px-2 py-1 rounded"
                        value={item.customCategory}
                        onChange={(e) =>
                          handleLicenseCategoryChange(index, "customCategory", e.target.value)
                        }
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="bg-[#005AB5] text-white py-2 px-4 rounded hover:bg-[#003f80] transition"
              >
                送出
              </button>
            </form>
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </div>
        )}

        {/* 案件總覽區 */}
        <div className="w-full bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">案件總覽</h2>

          {/* Tabs */}
          <div className="flex flex-wrap gap-3 border-b pb-2 mb-4">
            {getTabsByRole().map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  activeTab === tab.key
                    ? "bg-[#005AB5] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 案件內容 */}
          {filteredCases.length === 0 ? (
  <p className="text-gray-500 text-center">目前無此分類的案件</p>
) : (
  filteredCases.map((c) => (
    <div key={c._id} className="border p-4 mb-4 rounded bg-gray-50">
      <p>
        <strong>姓名:</strong> {c.name}
      </p>
      <p>
        <strong>地址:</strong> {c.address}
      </p>
      <p>
        <strong>狀態:</strong> {statusLabels[c.status] || c.status}
      </p>

      {/* ✅ 顯示審核通過與完成時間 */}
      {c.status === "approved" && (
        <p className="text-sm text-gray-500">
          審核通過時間：{c.updatedAt ? new Date(c.updatedAt).toLocaleString() : "—"}
        </p>
      )}

      {c.status === "completed" && (
        <>
          <p className="text-sm text-gray-500">
            完成時間：{c.updatedAt ? new Date(c.updatedAt).toLocaleString() : "—"}
          </p>
           {c.rejectionNotes && c.rejectionNotes.length > 0 && (
  <div className="mt-2 p-2 border rounded bg-red-50">
    <p className="font-semibold text-red-600">退回紀錄：</p>
    <ul className="list-disc ml-5 text-sm text-gray-700">
      {c.rejectionNotes.map((r, idx) => (
        <li key={idx}>
          {r.time ? new Date(r.time).toLocaleString() : "—"} - {r.by}: {r.reason}
        </li>
      ))}
    </ul>
  </div>
)}

          {/* ✅ 顯示志工 Gmail */}
          {c.volunteers && c.volunteers.length > 0 && (
            <div className="mt-2 text-sm text-gray-700 border-t border-gray-200 pt-2">
              <p className="font-medium">志工 Gmail：</p>
              {c.volunteers.map((vol, i) => (
                <p key={i} className="pl-2 text-gray-600">• {vol}</p>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  ))
)}

        </div>
      </div>
    </div>
  );
}