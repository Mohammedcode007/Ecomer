const Cart = require("../models/Cart.model");
const Product = require("../models/Product.model");

// جلب عربة المستخدم
exports.getCart = async (req, res, next) => {
  try {
    // 1️⃣ قراءة query params
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    // 2️⃣ جلب العربة مع populate لكل تفاصيل المنتج
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product"); // جلب كل تفاصيل المنتج

    const items = cart ? cart.items : [];

    // 3️⃣ حساب pagination
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedItems = items.slice(startIndex, endIndex);

    // 4️⃣ إرسال الاستجابة
    res.json({
      page,
      limit,
      totalPages,
      totalItems,
      items: paginatedItems
    });
  } catch (error) {
    next(error);
  }
};


// إضافة منتج للعربة
// exports.addToCart = async (req, res, next) => {
//   try {
//     const { productId, quantity = 1 } = req.body;

//     const product = await Product.findById(productId);
//     if (!product) {
//       res.status(404);
//       throw new Error("المنتج غير موجود");
//     }

//     let cart = await Cart.findOne({ user: req.user._id });

//     if (!cart) {
//       cart = await Cart.create({
//         user: req.user._id,
//         items: [{ product: productId, quantity }]
//       });
//     } else {
//       const itemIndex = cart.items.findIndex(
//         item => item.product.toString() === productId
//       );

//       if (itemIndex > -1) {
//         cart.items[itemIndex].quantity += quantity;
//       } else {
//         cart.items.push({ product: productId, quantity });
//       }

//       await cart.save();
//     }

//     res.status(200).json(cart);
//   } catch (error) {
//     next(error);
//   }
// };

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size } = req.body;

    if (!size) {
      res.status(400);
      throw new Error("يجب اختيار المقاس");
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("المنتج غير موجود");
    }

    // التحقق من وجود المقاس
    const sizeObj = product.sizes.find(s => s.size === size);
    if (!sizeObj) {
      res.status(400);
      throw new Error("المقاس غير متوفر");
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, size, quantity }]
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item =>
          item.product.toString() === productId &&
          item.size === size
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, size, quantity });
      }

      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

// تعديل كمية منتج
exports.updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      res.status(400);
      throw new Error("الكمية يجب أن تكون 1 على الأقل");
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      res.status(404);
      throw new Error("العربة غير موجودة");
    }

    const item = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!item) {
      res.status(404);
      throw new Error("المنتج غير موجود في العربة");
    }

    item.quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// حذف منتج من العربة
exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { items: { product: productId } } },
      { new: true }
    );

    res.json(cart);
  } catch (error) {
    next(error);
  }
};
