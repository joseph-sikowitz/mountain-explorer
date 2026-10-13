import addMountainList from "./admin-mountain-list.js";

/*
  Function: getTrailRecord()
    Searches the API for a trail record matching the id and creates an
    edit form in HTML if a matching record is found.
  Params:
    id (string) -- id of trail to find
  Return: none
*/
async function getTrailRecord(id) {
  try {
    const response = await fetch(`api/trails/${id}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error("Could not retrieve trail by ID");
    }
    createEditForm(result);
  } catch (error) {
    console.error(error);
  }
}

/*
  Function: createEditForm()
    Builds the HTML form for editing a trail and adds an event listener to
    the add button to submit the changes as a PUT request.
  Params:
    result (JSON) -- data returned from fetching the trail record
  Return: none
*/
function createEditForm(result) {
  document.getElementById("edit-form").innerHTML +=
    `<form id="trail-update-form" class="px-4">
            <div class="mb-3">
              <label for="name" class="form-label">
                Trail Name
              </label>
              <input
                type="text"
                class="form-control"
                id="edit-name"
                name="name"
                value="${result.name}"
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
                value="${result.difficulty}"
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
                id="edit-time-needed-to-hike"
                name="time_needed_to_hike"
                value="${result.time_needed_to_hike}"
              />
            </div>

            <div class="mb-3">
              <label for="equipment_needed" class="form-label"> Equipment Needed </label>
              <input
                type="text"
                class="form-control"
                id="edit-equipment-needed"
                name="equipment_needed"
                value="${result.equipment_needed}"
              />
            </div>

            <div class="mb-3">
              <label for="tent_sites_available" class="form-label">
                Tent Sites Available
              </label>
              <input
                type="checkbox"
                class="form-check"
                id="edit-tent-sites-available"
                name="tent_sites_available"
                value="${result.tent_sites_available}"
              />
            </div>

            <div class="mb-3">
              <label for="mountain_id" class="form-label"> Mountain </label>
              <select class="form-select" id="mountain_id" name="mountain_id">
                <option disabled selected>Select a Mountain</option>
              </select>
            </div>

            <button type="submit" class="btn btn-primary">Update</button>
            <button type="reset" class="btn btn-primary">Reset</button>
          </form>`;

  addMountainList();

  document
    .getElementById("trail-update-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(event.target);
      const editData = Object.fromEntries(formData);

      let tent = false;
      if (editData.tent_sites_available) {
        tent = true;
      }

      try {
        const body = {
          name: editData.name,
          difficulty: Number(editData.difficulty),
          time_needed_to_hike: Number(editData.time_needed_to_hike),
          equipment_needed: editData.equipment_needed,
          tent_sites_available: tent,
          mountain_id: editData.mountain_id,
        };

        console.log(body);

        const id = sessionStorage.getItem("_id");

        console.log(id);

        const response = await fetch(`api/trails/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error("Could not update trail");
        }

        if (document.getElementById("alert-insert")) {
          document.getElementById("alert-insert").remove();
        }

        const alertMsg = document.getElementById("alert-msg");
        alertMsg.innerHTML += '<div id="alert-insert"></div>';
        const alertInsert = document.getElementById("alert-insert");
        alertInsert.className =
          "alert alert-success alert-dismissible fade show mt-2";
        alertInsert.innerHTML =
          'Updated mountain. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
      } catch (error) {
        console.error(error);

        if (document.getElementById("alert-insert")) {
          document.getElementById("alert-insert").remove();
        }

        const alertMsg = document.getElementById("alert-msg");
        alertMsg.innerHTML += '<div id="alert-insert"></div>';
        const alertInsert = document.getElementById("alert-insert");
        alertInsert.className =
          "alert alert-danger alert-dismissible fade show mt-2";
        alertInsert.innerHTML =
          'Error updating mountain. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
      }
    });
}

getTrailRecord(sessionStorage.getItem("_id"));
