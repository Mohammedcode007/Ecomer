const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const Wishlist = require("../models/Wishlist.model");
const Cart = require("../models/Cart.model");
const generateToken = require("../utils/generateToken");



const { sendWhatsAppMessage } = require("../utils/whatsapp"); // دالة لإرسال رسائل WhatsApp
// تسجيل مستخدم جديد
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // التحقق من وجود البريد الإلكتروني مسبقًا
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("البريد الإلكتروني مستخدم بالفعل");
    }

    // التحقق من وجود رقم الهاتف مسبقًا (اختياري)
    if (phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        res.status(400);
        throw new Error("رقم الهاتف مستخدم بالفعل");
      }
    }

    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // إنشاء المستخدم
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "user" // إذا لم يُرسل role، افتراضيًا "user"
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
};


// تسجيل الدخول
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ التحقق من المستخدم
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error("بيانات الدخول غير صحيحة");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error("بيانات الدخول غير صحيحة");
    }

    // 2️⃣ جلب المفضلة والعربة
    const wishlist = await Wishlist.findOne({ user: user._id })
      .populate("products", "name price images"); // جلب المنتجات مع الحقول المهمة

    const cart = await Cart.findOne({ user: user._id })
      .populate("items.product", "name price images"); // جلب المنتجات داخل العربة

    // 3️⃣ إرسال الاستجابة
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      wishlist: wishlist ? wishlist.products : [],
      cart: cart ? cart.items : []
    });
  } catch (error) {
    next(error);
  }
};





// 1️⃣ طلب إعادة تعيين كلمة المرور (أدخل البريد)
exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("المستخدم غير موجود");
    }

    if (!user.phone) {
      res.status(400);
      throw new Error("رقم الهاتف غير موجود لإرسال WhatsApp");
    }

    // إنشاء كود من 6 أرقام
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetCode = resetCode;
    user.resetCodeExpiry = expiry;
    await user.save();

    // إرسال الكود عبر WhatsApp باستخدام Vonage
    await sendWhatsAppMessage(user.phone, `كود إعادة تعيين كلمة المرور: ${resetCode}`);

    res.json({ message: "تم إرسال كود التحقق إلى WhatsApp الخاص بك" });
  } catch (error) {
    next(error);
  }
};



exports.resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("المستخدم غير موجود");
    }

    if (!user.resetCode || user.resetCode !== code) {
      res.status(400);
      throw new Error("كود التحقق غير صحيح");
    }

    if (user.resetCodeExpiry < new Date()) {
      res.status(400);
      throw new Error("انتهت صلاحية الكود، أعد طلبه");
    }

    // تحديث كلمة المرور
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // مسح الكود بعد الاستخدام
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;

    await user.save();

    res.json({ message: "تم تحديث كلمة المرور بنجاح" });
  } catch (error) {
    next(error);
  }
};

// تعديل بيانات المستخدم اعتماداً على التوكن
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, phone, role } = req.body;

    const user = req.user; // هنا نستخدم req.user بعد middleware
    if (!user) {
      res.status(404);
      throw new Error("المستخدم غير موجود");
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) throw new Error("البريد الإلكتروني مستخدم بالفعل");
      user.email = email;
    }

    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) throw new Error("رقم الهاتف مستخدم بالفعل");
      user.phone = phone;
    }

    if (name) user.name = name;
    if (role) user.role = role;

    await user.save();

    res.json({
      message: "تم تعديل بيانات المستخدم بنجاح",
      user
    });
  } catch (error) {
    next(error);
  }
};

// حذف المستخدم اعتماداً على التوكن
exports.deleteUser = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404);
      throw new Error("المستخدم غير موجود");
    }

    await Wishlist.findOneAndDelete({ user: user._id });
    await Cart.findOneAndDelete({ user: user._id });
    await user.remove();

    res.json({ message: "تم حذف المستخدم بنجاح" });
  } catch (error) {
    next(error);
  }
};

// جلب كل المستخدمين مع Pagination
exports.getUsers = async (req, res, next) => {
  try {
    // عدد المستخدمين لكل صفحة (default 10)
    const pageSize = parseInt(req.query.limit) || 10;
    // الصفحة الحالية (default 1)
    const page = parseInt(req.query.page) || 1;

    const totalUsers = await User.countDocuments(); // عدد جميع المستخدمين

    const users = await User.find()
      .select("-password") // لا نرسل كلمة المرور
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .sort({ createdAt: -1 }); // ترتيب حسب الأحدث

    res.json({
      users,
      page,
      pages: Math.ceil(totalUsers / pageSize),
      total: totalUsers
    });
  } catch (error) {
    next(error);
  }
};
