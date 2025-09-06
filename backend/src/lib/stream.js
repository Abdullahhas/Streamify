import {StreamChat} from "stream-chat"
import "dotenv/config"

const apikey = process.env.STREAM_API_KEY
const apisecret = process.env.STREAM_API_SECRET

if(!apikey || !apisecret)
{
    console.error("Stream api key or secert is missing")
    process.exit(1)

}


const streamClient = StreamChat.getInstance(apikey , apisecret)

export const upsertStreamUser = async (userData) => {   
        try {
            await streamClient.upsertUsers([userData])
            return userData
        } catch (error) {
            console.log("error Upserting stream user")
        }

}


export const genrateStreamToken = (userId) => {
    try {
        const userIdStr = userId.toString()
        const token = streamClient.createToken(userIdStr)
        return token 
    } catch (error) {
        console.log("error generating stream token" , error)
    }
}