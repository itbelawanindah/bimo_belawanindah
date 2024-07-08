const User                  = require('../models/user.model')
const {validationResult}    = require('express-validator')
const bcrypt                = require('bcryptjs')
const jwt                   = require('jsonwebtoken')
const Permission            = require('../models/permission.model')
const UserPermission        = require('../models/userpermission.model')

const helper                = require('../helpers/helper')
const moment = require('moment')
moment.locale ('id')
const registerUser = async (req,res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(200).json({
                success:false,
                msg:"Errors",
                errors:errors.array(),
            })
        }

        const {name,email,password,} = req.body

        const isExistUser = await User.findOne({email});

        if(isExistUser){
            return res.status(200).json({
                success:false,
                msg:"Email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)
        const user = new User({
            name,
            email,
            password:hashedPassword,
            is_active:1,
            aggreement:req.body.aggreement,
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        })

        const userData = await user.save()

        //assign default permissions
        const defaultPermissions = await Permission.find({
            is_default:2
        })

        if(defaultPermissions.length >0){
            const permissionArray = [];
            defaultPermissions.forEach(permission=>{
                permissionArray.push({
                    permission_name:permission.permission_name,
                    permission_value:[0,1,2,3]
                })
            })

            const userPermission = new UserPermission({
                user_id:userData._id,
                permissions:permissionArray
            })
            await userPermission.save()
        }



        return res.status(200).json({
            success:false,
            msg:"Register Successfully",
            data:userData
        })

    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        })
    }
}

const generateAccessToken = async(user)=>{
    const token = jwt.sign(user,process.env.SECRET_KEY,{
        expiresIn:"2h"
    })
    return token
}
const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(200).json({
                success:false,
                msg:"Errors",
                errors:errors.array(),
            })
        }
        const {email,password} = req.body

        const userData = await User.findOne({email})
        if(!userData){
            return res.status(400).json({
                success:false,
                msg:'Email and Password is incorrect'
            })
        }
        const isPasswordMatch = await bcrypt.compare(password,userData.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                msg:'Email and Password is incorrect'
            })
        }
        const accessToken = await generateAccessToken({user:userData})

        return res.status(200).json({
            success:true,
            msg:"Login SuccessFull",
            accessToken:accessToken,
            tokenType:'Bearer',
            data:userData,
        })
    
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        })
    }
}

const getProfile= async (req, res)=>{
    try {
        const user_id    = req.user._id;
        const userData   = await User.findOne({_id:user_id}) 
        return res.status(200).json({
            success:true,
            msg:"Profile Data",
            data:userData
        })


    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        })
    }
}

const getUserPermissions = async(req, res)=>{
    try {
        const user_id = req.user._id;
        const userpermissions = await helper.getUserPermissions(user_id);
        // console.log(userpermissions)
        return res.status(200).json({
            success:true,
            msg:"User Permissions",
            data:userpermissions
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        })
    }
}
module.exports = {
    registerUser,
    loginUser,
    getProfile,
    getUserPermissions
}