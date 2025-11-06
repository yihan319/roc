"use client";
import Navbar from "@/components/Navbar";
import React from "react";

export default function MapPage() {
  return (
     <>
        {/* <Navbar user={user} /> */}
        <Navbar />
    <div className="w-full h-screen ">
      <iframe
        id="AI"
        src="http://localhost:80"  // ✅ 地圖專案的網址
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="AI辨識功能"
      />
    </div>
    
    </>
  );
}
// // src/app/pages/AI/page.js
// 'use client';

// import { useState } from "react";

// export default function App() {
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(""); // 新增訊息狀態

//   const BACKEND_URL = "http://172.16.70.81:5000";

//   const handleFileChange = (e) => {
//     const f = e.target.files[0];
//     setFile(f);
//     if (f) setPreview(URL.createObjectURL(f));
//   };

//   const handleUpload = async () => {
//     if (!file) return alert("請先選擇圖片");

//     setLoading(true);
//     setMessage("辨識中...");
//     setResult(null);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch(`${BACKEND_URL}/upload`, {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         const err = await res.text();
//         throw new Error(`HTTP ${res.status}: ${err}`);
//       }

//       const data = await res.json();
//       console.log("後端回傳:", data); // 除錯用

//       if (data.status === "success") {
//         setResult({
//           uploaded_image: `${BACKEND_URL}${data.uploaded_image}?t=${Date.now()}`,
//           result_image: `${BACKEND_URL}${data.result_image}?t=${Date.now()}`, // 正確欄位
//           detections: data.detections || []
//         });
//         setMessage("辨識成功！");
//       } else {
//         setMessage(data.message || "辨識失敗");
//       }
//     } catch (err) {
//       console.error("連線錯誤:", err);
//       setMessage("連線錯誤，請確認後端是否啟動");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", padding: 30, fontFamily: "sans-serif", maxWidth: 900, margin: "0 auto" }}>
//       <h1 style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>AI 影像辨識展示頁面</h1>

//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleFileChange}
//         style={{ marginBottom: "1rem" }}
//       />

//       {preview && (
//         <div style={{ margin: "20px 0" }}>
//           <h3 style={{ color: "#555" }}>預覽圖片</h3>
//           <img
//             src={preview}
//             alt="preview"
//             style={{ maxWidth: 400, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
//           />
//         </div>
//       )}

//       <button
//         onClick={handleUpload}
//         disabled={loading}
//         style={{
//           padding: "14px 32px",
//           fontSize: "1.1rem",
//           background: loading ? "#aaa" : "#0070f3",
//           color: "white",
//           border: "none",
//           borderRadius: 8,
//           cursor: loading ? "not-allowed" : "pointer",
//           transition: "0.2s"
//         }}
//       >
//         {loading ? "辨識中..." : "開始辨識"}
//       </button>

//       {message && (
//         <p style={{
//           marginTop: 15,
//           fontSize: "1.1rem",
//           color: message.includes("成功") ? "green" : "red",
//           fontWeight: "bold"
//         }}>
//           {message}
//         </p>
//       )}

//       {result && (
//         <div style={{
//           marginTop: 30,
//           padding: 25,
//           background: "#f8f9fa",
//           borderRadius: 12,
//           display: "inline-block",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
//         }}>
//           <h2 style={{ color: "#0070f3", marginBottom: 15 }}>辨識結果</h2>

//           {/* 偵測結果 */}
//           {result.detections.length > 0 ? (
//             <div style={{ marginBottom: 20, textAlign: "left", display: "inline-block" }}>
//               {result.detections.map((d, i) => (
//                 <div key={i} style={{ marginBottom: 8 }}>
//                   <strong>類別 {i + 1}：</strong> {d.class}<br />
//                   <strong>信心度：</strong> {(d.confidence * 100).toFixed(1)}%
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p style={{ color: "#888", fontStyle: "italic" }}>無偵測到物件</p>
//           )}

//           {/* 結果圖 */}
//           <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
//             <div>
//               <h3 style={{ color: "#0070f3" }}>原圖</h3>
//               <img
//                 src={result.uploaded_image}
//                 alt="原圖"
//                 style={{ maxWidth: 350, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
//               />
//             </div>
//             <div>
//               <h3 style={{ color: "#0070f3" }}>YOLO 標記結果</h3>
//               <img
//                 src={result.result_image}
//                 alt="結果"
//                 style={{ maxWidth: 350, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }