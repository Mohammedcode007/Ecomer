const Category = require("../models/Category.model");

// إنشاء فئة جديدة (Admin/Owner فقط)
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, parent, icon } = req.body;

    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        res.status(400);
        throw new Error("الفئة الرئيسية غير موجودة");
      }
    }

    const category = await Category.create({
      name,
      description,
      parent: parent || null,
      icon: icon || "fi fi-rr-apps" // افتراضي
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// تعديل فئة (Admin/Owner فقط)
exports.updateCategory = async (req, res, next) => {
  try {
    const { name, description, parent, icon } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error("الفئة غير موجودة");
    }

    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        res.status(400);
        throw new Error("الفئة الرئيسية غير موجودة");
      }
    }

    category.name = name ?? category.name;
    category.description = description ?? category.description;
    category.parent = parent ?? category.parent;
    category.icon = icon ?? category.icon; // تحديث الأيقونة

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
};



// حذف فئة (Admin/Owner فقط)
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error("الفئة غير موجودة");
    }

    // حذف الفئات الفرعية أولًا
    await Category.deleteMany({ parent: category._id });

    // حذف الفئة الرئيسية
    await category.deleteOne();

    res.json({ message: "تم حذف الفئة وجميع الفئات الفرعية المرتبطة بها" });
  } catch (error) {
    next(error);
  }
};

// جلب كل الفئات (متاحة للجميع)
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.aggregate([
      // 1️⃣ الفئات الرئيسية فقط
      {
        $match: { parent: null }
      },

      // 2️⃣ جلب الفئات الفرعية
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "parent",
          as: "subCategories"
        }
      },

      // 3️⃣ حساب عدد المنتجات لكل فئة فرعية
      {
        $lookup: {
          from: "products",
          localField: "subCategories._id",
          foreignField: "category",
          as: "subProducts"
        }
      },

      // 4️⃣ دمج عدد المنتجات داخل كل فئة فرعية
      {
        $addFields: {
          subCategories: {
            $map: {
              input: "$subCategories",
              as: "sub",
              in: {
                _id: "$$sub._id",
                name: "$$sub.name",
                description: "$$sub.description",
                productsCount: {
                  $size: {
                    $filter: {
                      input: "$subProducts",
                      as: "p",
                      cond: { $eq: ["$$p.category", "$$sub._id"] }
                    }
                  }
                }
              }
            }
          }
        }
      },

      // 5️⃣ حساب عدد منتجات الفئة الرئيسية (يشمل الفرعية)
      {
        $lookup: {
          from: "products",
          let: {
            mainId: "$_id",
            subIds: "$subCategories._id"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$category", "$$mainId"] },
                    { $in: ["$category", "$$subIds"] }
                  ]
                }
              }
            }
          ],
          as: "allProducts"
        }
      },

      // 6️⃣ إضافة productsCount للفئة الرئيسية
      {
        $addFields: {
          productsCount: { $size: "$allProducts" }
        }
      },

      // 7️⃣ تنظيف الحقول المؤقتة
      {
        $project: {
          subProducts: 0,
          allProducts: 0
        }
      },

      // 8️⃣ ترتيب
      {
        $sort: { name: 1 }
      }
    ]);

    res.json(categories);
  } catch (error) {
    next(error);
  }
};



// جلب فئة واحدة بالـ ID
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error("الفئة غير موجودة");
    }

    const subCategories = await Category.find({ parent: category._id });

    res.json({
      category,
      subCategories
    });
  } catch (error) {
    next(error);
  }
};
