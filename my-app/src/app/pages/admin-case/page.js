'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
export default function AdminCasePage() {
  const [cases, setCases] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();
useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/member", { credentials: "include" });
      if (!res.ok) throw new Error("無法取得使用者資料");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("❌ 取得使用者資料失敗:", err);
    }
  };

  fetchUser();
}, []);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/member", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        if (data.role !== "admin") {
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
      const res = await fetch("/api/case?forAdmin=true", { credentials: "include" });
      if (res.ok) setCases(await res.json());
    };
    if (user && user.role === "admin") fetchCases();
  }, [user]);
  


  const handleAction = async (caseId, action, reason = "") => {
  const res = await fetch("/api/case", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ caseId, action, reason }),
    credentials: "include",
  });
    if (res.ok) {
      const updated = await res.json();
      setCases((prev) => prev.filter((c) => c._id !== updated.case._id));
      alert("操作成功");
    } else {
      const errorData = await res.json();
      alert(errorData.error || "操作失敗");
    }
  };

  if (!user || user.role !== "admin") return <p className="text-center mt-10">載入中或無權限...</p>;

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center font-[family-name:var(--font-geist-sans)]">
     <Navbar user={user} />
      <div className="pt-24 px-4 sm:px-20 flex flex-col items-start gap-8 w-full max-w-4xl">
        <h1 className="text-3xl font-bold">案件審核 (管理員專用)</h1>
        {cases.length === 0 && <p>目前沒有待審核案件</p>}
        {cases.map((c) => (
          <div key={c._id} className="border p-4 mb-4 rounded bg-white w-full">
            <p>
              <strong>姓名:</strong> {c.name}
            </p>
            <p>
              <strong>Gmail:</strong> {c.email}
            </p>
            <p>
              <strong>電話:</strong> {c.phone}
            </p>
            <p>
              <strong>地址:</strong> {c.address}
            </p>
            <p>
              <strong>描述:</strong> {c.detail}
            </p>
            <p>
              <strong>狀態:</strong>{" "}
              {{
  pending: "審核中",
  approved: "已核准",
  rejected: "已拒絕",
  in_progress: "處理中",
  awaiting_review: "等待管理員審核",
  completed: "已完成",
}[c.status]
 || c.status}
            </p>
            {c.volunteers && c.volunteers.length > 0 ? (
              <p>
                <strong>志工:</strong> {c.volunteers.join("、")}
              </p>
            ) : (
              <p>
                <strong>志工:</strong> 尚無志工接案
              </p>
            )}
            {c.completionPhotoUrl && (
  <div className="mt-2">
    <strong>完成照片：</strong>
    <img
      src={c.completionPhotoUrl}
      alt="完成照片"
      className="w-full max-w-xs h-auto rounded"
    />
  </div>
)}

            {c.photoUrl ? (
              <img
                src={
                  typeof c.photoUrl === "string" && c.photoUrl.startsWith("http")
                    ? c.photoUrl
                    : `http://localhost:3000${c.photoUrl || ""}`
                }
                alt="案件圖片"
                className="w-full max-w-xs h-auto mt-2 rounded"
                onError={(e) => console.error("Image load error:", c.photoUrl)}
              />
            ) : (
              <p>
                <strong>圖片:</strong> 無圖片
              </p>
            )}
            {c.status === "pending" && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleAction(c._id, "approve")}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  通過
                </button>
                <button
  onClick={() => {
    const reason = prompt("請輸入退回理由：", "照片模糊或不清晰");
    if (reason !== null) handleAction(c._id, "reject_completion", reason);
  }}
  className="bg-red-500 text-white px-2 py-1 rounded"
>
  退回
</button>

              </div>
            )}
            {c.status === "awaiting_review" && (
  <div className="flex gap-2 mt-2">
    <button
      onClick={() => handleAction(c._id, "approve_completion")}
      className="bg-green-500 text-white px-2 py-1 rounded"
    >
      通過完成
    </button>
    <button
  onClick={() => {
    const reason = prompt("請輸入退回理由：", "照片模糊或不清晰");
    if (reason !== null) handleAction(c._id, "reject_completion", reason);
  }}
  className="bg-red-500 text-white px-2 py-1 rounded"
>
  退回
</button>

  </div>
)}

          </div>
        ))}
      </div>
    </div>
  );
}