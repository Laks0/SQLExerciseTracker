const server = "http://localhost:8000";

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
	html += `<td><button class="add-exercise-btn" data-id="${id}">+</button></td>`
	html += `<td><button class="delete-btn" data-id="${id}">-</button></td>`
	html += "</tr>";

	tbody.innerHTML += html;
}

const userTable = document.getElementById("user-list-table");
userTable.addEventListener("click", (event) => {
	if (event.target.className === "delete-btn") {
		console.log(event.target)
		fetch(server + `/users/${event.target.dataset.id}`, {method: "DELETE"})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					updateUserList();
				}
			});
	}
});

