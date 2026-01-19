const Product = require("../models/Product.model");
const mongoose = require("mongoose");

const Category = require("../models/Category.model");

exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      priceBeforeDiscount,
      colors = [],
      images = [],
      category,
      sizes = [],
      topSelling = false,
      topRated = false,
      trendingItems = false,
      newArrivals = false,
      dealOfTheDay = false
    } = req.body;

    // التحقق من وجود الفئة
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      res.status(400);
      throw new Error("الفئة غير موجودة");
    }

    // حساب إجمالي المخزون من المقاسات
    let stockQuantity = 0;
    if (Array.isArray(sizes) && sizes.length > 0) {
      stockQuantity = sizes.reduce(
        (total, item) => total + (item.stock || 0),
        0
      );
    }

    // إنشاء المنتج
    const product = await Product.create({
      name,
      description,
      price,
      priceBeforeDiscount,
      colors,
      images,
      category,
      sizes,
      stockQuantity,
      topSelling,
      topRated,        // يمكن تعديله لاحقًا بناءً على التقييمات
      trendingItems,
      newArrivals,
      dealOfTheDay
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};


// تعديل منتج (admin/owner)
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("المنتج غير موجود");
    }

    const {
      name,
      description,
      price,
      priceBeforeDiscount,
      colors,
      images,
      category,
      sizes,
       topSelling,
      topRated,
      trendingItems,
      newArrivals,
      dealOfTheDay
    } = req.body;

    // لو تم إرسال فئة جديدة
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        res.status(400);
        throw new Error("الفئة غير موجودة");
      }
      product.category = category;
    }

    // تحديث الحقول العادية
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.priceBeforeDiscount =
      priceBeforeDiscount ?? product.priceBeforeDiscount;
    product.colors = colors ?? product.colors;
    product.images = images ?? product.images;

    // تحديث المقاسات + إعادة حساب المخزون
    if (Array.isArray(sizes)) {
      product.sizes = sizes;
      product.stockQuantity = sizes.reduce(
        (total, item) => total + (item.stock || 0),
        0
      );
    }
    if (typeof topSelling === "boolean") product.topSelling = topSelling;
    if (typeof topRated === "boolean") product.topRated = topRated;
    if (typeof trendingItems === "boolean") product.trendingItems = trendingItems;
    if (typeof newArrivals === "boolean") product.newArrivals = newArrivals;
    if (typeof dealOfTheDay === "boolean") product.dealOfTheDay = dealOfTheDay;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

exports.getProductsByStatus = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, type } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    // Helper function لجلب المنتجات مع pagination
    const getProducts = async (filter = {}, sort = { createdAt: -1 }) => {
      const products = await Product.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("category", "name"); // هنا سيظل يجلب اسم التصنيف فقط

      const total = await Product.countDocuments(filter);

      return {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        products
      };
    };

    let result;

    switch (type) {
      case "topSelling":
        result = await getProducts({ topSelling: true }, { salesCount: -1 });
        break;
      case "topRated":
        result = await getProducts({ topRated: true }, { ratingsAverage: -1, ratingsQuantity: -1 });
        break;
      case "trendingItems":
        result = await getProducts({ trendingItems: true }, { ratingsQuantity: -1 });
        break;
      case "newArrivals":
        result = await getProducts({ newArrivals: true }, { createdAt: -1 });
        break;
      case "dealOfTheDay":
        result = await getProducts({ dealOfTheDay: true }, { createdAt: -1 });
        break;
      default:
        // إذا لم يمرر type، ارجع كل الحالات
        result = {
          topSelling: await getProducts({ topSelling: true }, { salesCount: -1 }),
          topRated: await getProducts({ topRated: true }, { ratingsAverage: -1, ratingsQuantity: -1 }),
          trendingItems: await getProducts({ trendingItems: true }, { ratingsQuantity: -1 }),
          newArrivals: await getProducts({ newArrivals: true }, { createdAt: -1 }),
          dealOfTheDay: await getProducts({ dealOfTheDay: true }, { createdAt: -1 })
        };
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};



// جلب كل المنتجات مع pagination وبحث بالاسم وترتيب حسب السعر

