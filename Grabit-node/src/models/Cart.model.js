const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
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
      min: 1,
      default: 1
    },
    coupon: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Coupon",
  default: null
},
discountAmount: {
  type: Number,
  default: 0
}

  },
  
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    items: [cartItemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
