import User from "../models/User.js"
import jwt from "jsonwebtoken"
import "dotenv/config"
import { upsertStreamUser } from "../lib/stream.js";



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

        try {
            await upsertStreamUser({
            id : newUser._id.toString(),
            name :  newUser.fullName,
            image : newUser.profilePic || ""

        })
        console.log("Stream user created successfully")
        } catch (error) {
            console.log("Error in create stream user")
        }
       

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

export const login = async (req , res) => {
    try {
        const {email , password} = req.body
        if (!email  || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({email})
        if(!user)
        {
            return res.status(401).json({message : "Invalid username or password"})
        }

        const isPasswordCorrect = await user.matchPassword(password)
        if(!isPasswordCorrect) return res.status(401).json({message : "password not correct"})


        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "7d" }
        );

        
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).json({success: true , user} )



    } catch (error) {
         console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = (req , res) => {
    res.clearCookie("jwt")
    res.status(200).json({success : true , message: "Logout successfully" });
}


export const onboard = async (req , res) => {
    try {
        const userId = req.user._id

        const {fullName , bio , nativeLanguage , learningLanguage , location} = req.body
        
        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location)
        {
            return res.status(400).json({ message: "All fields are required" });
        }

       const updatedUser =  await User.findByIdAndUpdate(userId , {
        ...req.body,
        isOnboarded : true
        }, {new:true})



        if(!updatedUser)
        {
            return res.status(404).json({ message: "User not found" });
        }

        //Update user in the stream also
        try {
            await upsertStreamUser({
            id : updatedUser._id.toString(),
            name : updatedUser.fullName,
            image : updatedUser.profilePic
        })
        console.log(`Stream user updated successfully ${updatedUser.fullName} `)
        } catch (error) {
            console.log("Error in create stream user")
        }
       
        
        

        res.status(200).json({success : true , user : updatedUser})
    } catch (error) {
        console.error("Onboarding Error :", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
