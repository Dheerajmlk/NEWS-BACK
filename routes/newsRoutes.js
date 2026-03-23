const express = require('express');
const router = express.Router();
const { query } = require('express-validator');
const rateLimit = require('express-rate-limit');

const {
  getNews,
  fetchNewsManual,
  deleteNews
} = require('../controllers/newsController');

const { protect } = require('../middleware/authMiddleware');

const fetchLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100, 
  message: 'Too many fetch requests, try again later'
});


router.get('/', getNews);

const { createNews } = require('../controllers/newsController');

router.post('/create', protect, createNews);

router.post(
  '/fetch',
  protect,
  fetchLimiter,
  [
    query('category').optional().isString().trim(),
    query('q').optional().isString().trim()
  ],
  fetchNewsManual
);


router.delete('/:id', protect, deleteNews);


module.exports = router;