const form = document.getElementById("signup-form");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");
const message = document.getElementById("form-message");
const birth = document.getElementById("birth-date");
const occupation = document.getElementById("occupation");
const studentSection = document.getElementById("student-section");
const university = document.getElementById("university");
const showPassword = document.getElementById("show-password");
const mobile = document.getElementById("mobile");

const today = new Date();
const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
if (birth) birth.max = localDate;

function checkPasswords() {
  if (password.value !== confirmPassword.value) {
    confirmPassword.setCustomValidity("Passwords do not match.");
  } else {
    confirmPassword.setCustomValidity("");
  }
}

function toggleStudentFields() {
  const isStudent = occupation.value === "student";
  studentSection.classList.toggle("is-hidden", !isStudent);
  university.required = isStudent;
}

function togglePasswordVisibility() {
  const type = showPassword.checked ? "text" : "password";
  password.type = type;
  confirmPassword.type = type;
}

function validatePhone() {
  const cleaned = mobile.value.replace(/\s+/g, "");
  const valid = /^03\d{9}$/.test(cleaned);
  if (!valid) {
    mobile.setCustomValidity("Enter a valid Pakistani mobile number like 03001234567.");
  } else {
    mobile.setCustomValidity("");
  }
}

password.addEventListener("input", checkPasswords);
confirmPassword.addEventListener("input", checkPasswords);
occupation.addEventListener("change", toggleStudentFields);
showPassword.addEventListener("change", togglePasswordVisibility);
mobile.addEventListener("input", validatePhone);

toggleStudentFields();

form.addEventListener("submit", function (event) {
  event.preventDefault();
  checkPasswords();
  validatePhone();

  if (!form.reportValidity()) return;

  message.textContent = "Demo validation successful. Your rider account form is complete. No account was created and no information was saved yet.";
  form.reset();
  toggleStudentFields();
  togglePasswordVisibility();
});
