const loginForm = document.querySelector("#admin-login-form");
const loginMessage = document.querySelector("#admin-login-message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const loginData = Object.fromEntries(formData);

  // Send the user input to the api
  const response = await fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  const result = await response.json();

  // Login if an admin, otherwise display error message
  if (response.ok && result.role === "admin") {
    // Remember which user logged in
    sessionStorage.setItem("userEmail", result.email);
    // Go to the admin panel
    window.location.href = "admin.html";
  } else {
    loginMessage.textContent = "Invalid email, password, or role";
    loginMessage.className = "alert alert-danger mt-3";
  }
});
