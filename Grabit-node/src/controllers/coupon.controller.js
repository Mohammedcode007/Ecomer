const Coupon = require("../models/coupon.model");
const Cart = require("../models/Cart.model");

/* ===================== إنشاء كوبون ===================== */
exports.createCoupon = async (req, res, next) => {
  try {
    const { code, discountPercentage, expiresAt } = req.body;

    const coupon = await Coupon.create({
      code,
      discountPercentage,
      expiresAt
    });

    res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};

/* ===================== حذف كوبون ===================== */
exports.deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Coupon.findByIdAndDelete(id);

    res.json({ message: "تم حذف الكوبون بنجاح" });
  } catch (error) {
    next(error);
  }
};

exports.applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    // 1️⃣ التحقق من الكوبون
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      res.status(404);
      throw new Error("الكوبون غير صالح");
    }

    if (coupon.expiresAt < new Date()) {
      res.status(400);
      throw new Error("انتهت صلاحية الكوبون");
    }

    // 2️⃣ جلب العربة
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      res.status(400);
      throw new Error("العربة فارغة");
    }

    // 3️⃣ تحقق إذا تم تطبيق كوبون مسبقاً
    if (cart.items.some(item => item.coupon)) {
      res.status(400);
      throw new Error("تم بالفعل تطبيق كوبون على هذه العربة، لا يمكن تطبيق أكثر من كوبون");
    }

    // 4️⃣ حساب إجمالي السعر قبل الخصم
    const totalPrice = cart.items.reduce((acc, item) => {
      return acc + item.product.price * item.quantity;
    }, 0);

    // 5️⃣ حساب إجمالي الخصم
    const totalDiscount = (totalPrice * coupon.discountPercentage) / 100;

    // 6️⃣ توزيع الخصم على العناصر بالتناسب
    cart.items.forEach(item => {
      const itemTotal = item.product.price * item.quantity;
      const itemDiscount = (itemTotal / totalPrice) * totalDiscount;

      item.coupon = coupon._id;
      item.discountAmount = Number(itemDiscount.toFixed(2));
      item.originalPrice = itemTotal; // إذا أردت الاحتفاظ بالقيمة الأصلية
    });

    // 7️⃣ تحديث إجمالي السعر بعد الخصم
    cart.totalPrice = cart.items.reduce((acc, item) => {
      const itemTotal = item.product.price * item.quantity;
      const discount = item.discountAmount || 0;
      return acc + itemTotal - discount;
    }, 0);

    await cart.save();

    res.json({
      message: "تم تطبيق الكوبون بنجاح",
      coupon,
      totalDiscount,
      totalPriceAfterDiscount: cart.totalPrice
    });
  } catch (error) {
    next(error);
  }
};


/* ===================== تطبيق كوبون على العربة ===================== */
// exports.applyCoupon = async (req, res, next) => {
//   try {
//     const { code } = req.body;

//     const coupon = await Coupon.findOne({
//       code: code.toUpperCase(),
//       isActive: true
//     });

//     if (!coupon) {
//       res.status(404);
//       throw new Error("الكوبون غير صالح");
//     }

//     if (coupon.expiresAt < new Date()) {
//       res.status(400);
//       throw new Error("انتهت صلاحية الكوبون");
//     }

//     const cart = await Cart.findOne({ user: req.user._id }).populate(
//       "items.product"
//     );

//     if (!cart || cart.items.length === 0) {
//       res.status(400);
//       throw new Error("العربة فارغة");
//     }

//     // إجمالي السعر
//     const totalPrice = cart.items.reduce((acc, item) => {
//       return acc + item.product.price * item.quantity;
//     }, 0);

//     // إجمالي الخصم
//     const totalDiscount =
//       (totalPrice * coupon.discountPercentage) / 100;

//     // توزيع الخصم على العناصر بالتناسب
//     cart.items.forEach(item => {
//       const itemTotal = item.product.price * item.quantity;
//       const itemDiscount =
//         (itemTotal / totalPrice) * totalDiscount;

//       item.coupon = coupon._id;
//       item.discountAmount = Number(itemDiscount.toFixed(2));
//     });

//     await cart.save();

//     res.json({
//       message: "تم تطبيق الكوبون بنجاح",
//       coupon,
//       totalDiscount
//     });
//   } catch (error) {
//     next(error);
//   }
// };

/* ===================== إزالة الكوبون من العربة ===================== */
exports.removeCoupon = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error("العربة غير موجودة");
    }

    cart.coupon = null;
    cart.discountAmount = 0;

    await cart.save();

    res.json({ message: "تم إزالة الكوبون بنجاح", cart });
  } catch (error) {
    next(error);
  }
};

/* ===================== جلب جميع الكوبونات ===================== */
exports.getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.json({
      total: coupons.length,
      coupons
    });
  } catch (error) {
    next(error);
  }
};
