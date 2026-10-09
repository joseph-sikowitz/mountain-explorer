// Get the email of the user who logged in
const userEmail = sessionStorage.getItem("userEmail");
const profileMessage = document.querySelector("#profile-message");

// If nobody has logged in, return to the login page
if (!userEmail) {
  window.location.href = "login.html";
} else {
  loadProfile();
}

// Get the user's profile from the server
async function loadProfile() {
  try {
    // Use encodeURIComponent to safely include the email in the URL
    const response = await fetch(`/api/users/${encodeURIComponent(userEmail)}`);

    const user = await response.json();

    if (response.ok) {
      document.querySelector("#first-name").textContent = user.firstName;
      document.querySelector("#last-name").textContent = user.lastName;
      document.querySelector("#email").textContent = user.email;
      document.querySelector("#country").textContent = user.country;
    } else {
      profileMessage.textContent = user.error;
      profileMessage.className = "alert alert-danger";
    }
  } catch (error) {
    console.error("Error loading profile:", error);

    profileMessage.textContent = "Unable to load profile";
    profileMessage.className = "alert alert-danger";
  }
}

// Delete account
const deleteAccountButton = document.querySelector("#delete-account");
const deleteMessage = document.querySelector("#delete-message");

deleteAccountButton.addEventListener("click", async () => {
  const confirmed = window.confirm(
    "Are you sure you want to delete your account?"
  );

  if (!confirmed) {
    return;
  }

  const response = await fetch(`/api/users/${encodeURIComponent(userEmail)}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (response.ok) {
    // Remove the deleted user's login information
    sessionStorage.removeItem("userEmail");

    // Return to the home page
    window.location.href = "index.html";
  } else {
    deleteMessage.textContent = result.error;
    deleteMessage.className = "alert alert-danger mt-3";
  }
});
