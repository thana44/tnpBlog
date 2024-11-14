const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {getAllBlog, createBlog, readBlog, getBlogId, getBlogRecom, blogLike, blogUnLike, getBlogUpdate, blogUpdate, blogDelete} = require('../controllers/blogController');
const router = express.Router()

router.get('/blog-api/getAllBlog', getAllBlog)
router.get('/blog-api/getBlogRecom', getBlogRecom)
router.post('/blog-api/createBlog', authMiddleware, createBlog)
router.get('/blog-api/readBlog/:id', readBlog)
router.get('/blog-api/getBlogId/:id', getBlogId)
router.put('/blog-api/blogLike/:id', authMiddleware, blogLike)
router.put('/blog-api/blogUnLike/:id', authMiddleware, blogUnLike)
router.get('/blog-api/getBlogUpdate', authMiddleware, getBlogUpdate)
router.put('/blog-api/BlogUpdate/:id', authMiddleware, blogUpdate)
router.delete('/blog-api/blogDelete', authMiddleware, blogDelete)

module.exports = router;