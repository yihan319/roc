import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "disaster_app", // 這裡改成你的資料庫名稱
    });
    isConnected = true;
    console.log("✅ MongoDB 已連線");
  } catch (error) {
    console.error("❌ MongoDB 連線失敗", error);
  }
}
