const User = require('../models/User');
const Interest = require('../models/Interest');
const Event = require('../models/Event');

// Get User details using userId
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const userObject = user.toObject(); 
    delete userObject.password;

    res.status(200).json(userObject);
  } catch (error) {
    console.log("Error in getting user details", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// delete the user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// Add interest to user
const addInterest = async (req, res) => {
  try {  
    const { userId } = req.params;
    const { interestName } = req.body;

    const interest = await Interest.findOne({ name: interestName });

    if (!interest) {
      return res.status(404).json({ error: "Interest not found" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { interests: interest._id } },
      { new: true }
    ).populate('interests');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Interests added successfully" });
  } catch (error) {
    console.error("Error adding interest", error);
    res.status(500).json({ error: "Failed to add interest" });
  }
};

// Remove the interest of user
const removeInterest = async (req, res) => {
  try {
    const { userId } = req.params;
    const { interestName } = req.body;

    const interest = await Interest.findOne({ name: interestName });

    if (!interest) {
      return res.status(404).json({ error: "Interest not found" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { interests: interest._id } },
      { new: true }
    ).populate('interests');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Interests removed successfully" });
  } catch (error) {
    console.error("Error removing interest", error);
    res.status(500).json({ error: "Failed to remove interest" });
  }
};

// Get all the events matching with users interest
const getEventsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('interests');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let events;

    if (user.interests.length === 0) {
      events = await Event.find();
    } else {
      const interestIds = user.interests.map(interest => interest.name);
      events = await Event.find({ interests: { $in: interestIds } });
    }

    res.status(200).json( events );
  } catch (error) {
    console.error("Error fetching events", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// Register for event
const registerForEvent = async (req, res) => {
  try {
    const { userId } = req.params;
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { registeredEvents: event._id } }, // handle dublicates
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the event's participants
    await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { participants: userId } },
      { new: true }
    );

    res.status(200).json({ message: "Event register successfully" });
  } catch (error) {
    console.error("Error registering event", error);
    res.status(500).json({ error: "Failed to register for event" });
  }
}

// remove registered event from user
const cancelRegisteredEvent = async (req, res) => {
  try {
    const { userId } = req.params;
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" })
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { registeredEvents: event._id } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the event's participants
    await Event.findByIdAndUpdate(
      eventId,
      { $pull: { participants: userId } },
      { new: true }
    );

    res.status(200).json({ message: "Event cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling event", error);
    res.status(500).json({ error: "Failed to cancel the event" });
  }
};

// get all the registered events
const getRegisteredEvents = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate({
      path: 'registeredEvents',
      select: 'title date location image',
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.registeredEvents);
  } catch (error) {
    console.error("Error in fetching registered events", error);
    res.status(500).json({ error: "Failed to fetch the events" });
  }
};

// get all the added interests
const getUserInterests = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate({
      path: 'interests',
      select: 'name',
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.interests);
  } catch (error) {
    console.error("Error in fetching user interests", error);
    res.status(500).json({ error: "Failed to fetch user interests" });
  }
};

// Add friend
// remove friend

module.exports = {
  getUserById,
  addInterest,
  removeInterest,
  deleteUser,
  getEventsForUser,
  registerForEvent,
  cancelRegisteredEvent,
  getRegisteredEvents,
  getUserInterests,
};