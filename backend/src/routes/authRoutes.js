const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const validationMiddleware = require("../middlewares/validationMiddleware");
const { registerValidation, loginValidation } = require("../validation/authValidation");

router.post("/signup", validationMiddleware(registerValidation), register);
router.post("/login", validationMiddleware(loginValidation), login);

module.exports = router;
