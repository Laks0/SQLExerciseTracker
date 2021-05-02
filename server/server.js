const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

app = express();

app.use(express.static("client"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => res.sendFile(process.cwd() + "/client/index.html"));

const port = process.env.port || 8000;
app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
