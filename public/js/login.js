const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#login-message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const loginData = Object.fromEntries(formData);

  // Send the login information to the server
  const response = await fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  const result = await response.json();

  // Display login result
  if (response.ok) {
    // Remember which user logged in
    sessionStorage.setItem("userEmail", result.email);
    // Go to the user's profile
    window.location.href = "profile.html";
  } else {
    loginMessage.textContent = result.error;
    loginMessage.className = "alert alert-danger mt-3";
  }
});
