/*
  Function: getMountainRecord()
    Searches the API for a mountain record matching the id and creates an
    edit form in HTML if a matching record is found.
  Params:
    id (string) -- id of mountain to find
  Return: none
*/
async function getMountainRecord(id) {
  try {
    const response = await fetch(`api/mountains/${id}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error("Could not retrieve mountain by ID");
    }
    createEditForm(result);
  } catch (error) {
    console.error(error);
  }
}

/*
  Function: createEditForm()
    Builds the HTML form for editing a mountain and adds an event listener to
    the add button to submit the changes as a PUT request.
  Params:
    result (JSON) -- data returned from fetching the mountain record
  Return: none
*/
function createEditForm(result) {
  document.getElementById("edit-form").innerHTML +=
    `<form id="mountain-update-form" class="px-4">
            <div class="mb-3">
              <label for="name" class="form-label">
                Mountain Name
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
                value="${result.height}"
              />
            </div>

            <div class="mb-3">
              <label for="country" class="form-label"> Country </label>
              <input
                type="text"
                class="form-control"
                id="edit-country"
                name="country"
                value="${result.country}"
              />
            </div>

            <div class="mb-3">
              <label for="weather" class="form-label"> Typical Weather </label>
              <input
                type="text"
                class="form-control"
                id="edit-weather"
                name="typical_weather"
                value="${result.typical_weather}"
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
                value="${result.latitude}"
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
                value="${result.longitude}"
              />
            </div>

            <div class="mb-3">
              <label for="longitude" class="form-label">
                Image URL
              </label>
              <input
                type="text"
                class="form-control"
                id="edit-image"
                name="image_url"
                value="${result.image_url}"
              />
            </div>

            <button type="submit" class="btn btn-primary">Update</button>
            <button type="reset" class="btn btn-primary">Reset</button>
          </form>`;

  document
    .getElementById("mountain-update-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(event.target);
      const editData = Object.fromEntries(formData);

      try {
        const body = {
          name: editData.name,
          height: Number(editData.height),
          country: editData.country,
          typical_weather: editData.typical_weather,
          latitude: Number(editData.latitude),
          longitude: Number(editData.longitude),
          image_url: editData.image_url,
        };

        const id = sessionStorage.getItem("_id");

        const response = await fetch(`api/mountains/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error("Could not update mountain");
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

getMountainRecord(sessionStorage.getItem("_id"));
