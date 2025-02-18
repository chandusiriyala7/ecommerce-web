const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')


const app = express()

const FRONTEND_URL = process.env.NODE_ENV === "development" 
    ? process.env.LOCAL_URL 
    : process.env.FRONTEND_URL;


app.use(cors({
    origin : FRONTEND_URL,
    credentials : true
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api",router)

const PORT = 8080 || process.env.PORT


connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("connnect to DB")
        console.log("Server is running "+PORT)
    })
})
