const router = require("express").Router();
const { protect } = require("../middlewares/auth.middleware");
const {
  getWishlist,
  toggleWishlist
} = require("../controllers/wishlist.controller");

router.use(protect);

router.get("/", getWishlist);
router.put("/toggle", toggleWishlist);

module.exports = router;
