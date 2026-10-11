function addSubmitNewMountain() {
  document
    .getElementById("mountain-search-form")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(event.target);
      const searchData = Object.fromEntries(formData);

      try {
        const body = {
          name: searchData.name,
          height: Number(searchData.height),
          country: searchData.country,
          typical_weather: searchData.typical_weather,
          latitude: Number(searchData.latitude),
          longitude: Number(searchData.longitude),
          image_url: "img/" + searchData.image_url,
        };

        const response = await fetch("api/mountains", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        const result = await response.json();

        document.getElementById("mountain-search-form").reset();

        if (response.ok) {
          document
            .getElementById("mountain-nav")
            .insertAdjacentHTML("afterend", '<div id="alert-message"></div>');
          const alertMsg = document.getElementById("alert-message");
          alertMsg.className =
            "alert alert-success alert-dismissible fade show mt-2";
          alertMsg.innerHTML +=
            'Added new mountain. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
        } else {
          console.error("POST error for mountains: ", result);
          document
            .getElementById("mountain-nav")
            .insertAdjacentHTML("afterend", '<div id="alert-message"></div>');
          const alertMsg = document.getElementById("alert-message");
          alertMsg.className =
            "alert alert-danger alert-dismissible fade show mt-2";
          alertMsg.innerHTML +=
            'Error adding new mountain. Must complete all fields. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
        }
      } catch (error) {
        console.error("POST error for mountains: ", error);
        document
          .getElementById("mountain-nav")
          .insertAdjacentHTML("afterend", '<div id="alert-message"></div>');
        const alertMsg = document.getElementById("alert-message");
        alertMsg.className =
          "alert alert-danger alert-dismissible fade show mt-2";
        alertMsg.innerHTML +=
          'Error adding new mountain. Must complete all fields. <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
      }
    });
}

export default function addNewMountainsListener() {
  document.getElementById("new-mountains").addEventListener("click", () => {
    document.getElementById("new-mountains").disabled = true;
    document
      .getElementById("mountain-panel")
      .classList.remove("mountain-hidden");
    document.getElementById("mountain-panel").classList.add("mountain-visible");
    document.getElementById("mountain-panel").innerHTML +=
      `<form id="mountain-search-form" class="px-4">
            <div class="mb-3">
              <label for="name" class="form-label">
                Mountain Name
              </label>
              <input
                type="text"
                class="form-control"
                id="new-name"
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
                value="800"
                class="form-control"
                id="new-height"
                name="height"
              />
            </div>

            <div class="mb-3">
              <label for="country" class="form-label"> Country </label>
              <input
                type="text"
                class="form-control"
                id="country"
                name="country"
              />
            </div>

            <div class="mb-3">
              <label for="weather" class="form-label"> Typical Weather </label>
              <input
                type="text"
                class="form-control"
                id="new-weather"
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
                step="0.0001"
                class="form-control"
                id="new-latitude"
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
                step="0.0001"
                class="form-control"
                id="new-longitude"
                name="longitude"
              />
            </div>

            <div class="mb-3">
              <label for="image" class="form-label">
                Image File Name
              </label>
              <input
                type="text"
                class="form-control"
                id="new-image"
                name="image_url"
              />
            </div>

            <button type="submit" class="btn btn-primary">Add</button>
          </form>`;

    addSubmitNewMountain();
  });
}
