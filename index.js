import express from "express"
import dotenv from "dotenv"
import Color  from "colors"
import connDB from "./config/connectdb.js"
import authRoutes from "./routes/authroutes.js"
import cors from "cors"
import categoryRoutes from "./routes/categoryroutes.js"
import productRoutes from "./routes/productroutes.js"
import path from 'path'
import { fileURLToPath } from "url"


const server = express()



//config
dotenv.config()
//port no.
const PORT = process.env.PORT
//connect db
connDB()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
//middlewares
//routing
server.use(express.json())
server.use(express.static(path.join(__dirname,'./frontend/build')));
//cors
server.use(cors());

server.use("/app/v1/",authRoutes)
server.use("/app/v1/",categoryRoutes)
server.use("/app/v1/",productRoutes)

server.use("*",(req,res)=>{
res.sendFile(path.join(__dirname,"./frontend/build/index.html"));
});

server.listen(PORT,()=>{console.log(`server is running at port no. http://localhost:${PORT}`.bgRed.white)})