const Event = require('../models/Event');

const getEventbyId = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ error: "No event found" });
    }

    res.status(200).json( event );
  } catch (error) {
    console.error("Error fetching event", error);
    return res.status(500).json({ error: "No event found" });
  }
};

module.exports = {
  getEventbyId,
}
