const mountainMessage = document.querySelector("#mountain-message");
const mountainDetails = document.querySelector("#mountain-details");
const trailMessage = document.querySelector("#trail-message");
const trailResults = document.querySelector("#trail-results");

// Read the mountain ID from the URL
const searchParams = new URLSearchParams(window.location.search);
const mountainId = searchParams.get("id");

if (!mountainId) {
  mountainMessage.textContent = "Mountain ID is missing.";
  mountainMessage.className = "alert alert-danger";
} else {
  loadMountain();
  loadTrails();
}

// Get one mountain from the server
async function loadMountain() {
  try {
    const response = await fetch(
      `/api/mountains/${encodeURIComponent(mountainId)}`
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

async function loadTrails() {
  try {
    const response = await fetch(
      `/api/trails?mountain_id=${encodeURIComponent(mountainId)}`
    );

    const trails = await response.json();

    if (!response.ok) {
      trailMessage.textContent = trails.error || "Unable to load trails.";
      trailMessage.className = "alert alert-danger";
      return;
    }

    displayTrails(trails);
  } catch (error) {
    console.error("Error loading trails:", error);

    trailMessage.textContent = "Unable to load trails.";
    trailMessage.className = "alert alert-danger";
  }
}

// Display the trails for the mountain
function displayTrails(trails) {
  trailResults.replaceChildren();

  if (trails.length === 0) {
    trailMessage.textContent = "No trails are available for this mountain.";
    trailMessage.className = "alert alert-info";
    return;
  }

  trailMessage.textContent = "";

  for (const trail of trails) {
    const trailCard = document.createElement("div");
    trailCard.className = "card mb-3";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const name = document.createElement("h3");
    name.className = "card-title";
    name.textContent = trail.name;

    const difficulty = document.createElement("p");
    difficulty.textContent = `Difficulty: ${trail.difficulty}`;

    const time = document.createElement("p");
    time.textContent = `Time Needed to Hike: ${trail.time_needed_to_hike}`;

    const equipment = document.createElement("p");
    equipment.textContent = `Equipment Needed: ${trail.equipment_needed}`;

    const tentSites = document.createElement("p");
    tentSites.textContent = `Tent Sites Available: ${trail.tent_sites_available}`;

    const favoriteButton = document.createElement("button");
    favoriteButton.type = "button";
    favoriteButton.className = "btn btn-primary";
    favoriteButton.textContent = "Add to Favorites";

    favoriteButton.addEventListener("click", async () => {
      await addToFavorites(trail);
    });

    cardBody.append(
      name,
      difficulty,
      time,
      equipment,
      tentSites,
      favoriteButton
    );

    trailCard.append(cardBody);
    trailResults.append(trailCard);
  }
}

async function addToFavorites(trail) {
  const email = sessionStorage.getItem("userEmail");

  if (!email) {
    trailMessage.textContent = "Please log in before adding a favorite.";
    trailMessage.className = "alert alert-warning";
    return;
  }

  try {
    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        trail_id: trail._id,
        mountain_id: mountainId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      trailMessage.textContent =
        result.error || "Unable to add trail to favorites.";
      trailMessage.className = "alert alert-danger";
      return;
    }

    trailMessage.textContent = "Trail added to favorites!";
    trailMessage.className = "alert alert-success";
  } catch (error) {
    console.error("Error adding favorite:", error);

    trailMessage.textContent = "Unable to add trail to favorites.";
    trailMessage.className = "alert alert-danger";
  }
}
