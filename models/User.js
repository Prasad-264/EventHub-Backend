const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	location: {
		type: String,
		required: true
	},
	interests: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Interest'
	}],
	registeredEvents: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Event'
	}],
	friends: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	activities: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Activity'
	}]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
