const express = require("express");
const { connection } = require("./config/db");
const { userRoute } = require("./routes/user.routes");
const { blogRoute } = require("./routes/blog.routes");
const cookeiParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookeiParser());

app.use("/users", userRoute);

app.use("/blogs", blogRoute);

app.listen(process.env.PORT, async () => {
	await connection();
	console.log(`Listening at Port - ${process.env.PORT} `);
});
