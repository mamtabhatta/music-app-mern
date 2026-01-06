const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/user");
const { generateToken } = require("../utils/jwtUtils");

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err) return res.status(500).json({ message: err.message });
        if (!user) return res.status(400).json({ message: info.message });

        const token = generateToken(user._id, user.role);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    })(req, res, next);
};

module.exports = { register, login };