const { auth } = require("../middlewares/auth");
const { BlogModel } = require("../models/blog.model");

const blogRoute = require("express").Router();

blogRoute.get("/", auth, async (req, res) => {
	try {
		if (req.body.role) {
			const data = await BlogModel.find();
			// console.log(data);
			res.status(200).json(data);
		} else {
			res.status(400).json({ msg: "Something went Wrong" });
		}
	} catch (error) {
		res.status(500).send({ msg: error.message });
	}
});

blogRoute.post("/add", auth, async (req, res) => {
	try {
		const { title, body, email } = req.body;

		if (req.body.role) {
			const newBlog = new BlogModel({
				email,
				title,
				body,
			});

			await newBlog.save();

			res.status("200").send({ msg: "Blog added successfully" });
		} else {
			res.status(400).json({ msg: "Something went Wrong" });
		}
	} catch (error) {
		res.status(500).send({ msg: error.message });
	}
});
blogRoute.delete("/delete/:id", auth, async (req, res) => {
	try {
		if (req.body.role) {
			let { email } = req.body;
			let blogId = req.params.id;

			let checkData = await BlogModel.find({ _id: blogId, email });
			if (checkData) {
				let data = BlogModel.findByIdAndDelete(blogId);
				data.save();

				res.status(200).send({ msg: "Blog Deleted SuccessFully!!!" });
			} else {
				res.status(400).json({ msg: "Blog Doesn't Belongs to you!!!" });
			}
		} else {
			res.status(400).json({ msg: "Something went Wrong" });
		}
	} catch (error) {
		res.status(500).send({ msg: error.message });
	}
});

blogRoute.patch("/update/:id", async (req, res) => {
	try {
		if (req.body.role) {
			let { email } = req.body;
			let blogId = req.params.id;

			let checkData = await BlogModel.find({ _id: blogId, email });
			if (checkData) {
				let data = BlogModel.findByIdAndUpdate(blogId, { email, title, body });
				data.save();

				res.status(200).send({ msg: "Blog Updated SuccessFully!!!" });
			} else {
				res.status(400).json({ msg: "Blog Doesn't Belongs to you!!!" });
			}
		} else {
			res.status(400).json({ msg: "Something went Wrong" });
		}
	} catch (error) {
		res.status(500).send({ msg: error.message });
	}
});

blogRoute.delete("/special-delete/:id", async (req, res) => {
	try {
		if (req.body.role === "Moderator") {
			let { email } = req.body;
			let blogId = req.params.id;

			let data = BlogModel.findByIdAndDelete(blogId);
			data.save();

			res.status(200).send({ msg: "Blog Deleted SuccessFully!!!" });
		} else {
			res.status(400).send({ msg: "Unauthorized" });
		}
	} catch (error) {
		res.status(500).send({ msg: error.message });
	}
});
module.exports = { blogRoute };
