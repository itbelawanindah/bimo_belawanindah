
const {validationResult} = require('express-validator')
const Role = require('../../models/role.model')

const createRole =async (req,res)=>{
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty){
            return res.status(400).json({
                success: false,
                msg:"Error",
                errors: errors.array()
            })
        }
        const {role_name,value} = req.body
        const isExist = await Role.findOne({
            role_name:{
                $regex:role_name,
                $options:'i'
            }
        });
        if(isExist){
            return res.status(400).json({
                success:false,
                msg:"Role already exists"
            })
        }

        var obj = {
            role_name,
            value
        }

       
        const role = new Role(obj);
        const newRole = await role.save();

        return res.status(200).json({
            success:true,
            msg:"Role added Successfully",
            data:newRole
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

const getRole= async(req, res) =>{
    try {
        const getRole = await Role.find({
            value:{
                $ne:1
            }
        })

        return res.status(200).json({
            success: true,
            msg:"Fetch Data Success",
            data:getRole
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}

module.exports =
{
    createRole,
    getRole,
    
}