'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function VolunteerCasePage() {
  const [cases, setCases] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [completionPhotos, setCompletionPhotos] = useState([]);
  const [detail, setDetail] = useState("");
  const [error, setError] = useState("");

  // 檢查登入與權限
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/member", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        const isVolunteer = data.role === "volunteer" || data.volunteerStatus === "approved";
        const isAdmin = data.role === "admin";
        if (!isVolunteer && !isAdmin) {
          alert("無權限訪問此頁面");
          router.push("/dashboard");
        }
      } else {
        router.push("/pages/signin");
      }
    };
    fetchUser();
  }, [router]);

  // 載入案件
  useEffect(() => {
    const fetchCases = async () => {
      const res = await fetch("/api/case", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setCases(data);
      }
    };
    if (user) fetchCases();
  }, [user]);

  // 接案 / 完成
  const handleAction = async (caseId, action) => {
    if (action === "complete") {
      setSelectedCaseId(caseId);
      setDetail("");
      setCompletionPhotos([]);
      setError("");
      return;
    }

    const res = await fetch("/api/case", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caseId, action }),
      credentials: "include",
    });

    if (res.ok) {
      const updated = await res.json();
      setCases(prev =>
        prev.map(c => c._id === updated.case._id ? updated.case : c)
      );
      alert("操作成功");
    } else {
      const err = await res.json();
      alert(err.error || "操作失敗");
    }
  };

  // 提交完成照片
  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (completionPhotos.length === 0) {
      setError("請上傳至少一張完成照片");
      return;
    }

    const formData = new FormData();
    formData.append("caseId", selectedCaseId);
    formData.append("action", "complete");
    formData.append("detail", detail);
    completionPhotos.forEach(file => {
      formData.append("completionPhoto", file);
    });

    const res = await fetch("/api/case", {
      method: "PATCH",
      body: formData,
      credentials: "include",
    });

    if (res.ok) {
      const updated = await res.json();
      setCases(prev =>
        prev.map(c => c._id === updated.case._id ? updated.case : c)
      );
      alert("已提交，待管理員審核");
      setSelectedCaseId(null);
    } else {
      const err = await res.json();
      setError(err.error || "提交失敗");
    }
  };

  if (!user) return <p className="text-center mt-10">載入中...</p>;

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center">
      <Navbar user={user} />
      <div className="pt-24 px-4 sm:px-20 w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6" style={{ color: 'black' }}>志工接案</h1>

        {cases.length === 0 ? (
          <p className="text-gray-600">目前沒有可接案件</p>
        ) : (
          cases.map(c => (
            <div key={c._id} className="border p-4 mb-6 rounded bg-white shadow">
              {/* 退回理由 */}
              {c.rejectionNote && (
                <p className="text-red-600 font-semibold mb-2">
                  Warning: {c.rejectionNote}
                </p>
              )}

              <p><strong>姓名:</strong> {c.name}</p>
              <p><strong>Gmail:</strong> {c.email}</p>
              <p><strong>電話:</strong> {c.phone}</p>
              <p><strong>地址:</strong> {c.address}</p>
              <p><strong>描述:</strong> {c.detail}</p>
              <p><strong>狀態:</strong> {
                {
                  pending: "審核中",
                  approved: "可接案",
                  in_progress: "處理中",
                  awaiting_review: "待審核完成",
                  completed: "已完成",
                }[c.status] || c.status
              }</p>

              {/* 多張通報照片 */}
              {c.photoUrls && c.photoUrls.length > 0 ? (
                <div className="mt-3">
                  <strong>通報照片：</strong>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {c.photoUrls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`通報圖片 ${i + 1}`}
                        className="w-full h-40 object-cover rounded border"
                        onError={e => e.target.src = "/placeholder.jpg"}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p><strong>通報照片：</strong> 無圖片</p>
              )}

              {/* 志工名單 */}
              {c.volunteers?.length > 0 && (
                <p><strong>志工:</strong> {c.volunteers.join("、")}</p>
              )}

              {/* 接案按鈕 */}
              {c.status === "approved" && (
                <button
                  onClick={() => handleAction(c._id, "take")}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  接案
                </button>
              )}

              {/* 完成按鈕 */}
              {c.status === "in_progress" && c.volunteers?.includes(user.email) && (
                <button
                  onClick={() => handleAction(c._id, "complete")}
                  className="mt-3 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 ml-2"
                >
                  完成案件
                </button>
              )}

              {/* 完成表單 */}
              {selectedCaseId === c._id && (
                <form onSubmit={handleCompleteSubmit} className="mt-4 p-4 border rounded bg-gray-50">
                  <textarea
                    value={detail}
                    onChange={e => setDetail(e.target.value)}
                    placeholder="請描述現場情況及志工實際執行的行動"
                    className="w-full p-2 border rounded mb-3"
                    style={{ color: 'black' }}
                    required
                  />
                  <p className="font-medium mb-1">上傳完成照片（可多張）</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => setCompletionPhotos(Array.from(e.target.files))}
                    className="w-full p-2 border rounded mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      提交完成
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCaseId(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      取消
                    </button>
                  </div>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}