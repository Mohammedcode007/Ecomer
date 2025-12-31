const Wishlist = require("../models/Wishlist.model");
const Product = require("../models/Product.model");

// جلب المفضلة
exports.getWishlist = async (req, res, next) => {
  try {
    // 1️⃣ قراءة query params
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    // 2️⃣ جلب wishlist مع population لكل تفاصيل المنتج
    const wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate("products"); // جلب كل الحقول

    const products = wishlist ? wishlist.products : [];

    // 3️⃣ حساب pagination
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedProducts = products.slice(startIndex, endIndex);

    // 4️⃣ إرسال الاستجابة
    res.json({
      page,
      limit,
      totalPages,
      totalProducts,
      products: paginatedProducts
    });
  } catch (error) {
    next(error);
  }
};



// إضافة / إزالة من المفضلة (Toggle)
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("المنتج غير موجود");
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [productId]
      });
    } else {
      const exists = wishlist.products.includes(productId);

      if (exists) {
        wishlist.products.pull(productId);
      } else {
        wishlist.products.push(productId);
      }

      await wishlist.save();
    }

    res.json(wishlist);
  } catch (error) {
    next(error);
  }
};
