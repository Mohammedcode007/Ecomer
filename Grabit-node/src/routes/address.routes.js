const express = require("express");
const router = express.Router();
const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  getUserAddresses,
  getMyAddresses
} = require("../controllers/address.controller");

const { protect } = require("../middlewares/auth.middleware"); // افترض أنك تستخدم middleware للتحقق من التوكن

router.post("/", protect, addAddress); // إضافة عنوان
router.put("/:id", protect, updateAddress); // تحديث عنوان
router.delete("/:id", protect, deleteAddress); // حذف عنوان
router.get("/user/:userId", protect, getUserAddresses);
router.get("/", protect, getMyAddresses);    // جلب كل العناوين للمستخدم الحالي

module.exports = router;
