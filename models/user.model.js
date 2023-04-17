const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	role: {
		type: String,
		default: "User",
		enum: ["User", "Moderator"],
	},
	pass: {
		type: String,
		required: true,
	},
});

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
