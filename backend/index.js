import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './utils/db.js'
import authRoute from './routes/auth.route.js'
import postRoute from './routes/post.route.js'
import protect from './middlewares/auth.middleware.js'
import path from 'path'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

connectDB()

const port = 5000;

app.use('/api/auth',authRoute)
app.use('/api',protect,postRoute)

app.use("/uploads", express.static("uploads"));




app.listen(port,()=>{
    console.log(`App listening on port ${port}`)
})