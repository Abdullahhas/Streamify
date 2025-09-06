import User from "../models/User.js"
import FriendRequest from "../models/FriendRequest.js"
import FriendRequest from "../models/FriendRequest.js"
export const  getRecomendedUsers = async (req , res) => {
    try {
        const currentUserId = req.user._id
        const currentUser = req.user

        const recomendedUsers = await User.find({
            $and: [
                {_id : {$ne : currentUserId}}, //exclude current users
                {$id : {$nin : currentUser.friends}}, //exclude current users friends
                {isOnboarded : true}

            ]
        })
        res.status(200).json(recomendedUsers)
    } catch (error) {
         console.error("Error in getRecomendedUsers Controller :", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMyFriends =async (req , res) => {
    try {
        const user = await User.findById(req.user._id).select("friends").populate("friends" , "fullName profilePic nativeLanguaga learningLanguage")

        res.status(200).json(user.friends)
    } catch (error) {
        console.error("error in getMyfri controller :", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const sendFriendRequest = async (req , res)=>{
    try {
        const myId = req.user.id;
        const {id : recipientId } = req.params

        if(myId == recipientId)
        {
            return res.status(400).json({message:"You cant send request to yourself"})
        }

        const recipient = User.findById(recipientId)
        if(!recipient)
        {
             return res.status(404).json({message:"Recipient not found"})
        }

        if(recipient.friends.include(myId))
        {
            return res.status(400).json({message:"You are already friend with this user"})
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                {sender: myId , recipient: recipientId},
                {sender: recipientId , recipient: myId}
            ]
        })
        if(existingRequest)
        {
            return res.status(400).json({message:"Friend request already exists"})
        }


        const friendRequest = new FriendRequest({
            sender : myId,
            recipient : recipientId
        })

        await friendRequest.save()

        res.status(201).json(friendRequest)

    } catch (error) {
        console.error("Error in sendFriendRequest controller :", error);
        res.status(500).json({ message: "Internal server error" }); 
    }
}
