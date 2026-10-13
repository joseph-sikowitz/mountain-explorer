/*
  Function: addNewTrailsListener()
    Adds event listener to the new trails button and creates the HTML form
    that is used to submit a new trail.
  Params: none
  Returns: none
*/
export default function addNewTrailsListener() {
  document.getElementById("new-trails").addEventListener("click", () => {
    const resultsPanel = document.getElementById("mountain-results");
    resultsPanel.innerHTML = "";
    document.getElementById("search-trails").disabled = false;
    document.getElementById("new-trails").disabled = true;
    document.getElementById("mountain-panel").innerHTML = "";
    document.getElementById("mountain-panel").classList.add("mountain-hidden");
    document
      .getElementById("mountain-panel")
      .classList.remove("mountain-hidden");
    document.getElementById("mountain-panel").classList.add("mountain-visible");

    document.getElementById("mountain-panel").innerHTML +=
      `<form id="trail-add-form" class="px-4">
            <div class="mb-3">
              <label for="name" class="form-label">
                Trail Name
              </label>
              <input
                type="text"
                class="form-control"
                id="new-name"
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
                id="new-difficulty"
                name="difficulty"
              />
            </div>

            <div class="mb-3">
              <label for="time_needed_to_hike" class="form-label"> Time Needed to Hike </label>
              <input
                type="number"
                min="1"
                max="24"
                step="1"
                class="form-control"
                id="new-time"
                name="time_needed_to_hike"
              />
            </div>

            <div class="mb-3">
              <label for="equipment_needed" class="form-label"> Equipment Needed </label>
              <input
                type="text"
                class="form-control"
                id="new-equipment"
                name="equipment_needed"
              />
            </div>
 
            <div class="mb-3">
              <label for="tent_sites_available" class="form-check-label">
                Tent Sites Available
              </label>
              <input
                type="checkbox"
                class="form-check"
                id="new-tent"
                name="tent_sites_available"
              />
            </div>

            <div class="mb-3">
              <label for="mountain_id" class="form-label"> Mountain </label>
              <select class="form-select" id="mountain_id" name="mountain_id"
            </div>

            <button type="submit" class="btn btn-primary">Add</button>
            <button type="reset" class="btn btn-primary">Reset</button>
          </form>`;

    addSubmitNewTrail();
    addMountainList();
  });
}

/*
  Function: addSubmitNewTrail()
    Adds event listener to the submit new trail button that performs a POST
    request with the new trail form data.
  Params: none
  Returns: none
*/
function addSubmitNewTrail() {
  document
    .getElementById("trail-add-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(event.target);
      const searchData = Object.fromEntries(formData);

      searchData.tent_sites_available = searchData.tent_sites_available
        ? true
        : false;

      try {
        const body = {
          name: searchData.name,
          difficulty: Number(searchData.difficulty),
          time_needed_to_hike: Number(searchData.time_needed_to_hike),
          equipment_needed: searchData.equipment_needed,
          tent_sites_available: searchData.tent_sites_available,
          mountain_id: searchData.mountain_id,
        };

        const response = await fetch("api/trails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error("Error adding new trail");
        }

        document.getElementById("trail-add-form").reset();

        if (document.getElementById("alert-message")) {
          document.getElementById("alert-message").remove();
        }
        document
          .getElementById("mountain-nav")
          .insertAdjacentHTML("afterend", '<div id="alert-message"></div>');
        const alertMsg = document.getElementById("alert-message");
        alertMsg.className =
          "alert alert-success alert-dismissible fade show mt-2";
        alertMsg.innerHTML +=
          'Added new trail. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
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
          'Error adding new trail. Must complete all fields. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
      }
    });
}

async function getAllMountains() {
  try {
    const mountains = await fetch("api/mountains");

    const mountainsData = await mountains.json();

    if (!mountains.ok) {
      throw new Error("Could not get mountains");
    }

    return mountainsData;
  } catch (error) {
    console.error(error);
  }
}

async function addMountainList() {
  const mountains = await getAllMountains();
  const dropdown = document.getElementById("mountain_id");

  for (let i = 0; i < mountains.length; i++) {
    let mountain = mountains[i];
    let option = document.createElement("option");
    option.textContent = mountain.name;
    option.value = mountain._id;
    dropdown.appendChild(option);
  }
}
