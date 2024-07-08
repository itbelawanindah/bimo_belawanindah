const helper = require('../helpers/helper');

const checkPermission = async (req, res, next) => {
    try {
        if (req.user.role != 1) {

            
            const routerPermission = await helper.getRouterPermission(req.path, req.user.role);
            const userPermissions = await helper.getUserPermissions(req.user._id)

            if (userPermissions.permissions.permissions == undefined || !routerPermission) {
                return res.status(400).json({
                    success: false,
                    msg: "You have no permissions to access this"
                })
            }
            const permission_name   = routerPermission.permission_id.permission_name;
            const permission_value  = routerPermission.permission;

            const hasPermission = userPermissions.permissions.permissions.some(permission=>{
                permission.permission_name == permission_name &&
                permission.permission_value.some(value => permission_value.includes(value))
            })
            if(!hasPermission){
                return res.status(400).json({
                    success: false,
                    msg: "You have no permissions to access this"
                })
            }
        }

        return next()
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}


const checkPermissionUser = async (req, res, next) => {
    try {
        if (req.user.role != 2 && req.user.role != 1) {

            
            const routerPermission = await helper.getRouterPermission(req.path, req.user.role);
            const userPermissions = await helper.getUserPermissions(req.user._id)

            if (userPermissions.permissions.permissions == undefined || !routerPermission) {
                return res.status(400).json({
                    success: false,
                    msg: "You have no permissions to access this"
                })
            }
            const permission_name   = routerPermission.permission_id.permission_name;
            const permission_value  = routerPermission.permission;

            const hasPermission = userPermissions.permissions.permissions.some(permission=>{
                permission.permission_name == permission_name &&
                permission.permission_value.some(value => permission_value.includes(value))
            })
            if(!hasPermission){
                return res.status(400).json({
                    success: false,
                    msg: "You have no permissions to access this"
                })
            }
        }

        return next()
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message
        })
    }
}




module.exports = {
    checkPermission,
    checkPermissionUser,
}