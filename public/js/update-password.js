const userEmail = sessionStorage.getItem("userEmail");
const passwordForm = document.querySelector("#password-form");
const passwordMessage = document.querySelector("#password-message");

// Return to login if no user is logged in
if (!userEmail) {
  window.location.href = "login.html";
}

// Handle the password update form submission
passwordForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(passwordForm);
  const passwordData = Object.fromEntries(formData);

  const response = await fetch(
    `/api/users/${encodeURIComponent(userEmail)}/password`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(passwordData),
    }
  );

  const result = await response.json();

  if (response.ok) {
    passwordMessage.textContent = result.message;
    passwordMessage.className = "alert alert-success mt-3";
    passwordForm.reset();
  } else {
    passwordMessage.textContent = result.error;
    passwordMessage.className = "alert alert-danger mt-3";
  }
});
