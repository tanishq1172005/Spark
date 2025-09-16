import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const protect = async(req,res,next)=>{
    try{
        let token = req.headers.authorization
        if(token && token.startsWith("Bearer")){
            token= token.split(" ")[1]
            const decoded = jwt.verify(token,process.env.JWT_SECRET)
            req.user= await User.findById(decoded.id).select("-password")
            next()
        }
        else{
            res.status(400).json({message:"Not authorized"})
        }
    }catch(err){
        return res.status(500).json({message:"Server Error",err:err.message})
    }
}

export default protect;