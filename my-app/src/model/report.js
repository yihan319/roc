import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    detail: { type: String, required: true },
    photoUrl: { type: String },
    completionPhotoUrl: { type: String }, // 新增完成照片 URL
    createdBy: { type: String, required: true }, // 用於成員建立的案件 (建立時設定為使用者的 email)
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "in_progress", "completed", "awaiting_review"],
      default: "pending",
    },
    volunteers: [{ type: String }], // 指派的志工 email
  },
  { collection: "reports", timestamps: true }
);

export default mongoose.models.Case || mongoose.model("Case", ReportSchema);