const express = require('express');
const { search } = require('../controllers/searchController');
const router = express.Router()

router.get('/blog-api/search', search)

module.exports = router;