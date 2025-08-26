import User from "../models/User.js"
import jwt from "jsonwebtoken"
import "dotenv/config"


export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;

    try {
        // 1. Validate input
        if (!email || !fullName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }


        // 4. Generate random avatar
        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        // 5. Create and save user
        const newUser = new User({
            email,
            password,
            fullName,
            profilePic: randomAvatar
        });

        await newUser.save();

        // 6. Generate token
        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        );

        // 7. Set cookie
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        // 8. Send response
        res.status(201).json({ success: true, user: newUser });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = (req , res) => {
    res.send("login")
}

export const logout = (req , res) => {
    res.send("logout")
}

