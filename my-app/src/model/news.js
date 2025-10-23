import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema({
  title: String,
  summary: String,
  date: { type: Date, default: Date.now }, // 確保 date 欄位類型為 Date
}, { collection: "news", timestamps: true });
export default mongoose.models.News || mongoose.model("News", NewsSchema);
