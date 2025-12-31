const express = require("express");
const router = express.Router();
const {
  addReview,
  updateReview,
  deleteReview,
  getMyReviews,
  getProductReviews,
  getTopRatedProducts
} = require("../controllers/review.controller");

const { protect } = require("../middlewares/auth.middleware");

router.post("/products/:productId/reviews", protect, addReview);
router.put("/products/:productId/reviews/:reviewId", protect, updateReview);
router.delete("/products/:productId/reviews/:reviewId", protect, deleteReview);

router.get("/users/me/reviews", protect, getMyReviews);
router.get("/products/:productId/reviews", getProductReviews);

module.exports = router;
