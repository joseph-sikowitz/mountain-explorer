// Get the email and role of the user who logged in
const userRole = sessionStorage.getItem("userRole");

// If nobody has logged in, return to the login page
if (userRole !== "admin") {
  window.location.replace("admin-login.html");
}

function addTrailsListener() {
  document.getElementById("edit-trails").addEventListener("click", () => {
    document.getElementById("edit-trails").disabled = true;
    document.getElementById("edit-mountains").disabled = false;

    document.getElementById("mountain-nav").classList.remove("mountain-hidden");
    document.getElementById("mountain-nav").classList.add("mountain-visible");

    document
      .getElementById("mountain-panel")
      .classList.remove("mountain-visible");
    document.getElementById("mountain-panel").classList.add("mountain-hidden");
    document
      .getElementById("mountain-results")
      .classList.remove("mountain-visible");
    document
      .getElementById("mountain-results")
      .classList.add("mountain-hidden");
    document.getElementById("mountain-results").innerHTML = "";
    document.getElementById("mountain-panel").innerHTML = "";

    document.getElementById("mountain-nav").innerHTML =
      `<button id="new-trails" class="btn btn-primary admin-btn" type="button">New</button>
      <button id="search-trails" class="btn btn-primary admin-btn" type="button">Search to Edit</button>`;
  });
}

//check if on admin page and only run script if so
const path = window.location.pathname;
var page = path.split("/").pop();
if (page === "admin.html") {
  addTrailsListener();
}
