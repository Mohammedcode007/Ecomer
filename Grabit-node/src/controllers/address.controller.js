const Address = require("../models/address.model");

// إضافة عنوان جديد
exports.addAddress = async (req, res, next) => {
  try {
    const userId = req.user.id; // افترض أن لديك middleware للتحقق من التوكن وإضافة user
    const addressesCount = await Address.countDocuments({ user: userId });

    if (addressesCount >= 5) {
      res.status(400);
      throw new Error("يمكنك إضافة 5 عناوين فقط");
    }

    const address = await Address.create({ ...req.body, user: userId });
    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
};

// جلب جميع العناوين الخاصة بالمستخدم
exports.getAddresses = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.find({ user: userId });
    res.json(addresses);
  } catch (error) {
    next(error);
  }
};

// تحديث عنوان
exports.updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const address = await Address.findOne({ _id: id, user: userId });
    if (!address) {
      res.status(404);
      throw new Error("العنوان غير موجود");
    }

    Object.assign(address, req.body);
    await address.save();
    res.json(address);
  } catch (error) {
    next(error);
  }
};

// حذف عنوان
exports.deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const address = await Address.findOneAndDelete({ _id: id, user: userId });
    if (!address) {
      res.status(404);
      throw new Error("العنوان غير موجود");
    }

    res.json({ message: "تم حذف العنوان بنجاح" });
  } catch (error) {
    next(error);
  }
};

// جلب كل العناوين لمستخدم واحد
exports.getUserAddresses = async (req, res, next) => {
  try {
    const { userId } = req.params; // معرف المستخدم
    const addresses = await Address.find({ user: userId });

    if (!addresses || addresses.length === 0) {
      return res.status(404).json({ message: "لا توجد عناوين لهذا المستخدم" });
    }

    res.json(addresses);
  } catch (error) {
    next(error);
  }
};

// جلب كل العناوين للمستخدم الحالي
exports.getMyAddresses = async (req, res, next) => {
  try {
    const userId = req.user.id; // معرف المستخدم المسجل دخوله
    const addresses = await Address.find({ user: userId });

    res.json(addresses); // مصفوفة العناوين
  } catch (error) {
    next(error);
  }
};
