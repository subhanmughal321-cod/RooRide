// Sample accounts for FRONTEND DEMO ONLY.
// In the real system, the backend will check a hashed password and account role.
const users = [
    { email: "rider@example.com", password: "RooRide123", role: "Rider" },
    { email: "driver@example.com", password: "RooRide123", role: "Driver" }
];

const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");
const successPanel = document.getElementById("successPanel");
const toggle = document.getElementById("togglePassword");

// Show or hide the password.
toggle.addEventListener("click", function () {
    const isHidden = password.type === "password";
    password.type = isHidden ? "text" : "password";
    toggle.textContent = isHidden ? "Hide" : "Show";
    toggle.setAttribute("aria-pressed", String(isHidden));
});

// Check the email and password and identify the account role.
form.addEventListener("submit", function (event) {
    event.preventDefault();
    message.textContent = "";
    let user = null;

    for (let i = 0; i < users.length; i++) {
        if (users[i].email === email.value.trim().toLowerCase() &&
            users[i].password === password.value) {
            user = users[i];
            break;
        }
    }

    if (user === null) {
        message.textContent = "Incorrect email or password. Please try again.";
    } else {
        form.reset();
        password.type = "password";
        toggle.textContent = "Show";
        toggle.setAttribute("aria-pressed", "false");
        form.hidden = true;
        document.getElementById("welcomeMessage").textContent = "Welcome, " + user.role + "!";
        successPanel.hidden = false;
        document.getElementById("logoutButton").focus();
        // Later: connect the backend and redirect using the verified role.
    }
});

// Demo buttons fill the form; the user still clicks Log in.
function fillDemo(index) {
    if (!successPanel.hidden) return;
    email.value = users[index].email;
    password.value = users[index].password;
    message.textContent = "";
    document.getElementById("loginButton").focus();
}

document.getElementById("riderDemo").addEventListener("click", function () {
    fillDemo(0);
});

document.getElementById("driverDemo").addEventListener("click", function () {
    fillDemo(1);
});

// Return to the login form.
document.getElementById("logoutButton").addEventListener("click", function () {
    successPanel.hidden = true;
    form.hidden = false;
    form.reset();
    email.focus();
});

// Enable only after the demo submit handler is ready.
document.getElementById("loginButton").disabled = false;
