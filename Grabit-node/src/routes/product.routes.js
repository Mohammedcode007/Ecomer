const express = require("express");
const router = express.Router();
const {
  createProduct,
  updateProduct,
  getProducts,
  getProductById,
  deleteProduct,
  getTopRatedProducts,
  getMostPopularProducts
} = require("../controllers/product.controller");
const { protect, adminOrOwner } = require("../middlewares/auth.middleware");
router.get("/top-rated", getTopRatedProducts);
router.get("/most-popular", getMostPopularProducts);

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
