const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
          size: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        price: {
          type: Number,
          required: true
        }
      }
    ],

    totalPrice: {
      type: Number,
      required: true
    },

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true
    },

    // 🔹 الدفع
    paymentMethod: {
      type: String,
      enum: ["cod"], // Cash On Delivery فقط
      default: "cod"
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending"
    },

    // 🔹 حالة الطلب
    status: {
      type: String,
      enum: ["pending", "processing", "completed","inway", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
