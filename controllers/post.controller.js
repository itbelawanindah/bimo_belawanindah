
const {validationResult} = require('express-validator')
const Post = require('../models/post.model')
const createPost =async (req,res)=>{
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(200).json({
                success:false,
                msg:"Errors",
                errors:errors.array(),
            })
        }
        
        const {title, description} = req.body

        var obj ={
            title,
            description
        }
        if(req.body.categories){
            obj.categories = req.body.categories
        }

        const post = new Post(obj);
        const postData = await post.save()
        const postFullData = await Post.findOne({_id:postData._id}).populate('categories');

        // console.log(postFullData)
        return res.status(200).json({
            success:true,
            msg:"Post saved successfully",
            data:postFullData
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const getPost = async(req, res) =>{
    try {
        const getData = await Post.find({}).populate('categories');
        return res.status(200).json({
            success:true,
            msg:"Fetch data SuccessFull",
            data:getData
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        })
    }
}

const deletePost = async(req, res) =>{
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(200).json({
                success:false,
                msg:"Errors",
                errors:errors.array(),
            })
        }
        const {id} = req.body;
        const isExist = await Post.findOne({_id:id})
        if(!isExist){
            return res.status(400).json({
                success:false,
                msg:"Post doest't not exist"
            })
        }

        await Post.findByIdAndDelete({_id:id})
        return res.status(200).json({
            success:true,
            msg:"Delete Success Fully"
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        })
    }
}


const updatePost = async(req, res) =>{
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(200).json({
                success:false,
                msg:"Errors",
                errors:errors.array(),
            })
        }
        const {id,title,description} = req.body;
        const isExist = await Post.findOne({_id:id})
        if(!isExist){
            return res.status(400).json({
                success:false,
                msg:"Post doest't not exist"
            })
        }
        var updateObj = {
            title,
            description
        }
        if(req.body.categories){
            updateObj.categories = req.body.categories
        }
        const updatePost = await Post.findByIdAndUpdate({_id:id},{
            $set:updateObj
        },{new:true})
        return res.status(200).json({
            success:true,
            msg:"Update Success Fully",
            data:updatePost
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        })
    }
}
module.exports = 
{
    createPost,
    getPost,
    deletePost,
    updatePost
}