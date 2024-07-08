const express               = require('express');
const router                = express.Router();

const permissionControoler  = require('../../controllers/admin/permission.controller')
const roleController        = require('../../controllers/admin/role.controller')
const userController        = require('../../controllers/admin/user.controller')
const routerController      = require('../../controllers/admin/router.controller')



const {
    permissionValidator,
    permissionUpdateValidator,
    permissionDeleteValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    storeRoleValidator,
    addRouterPermissionValidator,
    getRouterPermissionValidator
} = require('../../helpers/admin.validator')

const {checkPermission,checkPermissionUser}       = require('../../middlewares/check.Permissions')
const auth                  = require('../../middlewares/auth.middleware')
const {onlyAdminAccess}     = require('../../middlewares/admin.middleware')
const upload                = require('../../middlewares/uploads')


//permissions router
router.post('/add-permission',auth,onlyAdminAccess,permissionValidator,permissionControoler.addPermission)
router.get('/get-permissions',auth,onlyAdminAccess,permissionControoler.getPermissions)
router.post('/delete-permissions',auth,onlyAdminAccess,permissionDeleteValidator,permissionControoler.DeletePermissions)
router.post('/update-permissions',auth,onlyAdminAccess,permissionUpdateValidator,permissionControoler.UpdatedPermissions)


//role router
router.post('/create-role',auth,onlyAdminAccess,storeRoleValidator,roleController.createRole)
router.get('/get-role',auth,onlyAdminAccess,roleController.getRole)
//router
router.get('/all-routes',auth,onlyAdminAccess,routerController.getAllRoutes)
router.post('/add-router-permission',auth,onlyAdminAccess,addRouterPermissionValidator,routerController.addRouterPermission)
router.get('/get-router-permission',auth,onlyAdminAccess,getRouterPermissionValidator,routerController.getRouterPermission)

//user router

router.post('/create-user',auth,checkPermission,createUserValidator,userController.createUser)
router.get('/get-user',auth,checkPermission,userController.getUser)
router.get('/getuser/:_id',auth,checkPermissionUser,userController.getuserById)
router.post('/update/user/:_id',auth,checkPermissionUser,upload.single('avatar'),userController.updateUserProfile)
router.post('/upload',auth,checkPermissionUser,upload.single('avatar'),userController.uploadAvatar)
router.post('/update-user',auth,checkPermissionUser,updateUserValidator,userController.updateUser)
router.post('/delete-user',auth,checkPermission,deleteUserValidator,userController.deleteUser)



module.exports = router