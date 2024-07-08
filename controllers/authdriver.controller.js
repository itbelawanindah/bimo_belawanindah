const Driver                  = require('../models/driver.model')
const {validationResult}    = require('express-validator')
const bcrypt                = require('bcryptjs')
const jwt                   = require('jsonwebtoken')
const Permission            = require('../models/permission.model')
const UserPermission        = require('../models/userpermission.model')

const helper                = require('../helpers/helper')
const moment = require('moment')
moment.locale ('id')


const generateAccessToken = async(driver)=>{
    const token = jwt.sign(driver,process.env.SECRET_KEY,{
        expiresIn:"2h"
    })
    return token
}
const loginDriver = async (req, res) => {
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

        const driverData = await Driver.findOne({email})
        if(!driverData){
            return res.status(400).json({
                success:false,
                msg:'Email and Password is incorrect'
            })
        }
        const isPasswordMatch = await bcrypt.compare(password,driverData.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                msg:'Email and Password is incorrect'
            })
        }
        const accessToken = await generateAccessToken({driver:driverData})

        return res.status(200).json({
            success:true,
            msg:"Login SuccessFull",
            accessToken:accessToken,
            tokenType:'Bearer',
            data:driverData,
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
        const driver_id    = req.driver._id;
        const driverData   = await Driver.findOne({_id:driver_id}) 
        return res.status(200).json({
            success:true,
            msg:"Profile Data",
            data:driverData
        })


    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        })
    }
}

const getDriverPermissions = async(req, res)=>{
    try {
        const driver_id = req.driver._id;
        const driverpermissions = await helper.getDriverPermissions(driver_id);
        console.log(driverpermissions)
        return res.status(200).json({
            success:true,
            msg:"Driver Permissions",
            data:driverpermissions
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        })
    }
}
module.exports = {
    loginDriver,
    getDriverPermissions,
    getProfile
}