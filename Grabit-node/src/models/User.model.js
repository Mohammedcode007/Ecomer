const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "اسم المستخدم مطلوب"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "البريد الإلكتروني مطلوب"],
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: [true, "كلمة المرور مطلوبة"],
      minlength: [6, "يجب أن تكون كلمة المرور 6 أحرف على الأقل"]
    },
    role: {
      type: String,
      enum: ["user", "admin", "owner"], // أنواع الصلاحيات
      default: "user"
    },
   phone: {
  type: String,
  unique: true,
  sparse: true,
  trim: true
},
    resetCode: { type: String },       // الكود المؤقت
    resetCodeExpiry: { type: Date }    // وقت انتهاء صلاحية الكود

  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
