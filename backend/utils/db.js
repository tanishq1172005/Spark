import mongoose from "mongoose";

const connectDB = ()=>{
    try{
        mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        tlsAllowInvalidCertificates: false,
})
        console.log("connected")
    }catch(err){
        console.error(err)
    }
}

export default connectDB