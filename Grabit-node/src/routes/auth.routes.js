const express = require("express");
const router = express.Router();
const { register, login, requestPasswordReset, resetPassword } = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);

router.post("/forgot-password", requestPasswordReset);

// إعادة تعيين كلمة المرور بعد التحقق بالكود
router.post("/reset-password", resetPassword);
module.exports = router;
