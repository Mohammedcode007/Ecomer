const Product = require("../models/Product.model");
const mongoose = require("mongoose");

/**
 * إضافة مراجعة على منتج
 * POST /products/:productId/reviews
 */
exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400);
      throw new Error("معرف المنتج غير صالح");
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("المنتج غير موجود");
    }

    // منع التقييم المكرر
    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("قمت بتقييم هذا المنتج من قبل");
    }

    product.reviews.push({
      user: req.user._id,
      rating: Number(rating),
      comment
    });

    // إعادة حساب التقييمات
    product.ratingsQuantity = product.reviews.length;
    product.ratingsAverage =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.ratingsQuantity;

    // تحديث Most Popular
    product.isMostPopular = product.ratingsQuantity >= 1;

    await product.save();

    res.status(201).json({
      message: "تم إضافة التقييم بنجاح",
      ratingsAverage: product.ratingsAverage,
      ratingsQuantity: product.ratingsQuantity,
      reviews: product.reviews
    });
  } catch (error) {
    next(error);
  }
};


/**
 * تعديل مراجعة
 * PUT /products/:productId/reviews/:reviewId
 */
exports.updateReview = async (req, res, next) => {
  try {
    const { productId, reviewId } = req.params;
    const { rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("المنتج غير موجود");
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      res.status(404);
      throw new Error("المراجعة غير موجودة");
    }

    // السماح فقط لصاحب المراجعة
    if (review.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("غير مصرح لك بتعديل هذه المراجعة");
    }

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;

    // إعادة حساب التقييمات
    product.ratingsAverage =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    product.ratingsQuantity = product.reviews.length;

    // تحديث Most Popular
    product.isMostPopular = product.ratingsQuantity >= 1;

    await product.save();

    res.json({
      message: "تم تعديل المراجعة بنجاح",
      review
    });
  } catch (error) {
    next(error);
  }
};


/**
 * حذف مراجعة
 * DELETE /products/:productId/reviews/:reviewId
 */
exports.deleteReview = async (req, res, next) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error("المنتج غير موجود");
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      res.status(404);
      throw new Error("المراجعة غير موجودة");
    }

    // السماح لصاحب المراجعة أو الأدمن
    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res.status(403);
      throw new Error("غير مصرح لك بحذف هذه المراجعة");
    }

    review.remove();

    product.ratingsQuantity = product.reviews.length;
    product.ratingsAverage =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
          product.reviews.length
        : 0;

    await product.save();

    res.json({ message: "تم حذف المراجعة بنجاح" });
  } catch (error) {
    next(error);
  }
};

/**
 * جلب جميع مراجعات مستخدم واحد
 * GET /users/me/reviews
 */
exports.getMyReviews = async (req, res, next) => {
  try {
    const products = await Product.find(
      { "reviews.user": req.user._id },
      { name: 1, reviews: 1 }
    ).populate("reviews.user", "name email");

    const userReviews = [];

    products.forEach(product => {
      product.reviews.forEach(review => {
        if (review.user._id.toString() === req.user._id.toString()) {
          userReviews.push({
            productId: product._id,
            productName: product.name,
            reviewId: review._id,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt
          });
        }
      });
    });

    res.json({
      totalReviews: userReviews.length,
      reviews: userReviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * جلب جميع مراجعات منتج
 * GET /products/:productId/reviews
 */
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let {
      page = 1,
      limit = 5,
      sort = "newest",
      preview
    } = req.query;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400);
      throw new Error("معرف المنتج غير صالح");
    }

    page = parseInt(page);
    limit = parseInt(limit);

    const sortStage =
      sort === "highest"
        ? { "reviews.rating": -1 }
        : { "reviews.createdAt": -1 };

    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(productId) } },

      { $unwind: "$reviews" },

      {
        $lookup: {
          from: "users",
          localField: "reviews.user",
          foreignField: "_id",
          as: "reviews.user"
        }
      },
      { $unwind: "$reviews.user" },

      { $sort: sortStage },

      ...(preview === "true"
        ? [{ $limit: 3 }]
        : [
            { $skip: (page - 1) * limit },
            { $limit: limit }
          ]),

      {
        $project: {
          _id: 0,
          reviewId: "$reviews._id",
          rating: "$reviews.rating",
          comment: "$reviews.comment",
          createdAt: "$reviews.createdAt",
          user: {
            _id: "$reviews.user._id",
            name: "$reviews.user.name",
            email: "$reviews.user.email"
          }
        }
      }
    ];

    const reviews = await Product.aggregate(pipeline);

    const product = await Product.findById(productId).select(
      "name ratingsAverage ratingsQuantity"
    );

    if (!product) {
      res.status(404);
      throw new Error("المنتج غير موجود");
    }

    res.json({
      productId,
      productName: product.name,
      ratingsAverage: product.ratingsAverage,
      ratingsQuantity: product.ratingsQuantity,
      page: preview === "true" ? 1 : page,
      limit: preview === "true" ? 3 : limit,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

/**
 * جلب المنتجات الأعلى تقييمًا
 * GET /products/top-rated
 * Query:
 *  - page
 *  - limit
 *  - minRatings (الحد الأدنى لعدد التقييمات)
 */
