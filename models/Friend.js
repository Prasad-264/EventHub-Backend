const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["requested", "accepted", "rejected"],
      default: "requested",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Friend", friendSchema);
