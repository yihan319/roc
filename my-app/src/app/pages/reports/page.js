'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // <-- 引入 useRouter

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
          router.push("/pages/signin");
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
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/") && selectedFile.size < 5 * 1024 * 1024) {
      setFile(selectedFile);
      setMessage("");
    } else {
      setMessage("❌ 請上傳小於5MB的圖片檔案");
      setFile(null);
    }
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
      if (file) data.append("file", file);

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
      alert("✅ 通報成功，資料已儲存！");
    } catch (err) {
      setMessage(`❌ 發送失敗，請稍後再試: ${err.message}`);
      alert(`❌ 發送失敗，請稍後再試: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-[family-name:var(--font-geist-sans)] flex flex-col items-center justify-center">
      <div className="fixed top-0 left-0 w-full shadow-lg p-2 z-50" style={{ backgroundColor: '#8EB9CC' }}>
        <div className="flex justify-between items-center">
          <ul className="menu flex gap-4 text-xl lg:text-3xl">
            <li><Link href="/dashboard" className="font-bold" style={{ color: '#2C3E50' }}>首頁</Link></li>
            <li><Link href="/pages/reports" className="font-bold" style={{ color: '#2C3E50' }}>通報</Link></li>
           
          </ul>
        </div>
      </div>

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
              name="file"
              accept="image/*"
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
