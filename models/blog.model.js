const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	email: {
		type: String,
	},
});

const BlogModel = mongoose.model("blogs", blogSchema);

module.exports = { BlogModel };
