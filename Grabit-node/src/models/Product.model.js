
const mongoose = require("mongoose");
const reviewSchema = require("./Review.model");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    priceBeforeDiscount: { type: Number, default: 0, min: 0 },
    colors: { type: [String], default: [] },
    stockQuantity: { type: Number, required: true, default: 0, min: 0 },
    images: { type: [String], default: [] },

    hasDiscount: { type: Boolean, default: false },
    sizes: [
      {
        size: { type: String, required: true },
        stock: { type: Number, required: true, min: 0 }
      }
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    ratingsAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    salesCount: {
      type: Number,
      default: 0,
      min: 0
    },

    // ⭐ Most Popular
    isMostPopular: {
      type: Boolean,
      default: false
    },
   topSelling: { type: Boolean, default: false },
    topRated: { type: Boolean, default: false },
    trendingItems: { type: Boolean, default: false },
    newArrivals: { type: Boolean, default: false },
    dealOfTheDay: { type: Boolean, default: false },
    reviews: [reviewSchema]
  },
  { timestamps: true }
);

// حساب الخصم
productSchema.pre("save", function () {
  this.hasDiscount = this.priceBeforeDiscount > this.price;

  // 🔥 يعتبر المنتج Most Popular لو عدد التقييمات ≥ 10
  this.isMostPopular = this.ratingsQuantity >= 1;
});

module.exports = mongoose.model("Product", productSchema);
