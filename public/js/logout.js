// logout.js share use with other html pages
const userEmail = sessionStorage.getItem("userEmail");

if (!userEmail) {
  window.location.href = "login.html";
}

const logoutLink = document.querySelector("#logout");

logoutLink.addEventListener("click", (event) => {
  event.preventDefault();

  sessionStorage.removeItem("userEmail");
  window.location.href = "index.html";
});
