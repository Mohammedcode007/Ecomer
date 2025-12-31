const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null
    }
  },
  { timestamps: true }
);

// منع تكرار اسم الفئة داخل نفس المستوى فقط
categorySchema.index({ name: 1, parent: 1 }, { unique: true });

module.exports = mongoose.model("Category", categorySchema);
