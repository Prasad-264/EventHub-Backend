const User = require("../models/User");
const Friend = require("../models/Friend");

const addFriend = async (req, res) => {
  try {
    const { requesterId, recipientId } = req.body;
    const existingFriendRequest = await Friend.findOne({
      requester: requesterId,
      recipient: recipientId,
    });

    if (existingFriendRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    const friend = new Friend({
      requester: requesterId,
      recipient: recipientId,
      status: "requested",
    });

    await friend.save();
    res.status(201).json({ message: "Friend request sent", friend });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { requesterId, recipientId } = req.body;

    const friendRequest = await Friend.findOne({
      requester: requesterId,
      recipient: recipientId,
      status: "requested",
    });

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(requesterId, {
      $addToSet: { friends: recipientId },
    });

    await User.findByIdAndUpdate(recipientId, {
      $addToSet: { friends: requesterId },
    });

    res.status(200).json({ message: "Friend request accepted", friendRequest });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const { requesterId, recipientId } = req.body;

    const friendRequest = await Friend.findOneAndDelete({
      requester: requesterId,
      recipient: recipientId,
      status: "requested",
    });

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    res.status(200).json({ message: "Friend request rejected and deleted", friendRequest });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const removeFriend = async (req, res) => {
  try {
    const { requesterId, recipientId } = req.body;

    const friend = await Friend.findOneAndDelete({
      $or: [
        { requester: requesterId, recipient: recipientId, status: "accepted" },
        { requester: recipientId, recipient: requesterId, status: "accepted" },
      ],
    });

    if (!friend) {
      return res.status(404).json({ message: "Friend not found" });
    }

    await User.findByIdAndUpdate(requesterId, {
      $pull: { friends: recipientId },
    });

    await User.findByIdAndUpdate(recipientId, {
      $pull: { friends: requesterId },
    });

    res.status(200).json({ message: "Friend removed", friend });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  addFriend,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
};
