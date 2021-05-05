const express = require("express");
const dbHandler = require(process.cwd() + "/server/dbHandler");
const db = new dbHandler();
const dotenv = require("dotenv");

dotenv.config();

app = express();

app.use(express.static("client"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => res.sendFile(process.cwd() + "/client/index.html"));

// POST new user
app.post("/users", (req, res) => {
	const promise = db.createUser(req.body.name);

	promise.then(id => res.json({id: id, name: req.body.name}));
});

// GET all users
app.get("/users", (req, res) => {
	const promise = db.getAllUsers();

	promise.then(users => res.json(users));
});

// DELETE user by id
app.delete("/users/:id", (req, res) => {
	const {id} = req.params;

	const promise = db.removeUserById(id);

	promise.then(rows => res.json({success: rows === 1}));
});

// POST exercise
app.post("/exercises", (req, res) => {
	const {userId, dateString} = req.body;
	
	const promise = db.createExercise(userId, dateString);

	promise.then(id => res.json({id: id}));
});

// GET all exercises from user
app.get("/exercises/:userId", (req, res) => {
	const {userId} = req.params;

	const promise = db.getUsersExercise(userId);

	promise.then(data => {
		res.json(data);
	});
});

const port = process.env.port || 8000;
app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
