import mongoose from "mongoose";

const connectDB = ()=>{
    try{
        mongoose.connect(process.env.MONGODB_URI)
        console.log("connected")
    }catch(err){
        console.error(err)
    }
}

export default connectDB