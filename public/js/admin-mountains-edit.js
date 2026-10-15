/*
  Author: Joseph Sikowitz
  October 2026
*/

/*
  Function: deleteMountain()
    Sends DELETE request using a mountain ID.
  Params:
    mountainId (string) -- Mongo mountain ID
  Return: none
*/
async function deleteMountain(mountainId) {
  try {
    const response = await fetch(`api/mountains/${mountainId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error deleting mountain: ", mountainId);
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
      'Mountain deleted. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
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
      'Mountain deletion error. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
    document.getElementById("mountain-results").innerHTML = "";
    window.scrollTo(0, 0);
  }
}

/*
  Function: editMountain()
    Stores the mountain ID as a session variable and redirects to
    the edit page.
  Params:
    mountainId (string) -- Mongo mountain ID
  Return: none
*/
async function editMountain(mountainId) {
  sessionStorage.setItem("_id", mountainId);
  window.location.href = "admin-edit-mountain.html";
}

/*
  Function: displayMountains()
    Builds a card grid from the results of a mountain search.
  Params:
    mountains (array) -- list of mountains to display
  Return: none
*/
function displayMountains(mountains) {
  const resultsPanel = document.getElementById("mountain-results");
  resultsPanel.innerHTML = "";
  resultsPanel.classList.remove("mountain-hidden");
  resultsPanel.classList.add("mountain-visible");

  if (mountains.length < 1) {
    document
      .getElementById("mountain-nav")
      .insertAdjacentHTML("afterend", '<div id="alert-message"></div>');
    const alertMsg = document.getElementById("alert-message");
    alertMsg.className = "alert alert-danger alert-dismissible fade show mt-2";
    alertMsg.innerHTML +=
      'No mountains found. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
  }

  mountains.forEach(() => {
    resultsPanel.innerHTML = mountains
      .map(
        (mountain) => `
    <div class="col">
      <div class="card">
        <img src="${mountain.image_url}" class="card-img-top results-img" alt="${mountain.name}">
        <div class="card-body text-center mb-2">
          <h3 class="card-title">${mountain.name}</h3>
          <p class="card-text">Height: ${mountain.height} feet</p>
          <p class="card-text">Country: ${mountain.country}</p>
          <button data-id="${mountain._id}" data-action="edit" class="btn btn-primary admin-btn" type="button">Edit</button>
          <button data-id="${mountain._id}" data-action="delete" class="btn btn-primary admin-btn" type="button">Delete</button>
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
      deleteMountain(id);
    } else if (action === "edit") {
      editMountain(id);
    }
  });
}

/*
  Function: addSearchNewMountain()
    Adds an event listener to the edit mountain button that toggles between 
    new and edit buttons in the selection panel, performs a search to find
    the mountains to edit, and displays them.
  Params: none
  Return: none
*/
function addSearchNewMountain() {
  document
    .getElementById("mountain-edit-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const searchForm = document.getElementById("mountain-edit-form");

      // Get the search values from the form
      const formData = new FormData(searchForm);
      const searchData = Object.fromEntries(formData);

      // Build the URL query parameters
      const searchParams = new URLSearchParams();

      if (searchData.name.trim()) {
        searchParams.append("name", searchData.name.trim());
      }

      if (searchData.height.trim()) {
        searchParams.append("height", Number(searchData.height));
      }

      if (searchData.country.trim()) {
        searchParams.append("country", searchData.country.trim());
      }

      if (searchData.typical_weather.trim()) {
        searchParams.append(
          "typical_weather",
          searchData.typical_weather.trim()
        );
      }

      if (searchData.latitude.trim()) {
        searchParams.append("latitude", Number(searchData.latitude));
      }

      if (searchData.longitude.trim()) {
        searchParams.append("longitude", Number(searchData.longitude));
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
        const response = await fetch(
          `api/mountains?${searchParams.toString()}`
        );

        const mountains = await response.json();

        if (mountains.length < 1) {
          throw new Error("No mountains found");
        }

        if (document.getElementById("alert-message")) {
          document.getElementById("alert-message").remove();
        }

        displayMountains(mountains);
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
          'No mountains found. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
      }
    });
}

/*
  Function: addEditMountainsListener()
    Adds an event listener to the edit mountain button that toggles between 
    new and edit buttons in the selection panel, and creates the HTML form 
    to edit a mountain.
  Params: none
  Return: none
*/
export default function addEditMountainsListener() {
  document.getElementById("search-mountains").addEventListener("click", () => {
    document.getElementById("mountain-panel").innerHTML = "";
    document.getElementById("mountain-panel").classList.add("mountain-hidden");
    document.getElementById("new-mountains").disabled = false;
    document.getElementById("search-mountains").disabled = true;
    document
      .getElementById("mountain-panel")
      .classList.remove("mountain-hidden");
    document.getElementById("mountain-panel").classList.add("mountain-visible");

    document.getElementById("mountain-panel").innerHTML +=
      `<form id="mountain-edit-form" class="px-4">
            <div class="mb-3">
              <label for="name" class="form-label">
                Mountain Name
              </label>
              <input
                type="text"
                class="form-control"
                id="edit-name"
                name="name"
              />
            </div>

            <div class="mb-3">
              <label for="height" class="form-label">
                Height
              </label>
              <input
                type="number"
                min="800"
                max="28000"
                step="1"
                class="form-control"
                id="edit-height"
                name="height"
              />
            </div>

            <div class="mb-3">
              <label for="country" class="form-label"> Country </label>
              <input
                type="text"
                class="form-control"
                id="edit-country"
                name="country"
              />
            </div>

            <div class="mb-3">
              <label for="weather" class="form-label"> Typical Weather </label>
              <input
                type="text"
                class="form-control"
                id="edit-weather"
                name="typical_weather"
              />
            </div>

            <div class="mb-3">
              <label for="latitude" class="form-label">
                Latitude
              </label>
              <input
                type="number"
                min="-90"
                max="90"
                step="0.000000001"
                class="form-control"
                id="edit-latitude"
                name="latitude"
              />
            </div>

            <div class="mb-3">
              <label for="longitude" class="form-label">
                Longitude
              </label>
              <input
                type="number"
                min="-180"
                max="180"
                step="0.000000001"
                class="form-control"
                id="edit-longitude"
                name="longitude"
              />
            </div>

            <button type="submit" class="btn btn-primary">Search</button>
            <button type="reset" class="btn btn-primary">Reset</button>
          </form>`;

    addSearchNewMountain();
  });
}
