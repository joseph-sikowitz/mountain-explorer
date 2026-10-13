/*
  Function: deleteTrail()
    Sends DELETE request using a trail ID.
  Params:
    trailId (string) -- Mongo trail ID
  Return: none
*/
async function deleteTrail(trailId) {
  try {
    const response = await fetch(`api/trails/${trailId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error deleting trail: ", trailId);
    }

    if (document.getElementById("alert-message")) {
      document.getElementById("alert-message").remove();
    }

    document
      .getElementById("mountain-nav")
      .insertAdjacentHTML("afterend", '<div id="alert-message"></div>');
    const alertMsg = document.getElementById("alert-message");
    alertMsg.className = "alert alert-success alert-dismissible fade show mt-2";
    alertMsg.innerHTML +=
      'Trail deleted. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
    document.getElementById("mountain-results").innerHTML = "";
    window.scrollTo(0, 0);
  } catch (error) {
    console.error(error);
    if (document.getElementById("alert-message")) {
      document.getElementById("alert-message").remove();
    }
    document
      .getElementById("mountain-nav")
      .insertAdjacentHTML("afterend", '<div id="alert-message"></div>');
    const alertMsg = document.getElementById("alert-message");
    alertMsg.className = "alert alert-danger alert-dismissible fade show mt-2";
    alertMsg.innerHTML +=
      'Trail deletion error. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
    document.getElementById("mountain-results").innerHTML = "";
    window.scrollTo(0, 0);
  }
}

/*
  Function: editTrail()
    Stores the trail ID as a session variable and redirects to
    the edit page.
  Params:
    trailId (string) -- Mongo trail ID
  Return: none
*/
async function editTrail(trailId) {
  sessionStorage.setItem("_id", trailId);
  window.location.href = "admin-edit-trail.html";
}

/*
  Function: displayTrails()
    Builds a card grid from the results of a trails search.
  Params:
    trails (array) -- list of trails to display
  Return: none
*/
function displayTrails(trails) {
  const resultsPanel = document.getElementById("mountain-results");
  resultsPanel.innerHTML = "";
  resultsPanel.classList.remove("mountain-hidden");
  resultsPanel.classList.add("mountain-visible");

  if (trails.length < 1) {
    document
      .getElementById("mountain-nav")
      .insertAdjacentHTML("afterend", '<div id="alert-message"></div>');
    const alertMsg = document.getElementById("alert-message");
    alertMsg.className = "alert alert-danger alert-dismissible fade show mt-2";
    alertMsg.innerHTML +=
      'No trails found. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
  }

  trails.forEach(() => {
    resultsPanel.innerHTML = trails
      .map(
        (trail) => `
    <div class="col">
      <div class="card">
        <div class="card-body text-center mb-2">
          <h3 class="card-title">${trail.name}</h3>
          <p class="card-text">Difficulty: ${trail.difficulty}</p>
          <p class="card-text">Time Required: ${trail.time_needed_to_hike}</p>
          <button data-id="${trail._id}" data-action="edit" class="btn btn-primary admin-btn" type="button">Edit</button>
          <button data-id="${trail._id}" data-action="delete" class="btn btn-primary admin-btn" type="button">Delete</button>
        </div>
      </div>
    </div>`
      )
      .join("");
  });

  resultsPanel.scrollIntoView();

  resultsPanel.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const { action, id } = button.dataset;

    if (action === "delete") {
      deleteTrail(id);
    } else if (action === "edit") {
      editTrail(id);
    }
  });
}

/*
  Function: addSearchNewTrail()
    Adds an event listener to the edit trail button that toggles between 
    new and edit buttons in the selection panel, performs a search to find
    the trails to edit, and displays them.
  Params: none
  Return: none
*/
function addSearchNewTrail() {
  document
    .getElementById("trail-edit-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const searchForm = document.getElementById("trail-edit-form");

      // Get the search values from the form
      const formData = new FormData(searchForm);
      const searchData = Object.fromEntries(formData);

      // Build the URL query parameters
      const searchParams = new URLSearchParams();

      if (searchData.name.trim()) {
        searchParams.append("name", searchData.name.trim());
      }

      if (searchData.difficulty.trim()) {
        searchParams.append("difficulty", Number(searchData.difficulty));
      }

      if (searchData.time_needed_to_hike.trim()) {
        searchParams.append(
          "time_needed_to_hike",
          searchData.time_needed_to_hike.trim()
        );
      }

      if (searchData.equipment_needed.trim()) {
        searchParams.append(
          "equipment_needed",
          searchData.equipment_needed.trim()
        );
      }

      // Require at least one search field
      if (searchParams.size === 0) {
        if (document.getElementById("alert-message")) {
          document.getElementById("alert-message").remove();
        }
        document
          .getElementById("mountain-nav")
          .insertAdjacentHTML("afterend", '<div id="alert-message"></div>');
        const alertMsg = document.getElementById("alert-message");
        alertMsg.className =
          "alert alert-danger alert-dismissible fade show mt-2";
        alertMsg.innerHTML +=
          'Must include at least one field in search.<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
        return;
      }

      searchParams.append("limit", 25);

      try {
        const response = await fetch(`api/trails?${searchParams.toString()}`);

        const trails = await response.json();

        if (trails.length < 1) {
          throw new Error("No trails found");
        }

        if (document.getElementById("alert-message")) {
          document.getElementById("alert-message").remove();
        }

        displayTrails(trails);
      } catch (error) {
        console.error(error);
        if (document.getElementById("alert-message")) {
          document.getElementById("alert-message").remove();
        }
        document
          .getElementById("mountain-nav")
          .insertAdjacentHTML("afterend", '<div id="alert-message"></div>');
        const alertMsg = document.getElementById("alert-message");
        alertMsg.className =
          "alert alert-danger alert-dismissible fade show mt-2";
        alertMsg.innerHTML +=
          'No trails found. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
      }
    });
}

/*
  Function: addEditTrailsListener()
    Adds an event listener to the edit trails button that toggles between 
    new and edit buttons in the selection panel, and creates the HTML form 
    to search for a trail to edit.
  Params: none
  Return: none
*/
export default function addEditTrailsListener() {
  document.getElementById("search-trails").addEventListener("click", () => {
    document.getElementById("mountain-panel").innerHTML = "";
    document.getElementById("mountain-panel").classList.add("mountain-hidden");
    document.getElementById("new-trails").disabled = false;
    document.getElementById("search-trails").disabled = true;
    document
      .getElementById("mountain-panel")
      .classList.remove("mountain-hidden");
    document.getElementById("mountain-panel").classList.add("mountain-visible");

    document.getElementById("mountain-panel").innerHTML +=
      `<form id="trail-edit-form" class="px-4">
            <div class="mb-3">
              <label for="name" class="form-label">
                Trail Name
              </label>
              <input
                type="text"
                class="form-control"
                id="edit-name"
                name="name"
              />
            </div>

            <div class="mb-3">
              <label for="difficulty" class="form-label">
                Difficulty
              </label>
              <input
                type="number"
                min="1"
                max="10"
                step="1"
                class="form-control"
                id="edit-difficulty"
                name="difficulty"
              />
            </div>

            <div class="mb-3">
              <label for="time_needed_to_hike" class="form-label">
                Time Needed to Hike
              </label>
              <input
                type="number"
                min="1"
                max="24"
                step="1"
                class="form-control"
                id="edit-time-needed-to-hike"
                name="time_needed_to_hike"
              />
            </div>

            <div class="mb-3">
              <label for="equipment_needed" class="form-label"> Equipment Needed </label>
              <input
                type="text"
                class="form-control"
                id="edit-equipment-needed"
                name="equipment_needed"
              />
            </div>

            <button type="submit" class="btn btn-primary">Search</button>
            <button type="reset" class="btn btn-primary">Reset</button>
          </form>`;

    addSearchNewTrail();
  });
}
