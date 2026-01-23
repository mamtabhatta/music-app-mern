import express from "express";
import userController from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import { updateProfileValidation } from "../validation/userValidation.js";

const router = express.Router();

const {
    getAllSongs,
    uploadSong,
    getMyProfile,
    updateMyProfile,
    getUserById
} = userController;

router.get("/songs", getAllSongs);
router.get("/profile", protect, getMyProfile);
router.put("/profile", protect, validationMiddleware(updateProfileValidation), updateMyProfile);
router.post("/upload", protect, uploadSong);
router.get("/profile/:id", protect, getUserById);

export default router;