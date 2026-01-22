const Order = require("../models/order.model");
const Cart = require("../models/Cart.model");
const Product = require("../models/Product.model");



exports.createOrder = async (req, res, next) => {
  try {
    const { addressId } = req.body;

    if (!addressId) {
      res.status(400);
      throw new Error("يجب اختيار عنوان التوصيل");
    }

    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      res.status(400);
      throw new Error("العربة فارغة");
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;

      const sizeObj = product.sizes.find(
        s => s.size === item.size
      );

      if (!sizeObj) {
        res.status(400);
        throw new Error(`المقاس ${item.size} غير متوفر`);
      }

      if (sizeObj.stock < item.quantity) {
        res.status(400);
        throw new Error(
          `الكمية غير متوفرة للمقاس ${item.size}`
        );
      }

      // إجمالي السعر بعد خصم الكوبون لكل منتج
      const discountedPrice = item.discountAmount
        ? product.price * item.quantity - item.discountAmount
        : product.price * item.quantity;

      totalPrice += discountedPrice;

      orderItems.push({
        product: product._id,
        size: item.size,
        quantity: item.quantity,
        price: product.price,
        discountAmount: item.discountAmount || 0, // نسخ الخصم
        coupon: item.coupon || null
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice, // السعر بعد الخصم
      address: addressId
    });

    // خصم المخزون
    for (const item of cart.items) {
      await Product.updateOne(
        {
          _id: item.product._id,
          "sizes.size": item.size
        },
        {
          $inc: {
            "sizes.$.stock": -item.quantity,
            stockQuantity: -item.quantity,
            salesCount: item.quantity
          }
        }
      );
    }

    // مسح العربة بعد إنشاء الطلب
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      message: "تم إنشاء الطلب بنجاح",
      order
    });
  } catch (error) {
    next(error);
  }
};



// جلب كل الطلبات للمستخدم الحالي
exports.getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .populate("items.product", "name price images")
      .populate("address");

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// جلب طلب واحد بالتفاصيل
exports.getOrderById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, user: userId })
      .populate("items.product", "name price images")
      .populate("address");

    if (!order) {
      res.status(404);
      throw new Error("الطلب غير موجود");
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// تحديث حالة الطلب
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;      // معرف الطلب
    const { status } = req.body;    // الحالة الجديدة

    const allowedStatus = ["pending", "processing","inway", "completed", "cancelled"];
    if (!allowedStatus.includes(status)) {
      res.status(400);
      throw new Error("الحالة غير صالحة");
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404);
      throw new Error("الطلب غير موجود");
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    next(error);
  }
};


// حذف طلب
// حذف طلب
exports.deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params; // معرف الطلب

    const order = await Order.findById(id);
    if (!order) {
      res.status(404);
      throw new Error("الطلب غير موجود");
    }

    // التحقق أن المستخدم هو صاحب الطلب أو admin
    if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
      res.status(403);
      throw new Error("غير مصرح لك بحذف هذا الطلب");
    }

    // حذف الطلب
    await order.deleteOne();  // ✅ التغيير هنا

    res.json({ message: "تم حذف الطلب بنجاح" });
  } catch (error) {
    next(error);
  }
};



exports.confirmCashPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) {
      res.status(404);
      throw new Error("الطلب غير موجود");
    }

    if (order.status === "completed") {
      res.status(400);
      throw new Error("الطلب مكتمل بالفعل");
    }

    // تحديث حالة الطلب
    order.status = "completed";
    order.paymentStatus = "paid";
    await order.save();

    // 🔥 زيادة عدد المبيعات لكل منتج
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: {
          salesCount: item.quantity
        }
      });
    }

    res.json({
      message: "تم إكمال الطلب وتحديث عدد المبيعات",
      order
    });
  } catch (error) {
    next(error);
  }
};


