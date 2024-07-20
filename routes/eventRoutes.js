const express = require('express');
const router = express.Router();
const {
  getEventbyId,
} = require('../controllers/event');

router.get('/:eventId', getEventbyId);

module.exports = router;