import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import passport from "passport";
import passportConfig from "./config/passport.js";

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import songRoutes from "./src/routes/songRoutes.js";
import followRoutes from "./src/routes/followRoutes.js";
import playlistRoutes from "./src/routes/playlistRoutes.js";


import fileUpload from "express-fileupload";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
app.use(express.json());

passportConfig(passport);
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/social", followRoutes);
app.use("/api/playlist", playlistRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));