import express from "express"
import authRoutes from "./routes/authRoute.js"
import { connectdb } from "./lib/db.js"
import cookieParser from "cookie-parser"
import "dotenv/config"


const app = express()
app.use(express.json());
app.use(cookieParser())


app.use("/api/auth" , authRoutes)


const PORT = process.env.PORT


app.listen(PORT , ()=> {
    
    console.log(`Server is listening on ${PORT} `) 
    connectdb()
    
})

