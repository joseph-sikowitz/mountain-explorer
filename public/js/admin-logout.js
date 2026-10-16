/*
  Author: Joseph Sikowitz
  October 2026
*/

const userRole = sessionStorage.getItem("userRole");

if (userRole !== "admin") {
  window.location.href = "admin-login.html";
}

const logoutLink = document.querySelector("#admin-logout");

logoutLink.addEventListener("click", (event) => {
  event.preventDefault();

  sessionStorage.clear();
  window.location.href = "index.html";
});
