
const {validationResult} = require('express-validator')
const Item = require('../models/item.model')
const { trusted } = require('mongoose')
const moment = require('moment')
moment.locale('id')
const addItems =async (req,res)=>{
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json({
                success:false,
                msg:"Errors",
                errors:errors.array(),
            })
        }
        const {item_name,description} = req.body

        const isExist = await Item.findOne({
            name:{
                $regex:item_name,
                $options:'i'
            }});
        if(isExist){
            return res.status(200).json({
                msg:"Item already exists"
            })
        }
        const item = new Item({
            item_name:item_name,
            description:description,
            is_active:1,
            created_at:moment().format('YYYY-MM-DD HH:mm:ss')
        })

        const itemData = await item.save()

        return res.status(200).json({
            success: true,
            msg:"Item saved success",
            data:itemData
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const getItem = async(req,res)=>{
    try {
        const is_active=1
        const getData = await Item.find({
           is_active
        });
        return res.status(200).json({
            success: true,
            msg:"Item fetch success",
            data: getData
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        })
    }
}
const deleteItem = async(req,res)=>{
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

        const isExist = await Item.findOne({
           _id:id
            });
        if(!isExist){
            return res.status(200).json({
                msg:"Item is not exists"
            })
        }

        await Item.findByIdAndUpdate({_id:id},{
            is_active:0,            
            deleted_at:moment().format('YYYY-MM-DD HH:mm:ss')
        },{new:true});
        return res.status(200).json({
            success:true,
            msg:"Item Delete success"
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        })
    }
}

const updateItem = async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(200).json({
                success:false,
                msg:"Errors",
                errors:errors.array(),
            })
        }
       
        const {id,item_name,description} = req.body

        const isExist = await Item.findOne({
           _id:id
            });
        if(!isExist){
            return res.status(200).json({
                msg:"Item is not exists"
            })
        }

        const updateData = await Item.findByIdAndUpdate({_id:id},{
            $set:{
                item_name:item_name,
                description:description,
                updated_at:moment().format('YYYY-MM-DD HH:mm:ss')
            }
        },{new:true});
        return res.status(200).json({
            success:true,
            msg:"Item Update success",
            data:updateData
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        })
    }
}

module.exports = {
    addItems,
    getItem,
    deleteItem,
    updateItem
}