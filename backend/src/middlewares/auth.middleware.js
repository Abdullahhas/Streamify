import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import "dotenv/config"


export const protectRoute = async (req , res , next) => {
    try {
        const token = req.cookies.jwt  //get the token from the req 
        if(!token)
        {
            return res.status(401).json({message : "Unauthorized - No token provided"})
            //if no token means person is not authorized
        }

        //now verify the token
        const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)

        if(!decoded)
        {
          return res.status(401).json({message : "Unauthorized - Invalid token"})   
        }

        const user =await User.findById(decoded.userId).select("-password")

        if(!user)
        {
            return res.status(401).json({message : "Unauthorized - User not found"})   
        }

        req.user = user
        next()
    } catch (error) {
        console.error("Error in protect middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}