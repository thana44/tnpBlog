const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { getComment, addComment, commentLike, commentUnLike } = require('../controllers/commentController');
const router = express.Router()

router.get('/blog-api/getComment', authMiddleware, getComment)
router.post('/blog-api/addComment', authMiddleware, addComment)
router.put('/blog-api/commentLike/:id', authMiddleware, commentLike)
router.put('/blog-api/commentUnLike/:id', authMiddleware, commentUnLike)

module.exports = router;