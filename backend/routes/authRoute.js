const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const {registerController, loginController, checkToken} = require('../controllers/authController')

router.post('/blog-api/register', registerController)
router.post('/blog-api/login', loginController)
router.get('/blog-api/checkToken', authMiddleware, checkToken)

module.exports = router