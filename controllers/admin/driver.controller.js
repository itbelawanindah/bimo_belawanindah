const {
    validationResult
} = require('express-validator')
const Driver = require('../../models/driver.model')
const bcrypt = require('bcryptjs')
const randomstring = require("randomstring");


const {
    sendMail
} = require('../../helpers/mailer');
const {
    default: mongoose
} = require('mongoose');
const Permission = require('../../models/permission.model')
const DriverPermission = require('../../models/driverpermission.model')
const moment = require('moment')
moment.locale('id')

const createDriver = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors) {
            return res.status(400).json({
                success: false,
                msg: "Error",
                errors: errors.Array()
            })
        }
        const {
            name,
            email,
            description,
            address,
            mobile,
            card,
            kk,
            ktp,
            npwp,
            lisensi,
        } = req.body
        const isExist = await Driver.findOne({
            email
        })

        if (isExist) {
            return res.status(400).json({
                success: false,
                msg: "Driver already exists"
            })
        }

        const password = randomstring.generate(6)
        const hashPassword = await bcrypt.hash(password, 10)

        var obj = {
            name,
            email,
            password: hashPassword,
            is_active:1,
            description,
            address,
            mobile,
            card,
            kk,
            ktp,
            npwp,
            lisensi,
            created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
        }

        if (req.body.role && req.body.role == 1) {
            return res.status(400).json({
                success: false,
                msg: "You can't create Admin!"
            })
        } else if (req.body.role) {
            obj.role = req.body.role
        }
        const driver = await Driver(obj);
        const driverData = await driver.save();


        //add permissions to user if coming in request
        if (req.body.permissions != undefined && req.body.permissions.length > 0) {
            const addPermission = req.body.permissions;
            const permissionArray = [];

            await Promise.all(addPermission.map(async (permission) => {
                const permissionData = await Permission.findOne({
                    _id: permission.id
                });
                permissionArray.push({
                    permission_name: permissionData.permission_name,
                    permission_value: permission.value
                })
            }))
            const driverPermission = new DriverPermission({
                driver_id: driverData._id,
                permissions: permissionArray
            })

            await driverPermission.save()
        }
        console.log(password)
        const content = `
            <p> Hi ..<b>` + driverData.name + `,</b> Your Account is Created , below is your Details</p>
            <table style="border-style:none;">
                <tr>
                    <th>Name : - </th>
                    <td> ` + driverData.name + `</td>
                </tr>
                <tr>
                    <th>Email : - </th>
                    <td> ` + driverData.email + `</td>
                </tr>
                <tr>
                    <th>Password : - </th>
                    <td> ` + password + `</td>
                </tr>
            
            </table>
            <p> Now you can login your accont in Our Application, Thanks...</p>
        
        `;
        sendMail(driverData.email, 'Account Created', content)

        return res.status(200).json({
            success: true,
            msg: "Driver Create SuccessFull",
            data: driverData
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const updatePasswordDriver = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors) {
            return res.status(400).json({
                success: false,
                msg: "Error",
                errors: errors.Array()
            })
        }
        const {
            password
        } = req.body
        const isExist = await Driver.findById(req.params._id)

        if (!isExist) {
            return res.status(400).json({
                success: false,
                msg: "Driver is not exists"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const driverData = await Driver.findByIdAndUpdate(req.params._id, {
            $set: {password: hashPassword},
            updated_password:moment().format('YYYY-MM-DD HH:mm:ss'),
        }, {
            new: true
        })


        console.log(password)
       

        return res.status(200).json({
            success: true,
            msg: "Driver Update SuccessFull",
            data: driverData
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}
const getDriver = async (req, res) => {
    try {
        // console.log(req.user)
        const getDriver = await Driver.aggregate([{
                $match: {
                    // _id: {
                    //     $ne: new mongoose.Types.ObjectId(req.driver._id)
                    // },
                    is_active: 1
                }
            },
            {
                $lookup: {
                    from: "driverpermissions",
                    localField: "_id",
                    foreignField: "driver_id",
                    as: "permissions"
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    role: 1,
                    permissions: {
                        $cond: {
                            if: {
                                $isArray: "$permissions"
                            },
                            then: {
                                $arrayElemAt: ["$permissions", 0]
                            },
                            else: null
                        }
                    }
                }
            },
            {
                $addFields: {
                    "permissions": {
                        "permissions": "$permissions.permissions"
                    }
                }
            }
        ])
        return res.status(200).json({
            success: true,
            msg: "Fetch user Successfull",
            data: getDriver
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}
// const getUser =async(req, res) =>{
//     try {
//         // console.log(req.user)
//         const getUser = await User.find({
//             _id:{
//                 $ne:req.user._id
//             }
//         })
//         return res.status(200).json({
//             success: true,
//             msg: "Fetch user Successfull",
//             data: getUser
//         })
//     } catch (error) {
//         return res.status(400).json({
//             success: false,
//             msg: error.message
//         })
//     }
// }

const updateDriver = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors) {
            return res.status(400).json({
                success: false,
                msg: "Error",
                errors: errors.Array()
            })
        }
        const {
            id,
            name,
            description,
            address,
            mobile,
            card,
            kk,
            ktp,
            npwp,
            lisensi,
        } = req.body
        const isExist = await Driver.findOne({
            _id: id
        })

        if (!isExist) {
            return res.status(400).json({
                success: false,
                msg: "Driver not exists"
            })
        }

        var UpdateObj = {
            name,
            description,
            address,
            mobile,
            card,
            kk,
            ktp,
            npwp,
            lisensi,
            updated_at:moment().format('YYYY-MM-DD HH:mm:ss'),
        }
        if (req.body.role != undefined) {
            UpdateObj.role = req.body.role
        }
        const updateData = await Driver.findByIdAndUpdate({
            _id: id
        }, {
            $set: UpdateObj
        }, {
            new: true
        })



        //add permissions to user if coming in request
        if (req.body.permissions != undefined && req.body.permissions.length > 0) {
            const addPermission = req.body.permissions;
            const permissionArray = [];

            await Promise.all(addPermission.map(async (permission) => {
                const permissionData = await Permission.findOne({
                    _id: permission.id
                });
                permissionArray.push({
                    permission_name: permissionData.permission_name,
                    permission_value: permission.value
                })
            }))
            await DriverPermission.findOneAndUpdate({
                driver_id: updateData._id
            }, {
                permissions: permissionArray
            }, {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            });
        }
        return res.status(200).json({
            success: true,
            msg: "Driver Create SuccessFull",
            data: updateData
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const deleteDriver = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors) {
            return res.status(400).json({
                success: false,
                msg: "Error",
                errors: errors.Array()
            })
        }
        const {
            id
        } = req.body
        const isExist = await Driver.findOne({
            _id: id
        })

        if (!isExist) {
            return res.status(400).json({
                success: false,
                msg: "Driver not exists"
            })
        }
        const deleteDriver = await Driver.findByIdAndUpdate({
            _id: id
        }, {
            is_active: 0,            
            deleted_at:moment().format('YYYY-MM-DD HH:mm:ss'),
        }, {
            new: true
        })


        return res.status(200).json({
            success: true,
            msg: "Delete SuccessFull",
            data: deleteDriver
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}


const updateDriverProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors) {
            return res.status(400).json({
                success: false,
                msg: "Error",
                errors: errors.Array()
            })
        }
        const isExist = await Driver.findById(req.params._id)

        if (!isExist) {
            return res.status(400).json({
                success: false,
                msg: "User not exists"
            })
        }

        
        const updateData = await Driver.findByIdAndUpdate(req.params._id, {
            
            updated_at:moment().format('YYYY-MM-DD HH:mm:ss'),
            $set: {avatar: req.file.path}
        }, {
            new: true
        })

        console.log(updateData)
        return res.status(200).json({
            success: true,
            msg: "Driver Update SuccessFull",
            data: updateData
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const getdriverById = async(req, res, next) => {
    try {
        const isDriver = await Driver.findById(req.params._id)
        if(isDriver){
            return res.status(200).json(isDriver)
        }else{
            return res.status(404).json("Driver not Found")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}
module.exports = {
    createDriver,
    getDriver,
    updateDriver,
    deleteDriver,
    getdriverById,
    updateDriverProfile,
    updatePasswordDriver
}