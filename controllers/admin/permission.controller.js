const {validationResult} = require('express-validator')
const Permission = require('../../models/permission.model')
const addPermission = async (req,res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(200).json({
                success:false,
                msg:"Errors",
                errors:errors.array(),
            })
        }
        const {permission_name} = req.body
        const isExistPermission = await Permission.findOne({
            permission_name:{
                $regex:permission_name,
                $options:'i'
            }
        });
        if(isExistPermission){
            return res.status(400).json({
                success:false,
                msg:"Permission already exists"
            })
        }

        var obj = {
            permission_name
        }

        if(req.body.default){
            obj.is_default = parseInt(req.body.default)
        }
        const permission = new Permission(obj);
        const newPermission = await permission.save();

        return res.status(200).json({
            success:true,
            msg:"Permission added Successfully",
            data:newPermission
        })


    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message
        })
    }
}

const getPermissions = async (req, res) => {
    try {
        const permissionData = await Permission.find({})
        return res.status(200).json({
            success:true,
            msg:"Permission fetch Success",
            data:permissionData
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message,

        })
    }
}
const DeletePermissions = async (req, res) => {
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
        
        const isExistPermission = await Permission.findOne({_id:id})
        if(!isExistPermission){
            return res.status(400).json({
                success:false,
                msg:'Permission ID not Found'
            })
        }

        await Permission.findByIdAndDelete({_id:id})

        return res.status(200).json({
            success:true,
            msg:'Permission Delete Successfully'
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message,

        })
    }
}
const UpdatedPermissions = async (req,res)=>{
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(200).json({
                success:false,
                msg:"Errors",
                errors:errors.array(),
            })
        }
        const {id, permission_name} = req.body

        const isExistPermission = await Permission.findOne({_id:id})
        if(!isExistPermission){
            return res.status(400).json({
                success:false,
                msg:'Permission ID not Found'
            })
        }

        const isNameAssigned = await Permission.findOne({
            
            permission_name
        })

        if(isNameAssigned){
            return res.status(400).json({
                success:false,
                msg:"Permission name already assigned to another permission!"
            })
        }

        var updatePermission = {
            permission_name
        }
        if(req.body.default){
            updatePermission.is_default = parseInt(req.body.default);
        }

        const upddatedPermission = await Permission.findByIdAndUpdate({_id:id},{
            $set:updatePermission
        },{new:true})

        return res.status(200).json({
            success:true,
            msg:"Permission Update Successfully",
            data:upddatedPermission
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            msg:error.message,

        })
    }
}
module.exports = 
{
    addPermission,
    getPermissions,
    DeletePermissions,
    UpdatedPermissions
}