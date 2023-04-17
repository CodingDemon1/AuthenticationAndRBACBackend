const mongoose = require("mongoose");
require("dotenv").config();

async function connection() {
	try {
		await mongoose.connect(`${process.env.MONGO_DB}`);
		console.log("Connected to DB");
	} catch (error) {
		console.log(error.message);
	}
}

module.exports = { connection };
