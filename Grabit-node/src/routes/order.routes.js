const express = require("express");
const router = express.Router();
const { protect,adminOrOwner } = require("../middlewares/auth.middleware");
const { createOrder, getMyOrders, getOrderById,updateOrderStatus,deleteOrder,confirmCashPayment } = require("../controllers/order.controller");

router.post("/", protect, createOrder);         // إنشاء طلب جديد
router.get("/", protect, getMyOrders);          // جلب كل الطلبات للمستخدم
router.get("/:id", protect, getOrderById);      // جلب طلب واحد بالتفاصيل
router.put("/:id/status", protect, adminOrOwner, updateOrderStatus);
router.delete("/:id", protect, deleteOrder);
router.put("/:id/confirm-payment", protect, adminOrOwner, confirmCashPayment);

module.exports = router;
