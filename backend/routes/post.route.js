import express from 'express'
import Post from '../models/post.model.js'
import upload from '../middlewares/multer.middleware.js'

const router = express.Router()

router.post('/add-post',upload.single("image"),async(req,res)=>{
    try{
        const post = new Post({
            text:req.body.text,
            imageUrl:req.file? `/uploads/${req.file.filename}`:null,
            author:req.user._id
        });
        await post.save()
        res.status(201).json(post)
    }catch(err){
        res.status(500).json({message:"failed to create post",err:err.message})
    }
})


router.get('/get-posts',async(req,res)=>{
    try{
        const posts = await Post.find().populate("author","username")
        res.json(posts);
    }catch(err){
        return res.status(500).json({message:"Server Error",err:err.message})
    }
})

router.put('/:id',async(req,res)=>{
    try{
        const post = await Post.findByIdAndUpdate(req.params.id,{content},{new:true})
        if(!post){
            return res.status(404).json({message:"Post not found"})
        }
        res.json(post)
    }catch(err){
        return res.status(500).json({message:"Server Error",err:err.message})
    }
})

router.delete('/:id',async(req,res)=>{
    try{
        const id = req.params.id;
        const post = Post.deleteOne({_id:id});
        if(!post){
            return res.status(404).json({message:"Post not found"})
        }
        res.json({message:"Post deleted succesfully"})
    }catch(err){
        return res.status(500).json({message:"Server Error",err:err.message})
    }
})

export default router