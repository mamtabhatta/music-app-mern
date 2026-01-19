const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const passport = require("passport");
const passportConfig = require("./config/passport");


const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const songRoutes = require("./src/routes/songRoutes");
const followRoutes = require("./src/routes/followRoutes");
const playlistRoutes = require("./src/routes/playlistRoutes");
const postRoutes = require("./src/routes/postRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const fileUpload = require("express-fileupload");
const cors = require("cors");

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
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
