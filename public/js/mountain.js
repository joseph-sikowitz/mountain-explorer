const mountainMessage = document.querySelector("#mountain-message");
const mountainDetails = document.querySelector("#mountain-details");

// Read the mountain ID from the URL
const searchParams = new URLSearchParams(window.location.search);
const mountainId = searchParams.get("id");

if (!mountainId) {
  mountainMessage.textContent = "Mountain ID is missing.";
  mountainMessage.className = "alert alert-danger";
} else {
  loadMountain();
}

// Get one mountain from the server
async function loadMountain() {
  try {
    const response = await fetch(
      `/api/mountains/${encodeURIComponent(mountainId)}`,
    );

    const mountain = await response.json();

    if (!response.ok) {
      mountainMessage.textContent =
        mountain.error || "Unable to load mountain.";
      mountainMessage.className = "alert alert-danger";
      return;
    }

    displayMountain(mountain);
  } catch (error) {
    console.error("Error loading mountain:", error);

    mountainMessage.textContent = "Unable to load mountain.";
    mountainMessage.className = "alert alert-danger";
  }
}

// Display the mountain information
function displayMountain(mountain) {
  mountainDetails.replaceChildren();

  // Mountain name
  const name = document.createElement("h1");
  name.textContent = mountain.name;

  mountainDetails.append(name);

  // Mountain image
  if (mountain.image_url) {
    const image = document.createElement("img");
    image.src = mountain.image_url;
    image.alt = mountain.name;
    image.className = "img-fluid mb-4";

    mountainDetails.append(image);
  }

  // Height
  const height = document.createElement("p");
  height.textContent = `Height: ${mountain.height}`;

  // Location
  const location = document.createElement("p");
  location.textContent = `Location: ${mountain.country}`;

  // Typical weather
  const weather = document.createElement("p");
  weather.textContent = `Typical Weather: ${mountain.typical_weather}`;

  // Latitude
  const latitude = document.createElement("p");
  latitude.textContent = `Latitude: ${mountain.latitude}`;

  // Longitude
  const longitude = document.createElement("p");
  longitude.textContent = `Longitude: ${mountain.longitude}`;

  mountainDetails.append(height, location, weather, latitude, longitude);
}
