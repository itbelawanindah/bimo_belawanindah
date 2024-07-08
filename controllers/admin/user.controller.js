const {
    validationResult
} = require('express-validator')
const User = require('../../models/user.model')
const bcrypt = require('bcryptjs')
const randomstring = require("randomstring");

const multer = require('multer')
const fs = require('fs');
const path = require('path');
const {
    sendMail
} = require('../../helpers/mailer');
const {
    default: mongoose
} = require('mongoose');
const Permission = require('../../models/permission.model')
const UserPermission = require('../../models/userpermission.model')
const moment = require('moment')
moment.locale('id')




const createUser = async (req, res) => {
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
        const isExist = await User.findOne({
            email
        })

        if (isExist) {
            return res.status(400).json({
                success: false,
                msg: "User already exists"
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
        const user = await User(obj);
        const userData = await user.save();


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
            const userPermission = new UserPermission({
                user_id: userData._id,
                permissions: permissionArray
            })

            await userPermission.save()
        }
        console.log(password)
        const content = `
            <p> Hi ..<b>` + userData.name + `,</b> Your Account is Created , below is your Details</p>
            <table style="border-style:none;">
                <tr>
                    <th>Name : - </th>
                    <td> ` + userData.name + `</td>
                </tr>
                <tr>
                    <th>Email : - </th>
                    <td> ` + userData.email + `</td>
                </tr>
                <tr>
                    <th>Password : - </th>
                    <td> ` + password + `</td>
                </tr>
            
            </table>
            <p> Now you can login your accont in Our Application, Thanks...</p>
        
        `;
        sendMail(userData.email, 'Account Created', content)

        return res.status(200).json({
            success: true,
            msg: "user Create SuccessFull",
            data: userData
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const getUser = async (req, res) => {
    try {
        // console.log(req.user)
        const getUser = await User.aggregate([{
                $match: {
                    _id: {
                        $ne: new mongoose.Types.ObjectId(req.user._id)
                    },
                    is_active: 1
                }
            },
            {
                $lookup: {
                    from: "userpermissions",
                    localField: "_id",
                    foreignField: "user_id",
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
            data: getUser
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const updateUser = async (req, res) => {
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
        const isExist = await User.findOne({
            _id: id
        })

        if (!isExist) {
            return res.status(400).json({
                success: false,
                msg: "User not exists"
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
        const updateData = await User.findByIdAndUpdate({
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
            await UserPermission.findOneAndUpdate({
                user_id: updateData._id
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
            msg: "user Create SuccessFull",
            data: updateData
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const deleteUser = async (req, res) => {
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
        const isExist = await User.findOne({
            _id: id
        })

        if (!isExist) {
            return res.status(400).json({
                success: false,
                msg: "User not exists"
            })
        }
        const deleteUser = await User.findByIdAndUpdate({
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
            data: deleteUser
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const uploadAvatar = async (req, res) => {
    try {
        const file = req.file;
        const filename = file.filename;

        return res.status(200).json(filename)
    } catch (error) {
        return ("Image upload failed")
    }
}


const updateUserProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors) {
            return res.status(400).json({
                success: false,
                msg: "Error",
                errors: errors.Array()
            })
        }
        const isExist = await User.findById(req.params._id)

        if (!isExist) {
            return res.status(400).json({
                success: false,
                msg: "User not exists"
            })
        }

        
        const updateData = await User.findByIdAndUpdate(req.params._id, {
            
            updated_at:moment().format('YYYY-MM-DD HH:mm:ss'),
            $set: {avatar: req.file.path}
        }, {
            new: true
        })

        console.log(updateData)
        return res.status(200).json({
            success: true,
            msg: "user Update SuccessFull",
            data: updateData
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const getuserById = async(req, res, next) => {
    try {
        const isUser = await User.findById(req.params._id)
        if(isUser){
            return res.status(200).json(isUser)
        }else{
            return res.status(404).json("User not Found")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}
module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    getuserById,
    uploadAvatar,
    updateUserProfile
}