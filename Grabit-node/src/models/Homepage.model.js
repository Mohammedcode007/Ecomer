const mongoose = require("mongoose");

// Schema لكل عنصر في الـ Hero Section
const heroSchema = new mongoose.Schema({
  image: {
    type: String, // رابط الصورة أو مسارها
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

// Schema للجزء العادي (عنوان + نص + صورة)
const sectionSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

// Schema للأقسام الترويجية (Promo) مع نسبة الخصم
const promoSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
});

// Schema للأقسام المميزة بالأيقونات
const featureSchema = new mongoose.Schema({
  icon: {
    type: String, // رابط الأيقونة أو اسمها
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

// Schema للجزء الجديد نص + صورة
const textImageSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const homepageSchema = new mongoose.Schema(
  {
    mainTitle: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    whatsappNumber: {
      type: String,
      required: true
    },
    heroSection: [heroSchema],         // الصور العلوية
    sections: [sectionSchema],          // الأقسام العادية
    promoSections: [promoSchema],       // أقسام الترويج مع الخصم
    features: [featureSchema],          // أربعة أجزاء بأيقونات وعناوين ونصوص
    textImageSections: [textImageSchema] // قسم النص + صورة فقط
  },
  { timestamps: true }
);

module.exports = mongoose.model("Homepage", homepageSchema);
