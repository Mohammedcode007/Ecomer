const express = require("express");
const router = express.Router();
const {
  createCoupon,
  deleteCoupon,
  applyCoupon,
  removeCoupon,
    getAllCoupons

} = require("../controllers/coupon.controller");

const { protect, adminOrOwner } = require("../middlewares/auth.middleware");

router.get("/", protect, getAllCoupons);
router.post("/", protect, createCoupon);
router.delete("/remove", protect, removeCoupon);

router.delete("/:id", protect, deleteCoupon);
router.post("/apply", protect, applyCoupon);


module.exports = router;
