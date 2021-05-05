const server = "http://localhost:8000";

const newUser = document.getElementById("toggle-user-btn");
const newUserContainer = document.getElementById("new-user-container");
newUser.onclick = () => {
	newUserContainer.hidden = false;
};

const addUserBtn = document.getElementById("add-user-btn");
addUserBtn.onclick = () => {
	const nameInput = document.getElementById("new-user-input");
	createUser(nameInput.value);
	nameInput.innerHTML = "";
};

const createUser = (name) => {
	fetch(server + "/users", {
		method: "POST",
		headers: {"Content-type": "application/json"},
		body: JSON.stringify({ name: name })
	}).then(res => res.json())
		.then(data => {
			const resultP = document.getElementById("new-user-result");
			resultP.innerHTML = `New user's id: ${data.id}`;
			addUserRow(data);
			newUserContainer.hidden = true;
		});
};

document.addEventListener("DOMContentLoaded", () => {
	updateUserList();
});

function updateUserList() {
	const tbody = document.getElementById("user-list-body");
	tbody.innerHTML = "";
	fetch(server + "/users").then(res => res.json()).then(data => {
		data.forEach(user => addUserRow(user));
	});
}

function addUserRow(user) {
	const tbody = document.getElementById("user-list-body");
	const { id, name } = user;
	
	let html = "<tr>";
	html += `<td>${id}</td>`;
	html += `<td>${name}</td>`;
	html += `<td><button class="add-exercise-btn" data-id="${id}"><b>+</b></button></td>`
	html += `<td><button class="view-exercises-btn" data-id="${id}"><b>View</b></button></td>`;
	html += `<td><button class="delete-btn" data-id="${id}"><b>-</b></button></td>`
	html += "</tr>";

	tbody.innerHTML += html;
}

const newExerciseContainer = document.getElementById("new-exercise-container");
const newExerciseBtn       = document.getElementById("new-exercise-btn");

const userTable = document.getElementById("user-list-table");
userTable.addEventListener("click", (event) => {
	if (event.target.className === "delete-btn") {
		fetch(server + `/users/${event.target.dataset.id}`, {method: "DELETE"})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					updateUserList();
				}
			});
	} else if (event.target.className === "add-exercise-btn") {
		newExerciseContainer.hidden = false;
		newExerciseBtn.dataset.id = event.target.dataset.id;
	} else if (event.target.className === "view-exercises-btn") {
		const exercisesContainer = document.getElementById("exercises-container");
		exercisesContainer.hidden = false;

		const title = document.querySelector("#exercises-container h2");
		title.innerHTML = `User ${event.target.dataset.id} exercises`;

		fillExerciseList(event.target.dataset.id);
	}
});

const newExerciseDate = document.getElementById("new-exercise-date-input");

newExerciseDate.addEventListener("input", () => newExerciseBtn.disabled = false);
newExerciseBtn.onclick = () => {
	fetch(server + "/exercises", {
		method: "POST",
		headers: {"Content-type": "application/json"},
		body: JSON.stringify({dateString: newExerciseDate.value, userId: newExerciseBtn.dataset.id})
	})
		.then(() => {
			location.reload();
		});
};

function fillExerciseList(userId) {
	const tableBody = document.getElementById("exercises-list-body");

	fetch(server + "/exercises/" + userId)
		.then(res => res.json())
		.then(data => {
			tableBody.innerHTML = "";
			data.forEach((ex) => {
				let html = "<tr>";
				html += `<td>${ex.id}</td>`;
				html += `<td>${new Date(ex.date).toDateString()}</td>`;
				html += "</tr>";
				tableBody.innerHTML += html;
			});
		});
}
