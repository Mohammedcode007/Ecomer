const Homepage = require("../models/Homepage.model");

// إضافة أو إنشاء بيانات الصفحة الرئيسية (إذا كانت غير موجودة)
exports.createOrUpdateHomepage = async (req, res, next) => {
  try {
    let homepage = await Homepage.findOne(); // نفترض وجود صفحة رئيسية واحدة فقط

    if (homepage) {
      // إذا موجودة، قم بالتحديث
      Object.assign(homepage, req.body);
      await homepage.save();
      return res.json(homepage);
    }

    // إذا غير موجودة، إنشاء جديدة
    homepage = await Homepage.create(req.body);
    res.status(201).json(homepage);
  } catch (error) {
    next(error);
  }
};

// جلب بيانات الصفحة الرئيسية
exports.getHomepage = async (req, res, next) => {
  try {
    const homepage = await Homepage.findOne();
    if (!homepage) {
      return res.status(404).json({ message: "بيانات الصفحة الرئيسية غير موجودة" });
    }
    res.json(homepage);
  } catch (error) {
    next(error);
  }
};

// تحديث بيانات معينة في الصفحة الرئيسية
exports.updateHomepageSection = async (req, res, next) => {
  try {
    const { section, index } = req.params; // section = heroSection, sections, promoSections, features, textImageSections
    const homepage = await Homepage.findOne();
    if (!homepage) {
      return res.status(404).json({ message: "بيانات الصفحة الرئيسية غير موجودة" });
    }

    // تحديث عنصر معين داخل المصفوفة
    if (index !== undefined && homepage[section] && homepage[section][index]) {
      Object.assign(homepage[section][index], req.body);
      await homepage.save();
      return res.json(homepage[section][index]);
    }

    // تحديث كامل القسم إذا لم يحدد index
    if (homepage[section]) {
      homepage[section] = req.body;
      await homepage.save();
      return res.json(homepage[section]);
    }

    res.status(400).json({ message: "القسم غير موجود" });
  } catch (error) {
    next(error);
  }
};

// حذف عنصر من قسم معين
exports.deleteHomepageSectionItem = async (req, res, next) => {
  try {
    const { section, index } = req.params; // section = heroSection, sections, promoSections, features, textImageSections
    const homepage = await Homepage.findOne();
    if (!homepage || !homepage[section] || !homepage[section][index]) {
      return res.status(404).json({ message: "العنصر غير موجود" });
    }

    homepage[section].splice(index, 1);
    await homepage.save();
    res.json({ message: "تم حذف العنصر بنجاح" });
  } catch (error) {
    next(error);
  }
};