exports.getProducts = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      sortPrice,
      discount,
      category
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {
      name: { $regex: search, $options: "i" }
    };

    // فلترة حسب الخصم
    if (discount === "true") query.hasDiscount = true;
    if (discount === "false") query.hasDiscount = false;

    // فلترة حسب الفئة
    if (category) {
      // جلب الفئة
      const cat = await Category.findById(category);
      if (!cat) {
        res.status(400);
        throw new Error("الفئة غير موجودة");
      }

      // إذا كانت فئة رئيسية → اجلب منتجات كل الفئات الفرعية
      if (cat.parent === null) {
        const subCategories = await Category.find({ parent: cat._id }).select("_id");
        const categoryIds = subCategories.map(c => c._id);
        categoryIds.push(cat._id);

        query.category = { $in: categoryIds };
      } else {
        // فئة فرعية
        query.category = cat._id;
      }
    }

    // الترتيب
    let sortOption = { createdAt: -1 };
    if (sortPrice === "asc") sortOption = { price: 1 };
    if (sortPrice === "desc") sortOption = { price: -1 };

    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("category", "name parent")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort(sortOption);

    res.json({
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      products
    });
  } catch (error) {
    next(error);
  }
};



// جلب منتج واحد بالـ ID
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("المنتج غير موجود");
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// حذف منتج (admin/owner)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("المنتج غير موجود");
    }
    res.json({ message: "تم حذف المنتج بنجاح" });
  } catch (error) {
    next(error);
  }
};

exports.getTopRatedProducts = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      minRatings = 3
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    minRatings = parseInt(minRatings);

    const pipeline = [
      {
        $match: {
          ratingsQuantity: { $gte: minRatings }
        }
      },
      {
        $sort: {
          ratingsAverage: -1,
          ratingsQuantity: -1
        }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $unwind: "$category"
      },
      {
        $project: {
          name: 1,
          price: 1,
          priceBeforeDiscount: 1,
          hasDiscount: 1,
          images: 1,
          ratingsAverage: 1,
          ratingsQuantity: 1,
          category: {
            _id: 1,
            name: 1
          }
        }
      }
    ];

    const products = await Product.aggregate(pipeline);

    const total = await Product.countDocuments({
      ratingsQuantity: { $gte: minRatings }
    });

    res.json({
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Most Popular Products
 * GET /products/most-popular
 */
exports.getMostPopularProducts = async (req, res, next) => {
  try {
    let { limit = 10 } = req.query;
    limit = parseInt(limit);

    const products = await Product.find({ isMostPopular: true })
      .sort({ ratingsQuantity: -1 })
      .limit(limit)
      .select(
        "name price images ratingsAverage ratingsQuantity isMostPopular"
      )
      .populate("category", "name");

    res.json({
      total: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Products by Status
 * GET /products/status
 * Query params: limit, page
 */


// GET /api/products/by-category?categoryIds=id1,id2,id3&page=1&limit=12
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const categoryIdsQuery = req.query.categoryIds; // مثال: "id1,id2,id3"
    if (!categoryIdsQuery) {
      res.status(400);
      throw new Error("يرجى تمرير categoryIds");
    }

    const categoryIds = categoryIdsQuery.split(",");

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // التأكد من وجود الفئات
    const categories = await Category.find({ _id: { $in: categoryIds } });
    if (!categories.length) {
      res.status(404);
      throw new Error("الفئات غير موجودة");
    }

    let allCategoryIds = [];
    for (let cat of categories) {
      allCategoryIds.push(cat._id.toString());
      // إذا كانت فئة رئيسية، أضف الفرعية
      if (cat.parent === null) {
        const subs = await Category.find({ parent: cat._id }).select("_id");
        allCategoryIds.push(...subs.map(s => s._id.toString()));
      }
    }

    const totalProducts = await Product.countDocuments({
      category: { $in: allCategoryIds }
    });

    const products = await Product.find({
      category: { $in: allCategoryIds }
    })
      .populate("category", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      categories: categories.map(c => c.name),
      pagination: {
        total: totalProducts,
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit)
      },
      products
    });
  } catch (error) {
    next(error);
  }
};


