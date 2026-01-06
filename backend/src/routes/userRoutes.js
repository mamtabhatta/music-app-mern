const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const validationMiddleware = require("../middlewares/validationMiddleware");
const { updateProfileValidation } = require("../validation/userValidation");
const { uploadSongValidation } = require("../validation/songValidation");
const {
    getMyProfile,
    updateMyProfile,
    getUserById,
    uploadSong,
} = require("../controllers/userController");

router.get("/profile", protect, getMyProfile);
router.get("/profile/:id", protect, getUserById);
router.put("/profile", protect, validationMiddleware(updateProfileValidation), updateMyProfile);
router.post("/upload", protect, validationMiddleware(uploadSongValidation), uploadSong);

module.exports = router;