const express = require("express");
const router = express.Router();

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategoryById
} = require("../controllers/category.controller");

const { protect, adminOrOwner } = require("../middlewares/auth.middleware");

// متاحة للجميع
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Admin / Owner فقط
router.post("/", protect, adminOrOwner, createCategory);
router.put("/:id", protect, adminOrOwner, updateCategory);
router.delete("/:id", protect, adminOrOwner, deleteCategory);

module.exports = router;
