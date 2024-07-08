const User      = require('../models/user.model')
const Driver      = require('../models/driver.model')
const mongoose = require('mongoose')



const getUserPermissions = async(user_id)=>{
    try {
        const users = await User.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(user_id)
                }
            },
            {
                $lookup:{
                    from:"userpermissions",
                    localField:"_id",
                    foreignField:"user_id",
                    as:"permissions"
                }
            },
            {
                $project:{
                    _id:1,
                    role:1,
                    permissions:{
                        $cond:{
                            if:{$isArray:"$permissions"},
                            then:{$arrayElemAt:["$permissions",0]},
                            else:null
                        }
                    }
                }
            },
            {
                $addFields:{
                    "permissions":{
                        "permissions":"$permissions.permissions"
                    }
                }
            }
        ])

        return users[0]
    } catch (error) {
        console.log(error);
    }
}


const getDriverPermissions = async(driver_id)=>{
    try {
        const drivers = await Driver.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(driver_id),
                }
            },
            {
                $lookup:{
                    from:"driverpermissions",
                    localField:"_id",
                    foreignField:"driver_id",
                    as:"permissions"
                }
            },
            {
                $project:{
                    _id:1,
                    role:1,
                    permissions:{
                        $cond:{
                            if:{$isArray:"$permissions"},
                            then:{$arrayElemAt:["$permissions",0]},
                            else:null
                        }
                    }
                }
            },
            {
                $addFields:{
                    "permissions":{
                        "permissions":"$permissions.permissions"
                    }
                }
            }
        ])

        return drivers[0]
    } catch (error) {
        console.log(error);
    }
}

const getRouterPermission = async (router,role)=>{
    try {
        const routerPermission = await RouterPermission.findOne({
            router_endpoint:router,
            role
        }).populate('permission_id')
        return routerPermission;
    } catch (error) {
        console.log(error.message)
        return null;
    }
}

module.exports = {
    getUserPermissions,
    getDriverPermissions,
    getRouterPermission
}