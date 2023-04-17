const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../models/blacklist.model");
require("dotenv").config();
const userRoute = require("express").Router();

userRoute.post("/register", async (req, res) => {
	try {
		const { name, email, pass, role } = req.body;
		const isUserExist = await UserModel.findOne({ email });
		if (isUserExist) {
			return res
				.status(400)
				.send({ msg: "The email you entered is already exists" });
		}

		const hashedPassword = bcrypt.hashSync(pass, 5);
		const newUser = new UserModel({ name, email, role, pass: hashedPassword });
		await newUser.save();

		res.status(200).send({ msg: "User Created Successfully" });
	} catch (error) {
		res.status(500).send({ msg: error.message });
	}
});

userRoute.post("/login", async (req, res) => {
	try {
		const { email, pass } = req.body;
		const isUserExist = await UserModel.findOne({ email });

		if (!isUserExist) {
			return res
				.status(400)
				.send({ msg: " You are not Signed up! Please register first." });
		}

		const isPasswordCorrect = bcrypt.compareSync(pass, isUserExist.pass);
		if (!isPasswordCorrect) {
			return res.status(401).send({ msg: "Wrong Credentials!!" });
		}

		const accessToken = jwt.sign(
			{ email, role: isUserExist.role },
			process.env.jwtSECkey,
			{ expiresIn: "1m" }
		);
		const refreshToken = jwt.sign(
			{ email, role: isUserExist.role },
			process.env.jwtRefSECkey,
			{ expiresIn: "3m" }
		);

		res.cookie("accToken", accessToken, { maxAge: 1000 * 60 });
		res.cookie("refToken", refreshToken, { maxAge: 1000 * 60 * 3 });

		res.status(200).send({ msg: "Logged in Successfully" });
	} catch (error) {
		res.status(500).send({ msg: error.message });
	}
});

userRoute.get("/logout", async (req, res) => {
	try {
		const { accToken, refToken } = req.cookies;

		const blacklistAccToken = new BlacklistModel(accToken);
		const blacklistRefToken = new BlacklistModel(refToken);

		await blacklistAccToken.save();
		await blacklistRefToken.save();

		res.status(200).send({ msg: "Logged Out Successfully!!!" });
	} catch (error) {
		res.status(500).send({ msg: error.message });
	}
});

userRoute.get("/getnewtoken", async (rea, res) => {
	try {
		const refToken = req.cookies.refToken;

		const isTokenBanned = await BlacklistModel.find({ token: refToken });

		if (isTokenBanned) {
			return res.status(400).send({ msg: "please Log in Again!!!" });
		}

		const tokenValidCheck = jwt.verify(refToken, process.env.jwtRefSECkey);

		if (!isTokenBanned) {
			return res.status(400).send({ msg: "please Log in Again!!!" });
		}

		const newAccToken = jwt.sign(
			{ email, role: isTokenBanned.role },
			process.env,
			jwtSECkey,
			{ expiresIn: "1m" }
		);
		res.cookie("accToken", newAccToken, { maxAge: 1000 * 60 });

		res.status(200).send({ msg: "Token Generated!!!" });
	} catch (error) {
		res.status(500).send({ msg: error.message });
	}
});

module.exports = { userRoute };
