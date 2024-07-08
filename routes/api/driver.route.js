const express               = require('express');
const router                = express.Router();

const driverController        = require('../../controllers/admin/driver.controller')



const {
    createDriverValidator,
    updateDriverValidator,
    deleteDriverValidator,
} = require('../../helpers/admin.validator')

const {checkPermission}       = require('../../middlewares/check.Permissions')
const auth                  = require('../../middlewares/auth.middleware')
const driver                  = require('../../middlewares/driver.middleware')

const upload                = require('../../middlewares/uploads')




//user router

router.post('/create-driver',auth,checkPermission,createDriverValidator,driverController.createDriver)
router.get('/get-driver',auth,checkPermission,driverController.getDriver)
router.get('/getdriver/:_id',auth,checkPermission,driverController.getdriverById)
router.post('/update/driver/:_id',auth,checkPermission,upload.single('avatar'),driverController.updateDriverProfile)
router.post('/update-driver',auth,checkPermission,updateDriverValidator,driverController.updateDriver)
router.post('/delete-driver',auth,checkPermission,deleteDriverValidator,driverController.deleteDriver)



module.exports = router