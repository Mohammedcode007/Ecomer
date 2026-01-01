const express = require("express");
const router = express.Router();
const { register, getUsers,login, requestPasswordReset, resetPassword,updateUser, deleteUser} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware"); // افترض أنك تستخدم middleware للتحقق من التوكن

router.post("/register", register);
router.post("/login", login);

router.post("/forgot-password", requestPasswordReset);
router.put("/user", protect, updateUser);

// حذف المستخدم (اعتمادًا على التوكن)
router.delete("/user", protect, deleteUser);
router.get("/users", protect, getUsers);

// إعادة تعيين كلمة المرور بعد التحقق بالكود
router.post("/reset-password", resetPassword);
module.exports = router;
