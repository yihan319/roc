// model/User.js
import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["member", "volunteer", "admin"],
      default: "member",
    },
    volunteerStatus: {
      type: String,
      enum: ["not_applied", "pending", "approved", "rejected"],
      default: "not_applied",
    },
  },
  {
    timestamps: true,
    collection: "member_data", // 明確指定集合名稱
  }
);

const VolunteerSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // 獨立 _id
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "MemberData", required: true, unique: true }, // 關聯 member_data 的 _id
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    licenses: [
      {
        url: { type: String, required: true },
        category: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: "Volunteer", // 修正為 Volunteer 集合
  }
);

export const MemberData = mongoose.models.MemberData || mongoose.model("MemberData", MemberSchema);
export const VolunteerData = mongoose.models.VolunteerData || mongoose.model("VolunteerData", VolunteerSchema);