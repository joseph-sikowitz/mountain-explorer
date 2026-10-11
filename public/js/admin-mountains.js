import addNewMountainsListener from "./admin-mountains-new.js";

// Get the email and role of the user who logged in
const userEmail = sessionStorage.getItem("userEmail");
const userRole = sessionStorage.getItem("userRole");

// If nobody has logged in, return to the login page
if (!userEmail || userRole !== "admin") {
  window.location.href = "admin-login.html";
}

function addMountainsListener() {
  document.getElementById("edit-mountains").addEventListener("click", () => {
    document.getElementById("edit-mountains").disabled = true;

    document.getElementById("mountain-nav").classList.remove("mountain-hidden");

    document.getElementById("mountain-nav").classList.add("mountain-visible");

    document.getElementById("mountain-nav").innerHTML +=
      `<button id="new-mountains" class="btn btn-primary admin-btn" type="button">New</button>
      <button id="search-mountains" class="btn btn-primary admin-btn" type="button">Search to Edit</button>`;

    addNewMountainsListener();
  });
}

//check if on admin page and only run script if so
const path = window.location.pathname;
var page = path.split("/").pop();
if (page === "admin.html") {
  addMountainsListener();
}
