"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/memberNavbar";

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function checkLogin() {
      const res = await fetch("/api/auth/verify", { credentials: "include" });
      const data = await res.json();
      if (!data.isLogin) {
        router.push("/pages/signin");
      } else {
        setUserData(data);
      }
    }
    checkLogin();
  }, []);

  return (
    <>
      <Navbar />
      <div className="pt-20 text-center">
        <h1 className="text-3xl font-bold">
          歡迎回來，{userData?.user?.name || "使用者"}！
        </h1>
        <p className="text-gray-600 mt-2">角色：{userData?.role}</p>
      </div>
    </>
  );
}