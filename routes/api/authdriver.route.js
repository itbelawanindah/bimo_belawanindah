const express = require('express');

const router = express.Router();


const authdrivercontroller = require('../../controllers/authdriver.controller');

const {
    loginDriverValidator
} = require('../../helpers/validator')
const auth                  = require('../../middlewares/auth.middleware')
const driver = require('../../middlewares/driver.middleware');

router.post('/login', loginDriverValidator, authdrivercontroller.loginDriver)


router.get('/profile', auth,driver, authdrivercontroller.getProfile)
router.get('/refresh-permissions',auth, driver, authdrivercontroller.getDriverPermissions)

module.exports = router