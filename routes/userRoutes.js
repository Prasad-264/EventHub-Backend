const express = require('express');
const router = express.Router();
const {
  getUserById,
  registerUser,
  addInterest,
  removeInterest,
  deleteUser,
  getEventsForUser,
  registerForEvent,
  cancelRegisteredEvent,
} = require('../controllers/user');

router.post('/register', registerUser);
router.get('/:userId', getUserById);
router.delete('/:userId', deleteUser);
router.put('/:userId/addInterest', addInterest);
router.delete('/:userId/removeInterest', removeInterest);
router.get('/:userId/events', getEventsForUser);
router.put('/:userId/register-for-event', registerForEvent);
router.delete('/:userId/cancle-registration', cancelRegisteredEvent);

module.exports = router;