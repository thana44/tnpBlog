const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {getUserProfile, getUserProfileForUpdate, updateProfile} = require('../controllers/userController')
const router = express.Router();

router.get('/blog-api/getProfile/:id', getUserProfile)
router.get('/blog-api/getProfileUpdate/:id', authMiddleware, getUserProfileForUpdate)
router.put('/blog-api/updateProfile/:id', authMiddleware, updateProfile)

module.exports  = router;