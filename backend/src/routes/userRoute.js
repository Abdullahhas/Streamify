import express from "express"
import { getRecomendedUsers , getMyFriends } from "../controllers/user.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"
const router = express.Router()

router.use(protectRoute)

router.get("/" , getRecomendedUsers)
router.get("/friends" , getMyFriends)
router.post("/friend-request/:id" , sendFriendRequest)
 
export default router