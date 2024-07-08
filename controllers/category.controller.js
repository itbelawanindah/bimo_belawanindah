
const {validationResult} = require('express-validator')
const Category = require('../models/category.model')
const { trusted } = require('mongoose')

const addCategory =async (req,res)=>{
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(200).json({
                success:false,
                msg:"Errors",
                errors:errors.array(),
            })
        }
        const {category_name} = req.body

        const isExist = await Category.findOne({
            name:{
                $regex:category_name,
                $options:'i'
            }});
        if(isExist){
            return res.status(200).json({
                msg:"Category already exists"
            })
        }
        const category = new Category({
            name:category_name
        })

        const categoryData = await category.save()

        return res.status(200).json({
            success: true,
            msg:"Category saved successfully",
            data:categoryData
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const getCategory = async(req,res)=>{
    try {
        const getData = await Category.find({});
        return res.status(200).json({
            success: true,
            msg:"Category fetch successfully",
            data: getData
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        })
    }
}
const deleteCategory = async(req,res)=>{
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(200).json({
                success:false,
                msg:"Errors",
                errors:errors.array(),
            })
        }
       
        const {id} = req.body

        const isExist = await Category.findOne({
           _id:id
            });
        if(!isExist){
            return res.status(200).json({
                msg:"Category is not exists"
            })
        }

        await Category.findByIdAndDelete({_id:id});
        return res.status(200).json({
            success:true,
            msg:"category Delete successfully"
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        })
    }
}

const updateCategory = async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(200).json({
                success:false,
                msg:"Errors",
                errors:errors.array(),
            })
        }
       
        const {id,category_name} = req.body

        const isExist = await Category.findOne({
           _id:id
            });
        if(!isExist){
            return res.status(200).json({
                msg:"Category is not exists"
            })
        }

        const updateData = await Category.findByIdAndUpdate({_id:id},{
            $set:{
                name:category_name
            }
        },{new:trusted});
        return res.status(200).json({
            success:true,
            msg:"category Update successfully"
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        })
    }
}

module.exports = {
    addCategory,
    getCategory,
    deleteCategory,
    updateCategory
}