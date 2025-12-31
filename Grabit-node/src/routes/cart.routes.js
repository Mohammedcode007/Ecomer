const router = require("express").Router();
const { protect } = require("../middlewares/auth.middleware");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
} = require("../controllers/cart.controller");

router.use(protect);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove/:productId", removeFromCart);

module.exports = router;
