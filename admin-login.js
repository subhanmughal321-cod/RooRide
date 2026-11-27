// Sample administrator account. For a frontend demo only.
// Real admin authentication must be implemented on the server.
const admin = {
    email: "admin@example.com",
    password: "Admin123"
};

const form = document.getElementById("adminForm");
const email = document.getElementById("adminEmail");
const password = document.getElementById("adminPassword");
const message = document.getElementById("message");
const toggle = document.getElementById("togglePassword");
const successPanel = document.getElementById("successPanel");
const demoInfo = document.getElementById("demoInfo");

// Show and hide the password.
toggle.addEventListener("click", function () {
    if (password.type === "password") {
        password.type = "text";
        toggle.textContent = "Hide";
        toggle.setAttribute("aria-pressed", "true");
    } else {
        password.type = "password";
        toggle.textContent = "Show";
        toggle.setAttribute("aria-pressed", "false");
    }
});

// Check the sample login credentials.
form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (email.value.trim().toLowerCase() === admin.email &&
        password.value === admin.password) {
        // Remember the demo login for this browser tab only.
        sessionStorage.setItem("roorideAdminDemo", "yes");
        window.location.href = "admin-dashboard.html";
    } else {
        message.textContent = "Incorrect administrator email or password.";
    }
});

// Fill the form using demo credentials.
document.getElementById("demoButton").addEventListener("click", function () {
    email.value = admin.email;
    password.value = admin.password;
    message.textContent = "";
    document.getElementById("loginButton").focus();
});

// Return to the admin login form.
document.getElementById("logoutButton").addEventListener("click", function () {
    successPanel.hidden = true;
    form.hidden = false;
    demoInfo.hidden = false;
    demoInfo.open = false;
    form.reset();
    email.focus();
});

// Enable login only after JavaScript is ready.
document.getElementById("loginButton").disabled = false;
