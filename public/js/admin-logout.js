const userRole = sessionStorage.getItem("userRole");

if (!userRole) {
  window.location.href = "login.html";
}

const logoutLink = document.querySelector("#admin-logout");

logoutLink.addEventListener("click", (event) => {
  event.preventDefault();

  sessionStorage.clear();
  window.location.href = "index.html";
});
