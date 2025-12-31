const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

// التحقق من صحة التوكن وتحديد المستخدم
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error("غير مصرح لك"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401);
    next(new Error("توكين غير صالح"));
  }
};

// التحقق من الصلاحية (admin أو owner)
exports.adminOrOwner = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "owner")) {
    next();
  } else {
    res.status(403);
    next(new Error("ليس لديك الصلاحية للقيام بهذا الإجراء"));
  }
};
