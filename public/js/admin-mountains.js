import addNewMountainsListener from "./admin-mountains-new.js";
import addEditMountainsListener from "./admin-mountains-edit.js";

// Get the email and role of the user who logged in
const userRole = sessionStorage.getItem("userRole");

// If nobody has logged in, return to the login page
if (userRole !== "admin") {
  window.location.replace("admin-login.html");
}

/*
  Function: addMountainsListener()
    Adds listener to top level mountains button in admin area so that
    it toggles between the trails and mountains buttons, and creates
    the panel for the user to choose to add a new mountain or search and
    edit an existing one.
  Params: none
  Return: none
*/
function addMountainsListener() {
  document.getElementById("edit-mountains").addEventListener("click", () => {
    document.getElementById("edit-mountains").disabled = true;
    document.getElementById("edit-trails").disabled = false;

    document.getElementById("mountain-nav").classList.remove("mountain-hidden");
    document.getElementById("mountain-nav").classList.add("mountain-visible");

    document
      .getElementById("mountain-panel")
      .classList.remove("mountain-visible");
    document.getElementById("mountain-panel").classList.add("mountain-hidden");
    document
      .getElementById("mountain-results")
      .classList.remove("mountain-visible");
    document.getElementById("mountain-panel").classList.add("mountain-hidden");
    document.getElementById("mountain-results").innerHTML = "";
    document.getElementById("mountain-panel").innerHTML = "";

    document.getElementById("mountain-nav").innerHTML =
      `<button id="new-mountains" class="btn btn-primary admin-btn" type="button">New</button>
      <button id="search-mountains" class="btn btn-primary admin-btn" type="button">Search to Edit</button>`;

    addNewMountainsListener();
    addEditMountainsListener();
  });
}

//check if on admin page and only run script if so
const path = window.location.pathname;
var page = path.split("/").pop();
if (page === "admin.html") {
  addMountainsListener();
}
