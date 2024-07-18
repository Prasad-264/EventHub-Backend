const express = require('express');
const router = express.Router();
const {
  getUserById,
  registerUser,
  addInterest,
  removeInterest,
  deleteUser,
} = require('../controllers/user');

router.post('/register', registerUser);
router.get('/:userId', getUserById);
router.delete('/:userId', deleteUser);
router.put('/:userId/addInterest', addInterest);
router.delete('/:userId/removeInterest', removeInterest);

module.exports = router;