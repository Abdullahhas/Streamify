import express from "express"
import authRoutes from "./routes/authRoute.js"
import userRoutes from "./routes/userRoute.js"
import chatRoutes from "./routes/chatRoute.js"
import { connectdb } from "./lib/db.js"
import cookieParser from "cookie-parser"
import "dotenv/config"
import cors from "cors"




const app = express()
app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin:["http://localhost:5173"],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}))


app.use("/api/auth" , authRoutes)
app.use("/api/users" , userRoutes)
app.use("/api/chats" , chatRoutes)


const PORT = process.env.PORT


app.listen(PORT , ()=> {
    
    console.log(`Server is listening on ${PORT} `) 
    connectdb()
    
})

