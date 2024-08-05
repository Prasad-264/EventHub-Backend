const express = require('express');
const router = express.Router();
const {
  addFriend,
  acceptFriendRequest,
  removeFriend,
  rejectFriendRequest,
} = require('../controllers/friend');

router.post("/add-friend", addFriend);
router.post("/accept-friend", acceptFriendRequest);
router.post("/reject-friend", rejectFriendRequest);
router.post("/remove-friend", removeFriend);

module.exports = router;
