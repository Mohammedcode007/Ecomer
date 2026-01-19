const express = require("express");
const router = express.Router();
const {
  createProduct,
  updateProduct,
  getProducts,
  getProductById,
  deleteProduct,
  getTopRatedProducts,
  getMostPopularProducts,
  getProductsByCategory,
  getProductsByStatus
} = require("../controllers/product.controller");
const { protect, adminOrOwner } = require("../middlewares/auth.middleware");

// ← Routes الثابتة أولًا
router.get("/top-rated", getTopRatedProducts);
router.get("/most-popular", getMostPopularProducts);
router.get("/status", getProductsByStatus);
router.get("/by-category", getProductsByCategory); // ← الآن سيأخذ categoryIds من query

// جلب كل المنتجات مع pagination + بحث بالاسم
router.get("/", getProducts);

// جلب منتج واحد
router.get("/:id", getProductById);

// إنشاء منتج جديد (فقط admin/owner)
router.post("/", protect, adminOrOwner, createProduct);

// تعديل منتج (فقط admin/owner)
router.put("/:id", protect, adminOrOwner, updateProduct);

// حذف منتج (فقط admin/owner)
router.delete("/:id", protect, adminOrOwner, deleteProduct);

module.exports = router;
