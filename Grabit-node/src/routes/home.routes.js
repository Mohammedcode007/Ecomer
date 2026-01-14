const express = require("express");
const router = express.Router();

const {
  createOrUpdateHomepage,
  getHomepage,
  updateHomepageSection,
  deleteHomepageSectionItem
} = require("../controllers/homepage.controller");

const { protect } = require("../middlewares/auth.middleware");

// إنشاء أو تحديث كامل الصفحة
router.post("/", protect, createOrUpdateHomepage);

// جلب بيانات الصفحة الرئيسية
router.get("/", getHomepage);

// تحديث عنصر معين داخل قسم
router.patch("/:section/:index", protect, updateHomepageSection);

// تحديث قسم كامل (بدون index)
router.patch("/:section", protect, updateHomepageSection);

// حذف عنصر من قسم معين
router.delete("/:section/:index", protect, deleteHomepageSectionItem);

module.exports = router;
