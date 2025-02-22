const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  getUserById,
  registerUser,
  addInterest,
  removeInterest,
  deleteUser,
  getEventsForUser,
  registerForEvent,
  cancelRegisteredEvent,
  getRegisteredEvents,
  getUserInterests,
} = require('../controllers/user');

router.get('/:userId', verifyToken, getUserById);
router.delete('/:userId', verifyToken, deleteUser);
router.put('/:userId/addInterest', verifyToken, addInterest);
router.delete('/:userId/removeInterest', verifyToken, removeInterest);
router.get('/:userId/events', verifyToken, getEventsForUser);
router.put('/:userId/register-for-event', verifyToken, registerForEvent);
router.delete('/:userId/cancel-registration', verifyToken, cancelRegisteredEvent);
router.get('/:userId/registered-events', verifyToken, getRegisteredEvents);
router.get('/:userId/getInterests', verifyToken, getUserInterests);

module.exports = router;