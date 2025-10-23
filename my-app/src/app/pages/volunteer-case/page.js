'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VolunteerCasePage() {
  const [cases, setCases] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [completionPhoto, setCompletionPhoto] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/member", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        if (data.role !== "volunteer" && data.volunteerStatus !== "approved") {
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
      if (res.ok) {
        const data = await res.json();
        setCases(data);
      }
    };
    if (user && (user.role === "volunteer" || user.volunteerStatus === "approved")) fetchCases();
  }, [user]);

  const handleAction = async (caseId, action) => {
    if (action === "complete") {
      setSelectedCaseId(caseId);
      setError("");
      return; // 顯示上傳表單，不立即提交
    }

    const res = await fetch("/api/case", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caseId, action }),
      credentials: "include",
    });
    if (res.ok) {
      const updated = await res.json();
      setCases((prev) =>
        prev
          .map((c) => (c._id === updated.case._id ? updated.case : c))
          .filter((c) => c.status !== "completed")
      );
      alert("操作成功");
    } else {
      const errorData = await res.json();
      alert(errorData.error || "操作失敗");
    }
  };

  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (!completionPhoto) {
      setError("請上傳完成照片");
      return;
    }

    const formData = new FormData();
    formData.append("caseId", selectedCaseId);
    formData.append("action", "complete");
    formData.append("completionPhoto", completionPhoto);

    const res = await fetch("/api/case", {
      method: "PATCH",
      body: formData,
      credentials: "include",
    });
    if (res.ok) {
      const updated = await res.json();
      setCases((prev) =>
        prev
          .map((c) => (c._id === updated.case._id ? updated.case : c))
          .filter((c) => c.status !== "completed")
      );
      alert("操作成功，待管理員審核");
      setSelectedCaseId(null);
      setCompletionPhoto(null);
    } else {
      const data = await res.json();
      setError(data.error || "操作失敗");
    }
  };

  const handlePhotoChange = (e) => {
    setCompletionPhoto(e.target.files[0]);
    setError("");
  };

  if (!user || (user.role !== "volunteer" && user.volunteerStatus !== "approved"))
    return <p className="text-center mt-10">載入中或無權限...</p>;

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center">
      <div
        className="fixed top-0 left-0 w-full shadow-lg p-2 z-50"
        style={{ backgroundColor: "#8EB9CC" }}
      >
        <div className="flex justify-between items-center">
          <ul className="flex gap-4 text-xl">
            <li>
              <Link href="/dashboard" className="font-bold text-[#2C3E50]">
                首頁
              </Link>
            </li>
           
            <li>
              <Link href="/pages/volunteer-case" className="font-bold text-[#2C3E50]">
                志工接案
              </Link>
            </li>
            <li>
              <Link
                href="/pages/admin-case"
                className="font-bold text-[#2C3E50]"
                style={{ display: user?.role === "admin" ? "block" : "none" }}
              >
                案件審核
              </Link>
            </li>
            <li>
              <Link
                href="/pages/member-case"
                className="font-bold text-[#2C3E50]"
                style={{ display: user?.role === "member" ? "block" : "none" }}
              >
                我的案件
              </Link>
            </li>
          </ul>
          <ul className="flex gap-4 text-xl">
            {user ? (
              <li className="font-bold text-[#2C3E50]">歡迎, {user.name}</li>
            ) : (
              <>
                <li>
                  <Link href="/pages/signup" className="font-bold text-[#2C3E50]">
                    註冊
                  </Link>
                </li>
                <li>
                  <Link href="/pages/signin" className="font-bold text-[#2C3E50]">
                    登入
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="pt-24 px-4 sm:px-20 flex flex-col items-start gap-8 w-full max-w-4xl" style={{color: 'black'}}>
        <h1 className="text-3xl font-bold">志工接案</h1>
        {cases.length === 0 && <p>目前沒有可接案件</p>}
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
                awaiting_review: "待審核完成",
                completed: "已完成",
              }[c.status] || c.status}
            </p>
            {c.photoUrl ? (
              <img
                src={c.photoUrl}
                alt="案件圖片"
                className="w-full max-w-xs h-auto mt-2 rounded"
                onError={(e) => console.error("Image load error:", c.photoUrl)}
              />
            ) : (
              <p>
                <strong>圖片:</strong> 無圖片
              </p>
            )}
            {c.volunteers && c.volunteers.length > 0 && (
              <p>
                <strong>志工:</strong> {c.volunteers.join("、")}
              </p>
            )}
            {c.status === "approved" && (
              <button
                onClick={() => handleAction(c._id, "take")}
                className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
              >
                接案
              </button>
            )}
            {c.status === "in_progress" && c.volunteers?.includes(user.email) && (
              <button
                onClick={() => handleAction(c._id, "complete")}
                className="bg-purple-500 text-white px-2 py-1 rounded mt-2"
              >
                完成案件
              </button>
            )}
            {selectedCaseId === c._id && (
              <form onSubmit={handleCompleteSubmit} className="mt-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="border p-2 w-full mb-2"
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  上傳完成照片並提交
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}