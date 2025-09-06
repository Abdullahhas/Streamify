import express from "express"
import { getRecomendedUsers , getMyFriends , sendFriendRequest , acceptFriendRequest , getFriendRequests , getOutgoingFriendReqs } from "../controllers/user.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"
const router = express.Router()

router.use(protectRoute)

router.get("/" , getRecomendedUsers)
router.get("/friends" , getMyFriends)
router.post("/friend-request/:id" , sendFriendRequest)
router.put("/friend-request/:id/accept" , acceptFriendRequest)
router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);
 
export default router