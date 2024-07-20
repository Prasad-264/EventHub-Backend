const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  getEventbyId,
} = require('../controllers/event');

router.get('/:eventId', verifyToken, getEventbyId);

module.exports = router;