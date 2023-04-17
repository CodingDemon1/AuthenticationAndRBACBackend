const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../models/blacklist.model");
require("dotenv").config();

const auth = async (req, res, next) => {
	const { accToken } = req.cookies;
	const isTokenBanned = await BlacklistModel.findOne({ token: accToken });

	if (isTokenBanned) {
		return res.status(400).send({ msg: "Please Login Agian!!!" });
	}

	jwt.verify(accToken, process.env.jwtSECkey, async (err, decoded) => {
		if (err) {
			res.status(400).send({ msg: err.message });
		} else {
			console.log(decoded);
			req.body.email = decoded.email;
			req.body.role = decoded.role;
			next();
		}
	});
};

module.exports = { auth };
