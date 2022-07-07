const button = document.getElementById('loginButton');
const username = document.getElementById('usernameInput');
const password = document.getElementById('passwordInput');
const alert = document.getElementById('alert');


button.onclick = function() {
	if (checkInputs()) {
		fetch('/admin', {
			method: 'POST',
			mode: 'same-origin',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: username.value, password: password.value })
		})
		.then(response => response.json())
		.then(data => {
			if(data.success && data.token) {
				document.cookie = `zi-access-token=${data.token}`;
				window.location.href = '/admin/panel'
			}
		})
		.catch(err => {
			console.log(err);
		});
	}
}

username.onkeyup = function() {
	checkInputs()
}
password.onkeyup = function() {
	checkInputs()
}

function checkInputs() {
	alert.classList = 'alert alert-danger d-none';
	if (!username.value || !password.value) {
		alert.innerText = 'The username and password are required.';
		alert.classList = 'alert alert-danger';
		return false
	}
	return true
}