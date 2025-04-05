// routes/stylistRoutes.js
const express = require('express');
const router = express.Router();
const {
  getStylists,
  getStylistById
} = require('../controllers/stylistController');

router.route('/').get(getStylists);
router.route('/:id').get(getStylistById);

module.exports = router;
