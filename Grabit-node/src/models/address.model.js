const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["home", "work", "other"], default: "home" }, // نوع العنوان
    country: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    postalCode: { type: String, required: true },
    details: { type: String }, // تفاصيل إضافية
    phone: { type: String, required: true }, // رقم للتواصل
    deliveryStart: { type: String }, // وقت استلام من
    deliveryEnd: { type: String }, // وقت استلام إلى
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
