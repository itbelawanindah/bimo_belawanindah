const express = require('express');

const router = express.Router();


const authcontroller = require('../../controllers/auth.controller');

const {
    registerValidator,
    loginValidator
} = require('../../helpers/validator')

const auth = require('../../middlewares/auth.middleware');

const helper = require('../../helpers/helper')
    router.post('/register', registerValidator, authcontroller.registerUser)
router.post('/login', loginValidator, authcontroller.loginUser)



router.get('/profile', auth, authcontroller.getProfile)


router.get('/refresh-permissions', auth, authcontroller.getUserPermissions)

module.exports = router