const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const User = require("./src/models/user");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const createAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ email: "admin001@gmail.com" });
        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        const admin = new User({
            name: "Admin",
            email: "admin001@gmail.com",
            password: hashedPassword,
            role: "admin",
        });

        await admin.save();
        console.log("Admin created successfully");
        process.exit();
    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exit(1);
    }
};

createAdmin();
