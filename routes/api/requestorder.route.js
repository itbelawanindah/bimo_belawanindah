const express               = require('express');
const router                = express.Router();

const auth                   = require('../../middlewares/auth.middleware')
const requestordercontroller = require('../../controllers/requestorder.controller')
const {requestorderValidator}  = require('../../helpers/admin.validator')
const {checkPermissionUser}   = require('../../middlewares/check.Permissions')


router.post('/requestorder',auth,checkPermissionUser,requestorderValidator,requestordercontroller.createRequestOrder)
router.get('/getrequestorder',auth,checkPermissionUser,requestorderValidator,requestordercontroller.getDataRequest)
router.get('/getrequestorder/customer/:customer_id',auth,checkPermissionUser,requestorderValidator,requestordercontroller.getDataRequestByuser)
router.post('/cancelrequestorder/customer/:_id',auth,checkPermissionUser,requestordercontroller.cancelRequestOrder)
module.exports = router