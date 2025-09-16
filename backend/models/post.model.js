import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

const Post = mongoose.model("Post",postSchema)
export default Post