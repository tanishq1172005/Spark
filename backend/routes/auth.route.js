import User from '../models/user.model.js'
import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import protect from '../middlewares/auth.middleware.js'
import upload from '../middlewares/multer.middleware.js'

const router = express.Router()

const generateToken =(userId)=>{ 
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:'7d'})
} 

router.post('/register',upload.single("image"),async(req,res)=>{
    try{
        const {name,email,password,imageUrl}=req.body;
        const userExists = await User.findOne({email})
        if(userExists){
            return res.status(400).json({message:"User already exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)

        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            imageUrl:req.file? `/uploads/${req.file.filename}`:null
        })

        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            imageUrl:user.imageUrl,
            token:generateToken(user._id)
        })
    }catch(err){
        return res.status(500).json({message:"Server Error",err:err.message})
    }
})


router.post('/login',async(req,res)=>{
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid email or password"})
        }
        const isMatch = bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(500).json({message:"Server Error"})
        }
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:generateToken(user._id)
        })
    }catch(err){
        return res.status(500).json({message:"Server Error",err:err.message})
    }
})

router.get('/profile',protect,async(req,res)=>{
    try{
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.json(user)

    }catch(err){
        return res.status(500).json({message:"Server Error",err:err.message})
    }
})
export default router