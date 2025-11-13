'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // <-- 引入 useRouter
import Image from "next/image";
import Navbar from "@/components/Navbar";
export default function InformPage() {
  const router = useRouter(); // <-- 初始化 router
  const [fields, setFields] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    detail: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  // 檢查使用者是否登入
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/member", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          const error = await res.json().catch(() => ({}));
        if (error.error === "請先登入") {
          router.push("/pages/signin");
          } else {
          setUser(null); // 允許志工繼續（後端 POST 會再驗證）
        }
        }
      } catch (err) {
        console.error("Fetch user failed:", err);
        router.push("/pages/signin");
      }
    };
    fetchUser();
  }, [router]);

  const handleChange = (e) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
  const selectedFiles = Array.from(e.target.files || []);
  
  // 檢查數量（最多 5 張）
  if (selectedFiles.length > 5) {
    setMessage("最多只能上傳 5 張圖片");
    setFile([]);
    return;
  }

  // 檢查每張檔案
  const validFiles = selectedFiles.filter(file => {
    if (!file.type.startsWith("image/")) {
      setMessage("只能上傳圖片檔案");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage(`${file.name} 超過 5MB`);
      return false;
    }
    return true;
  });

  setFile(validFiles);
  setMessage(validFiles.length > 0 ? `已選擇 ${validFiles.length} 張圖片` : "");
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("❌ 請先登入以提交通報");
      alert("❌ 請先登入");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(fields).forEach(([k, v]) => data.append(k, v));
      if (file && file.length > 0) {
      file.forEach((f, index) => {
        data.append("files", f); // 注意：後端要用 "files"
      });
    }

      const res = await fetch("/api/reports", {
        method: "POST",
        body: data,
        credentials: "include",
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: "無法解析後端回應" }));
        throw new Error(json.error || `狀態碼: ${res.status}`);
      }

      await res.json();
      setFields({ name: "", email: "", address: "", phone: "", detail: "" });
      setFile(null);
      alert("✅ 通報成功！");
    } catch (err) {
      setMessage(`❌ 發送失敗，請稍後再試: ${err.message}`);
      alert(`❌ 發送失敗，請稍後再試: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center font-[family-name:var(--font-geist-sans)]">
       <Navbar user={user} />

      <div className="max-w-lg mx-auto mt-24 p-6 border rounded shadow bg-white w-full">
        <h1 className="text-2xl font-bold mb-4" style={{color: 'black'}}>通報表單</h1>
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <input
              name="name"
              value={fields.name}
              onChange={handleChange}
              placeholder="姓名"
              className="w-full p-2 border rounded"
              style={{color: 'black'}}
              required
            />
            <input
              name="email"
              value={fields.email}
              onChange={handleChange}
              placeholder="Gmail"
              type="email"
              className="w-full p-2 border rounded"
              style={{color: 'black'}}
              required
            />
            <input
              name="address"
              value={fields.address}
              onChange={handleChange}
              placeholder="地址"
              className="w-full p-2 border rounded"
              style={{color: 'black'}}
              required
            />
            <input
              name="phone"
              value={fields.phone}
              onChange={handleChange}
              placeholder="電話"
              className="w-full p-2 border rounded"
              style={{color: 'black'}}
              required
            />
            <textarea
              name="detail"
              value={fields.detail}
              onChange={handleChange}
              placeholder="詳細描述"
              className="w-full p-2 border rounded"
              style={{color: 'black'}}
              required
            />
            <input
              type="file"
              name="files"
              accept="image/*"
              multiple
              onChange={handleFile}
              className="w-full p-2 border rounded"
              style={{color: 'black'}}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              送出
            </button>
          </form>
        ) : (
          <p className="text-red-500">請先登入以提交通報</p>
        )}
      </div>

      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
}
