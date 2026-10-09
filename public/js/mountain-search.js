const searchForm = document.querySelector("#mountain-search-form");
const searchMessage = document.querySelector("#search-message");
const mountainResults = document.querySelector("#mountain-results");

// Handle the form submission to seacrch for mountains
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Get the search values from the form
  const formData = new FormData(searchForm);
  const searchData = Object.fromEntries(formData);

  // Build the URL query parameters
  const searchParams = new URLSearchParams();

  if (searchData.name.trim()) {
    searchParams.append("name", searchData.name.trim());
  }

  if (searchData.country.trim()) {
    searchParams.append("country", searchData.country.trim());
  }

  // Require at least one search field
  if (searchParams.size === 0) {
    searchMessage.textContent = "Please enter a mountain name or country.";
    searchMessage.className = "alert alert-danger mt-3";
    mountainResults.replaceChildren();
    return;
  }

  try {
    const response = await fetch(`/api/mountains?${searchParams.toString()}`);

    const mountains = await response.json();

    if (!response.ok) {
      searchMessage.textContent =
        mountains.error || "Unable to search mountains.";
      searchMessage.className = "alert alert-danger mt-3";
      mountainResults.replaceChildren();
      return;
    }

    displayMountains(mountains);
  } catch (error) {
    console.error("Error searching mountains:", error);

    searchMessage.textContent = "Unable to search mountains.";
    searchMessage.className = "alert alert-danger mt-3";
    mountainResults.replaceChildren();
  }
});

// Function to display the mountains in the results section
function displayMountains(mountains) {
  // Remove results from the previous search
  mountainResults.replaceChildren();

  if (mountains.length === 0) {
    searchMessage.textContent = "No mountains found.";
    searchMessage.className = "alert alert-warning mt-3";
    return;
  }

  searchMessage.textContent = `${mountains.length} mountain(s) found.`;
  searchMessage.className = "alert alert-success mt-3";

  // Create a card for each mountain and display
  for (const mountain of mountains) {
    const card = document.createElement("div");
    card.className = "card mb-4";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    // Mountain image
    if (mountain.image_url) {
      const image = document.createElement("img");
      image.src = mountain.image_url;
      image.alt = mountain.name;
      image.className = "img-fluid mb-3";

      cardBody.append(image);
    }

    // Mountain name
    const name = document.createElement("h2");
    name.className = "card-title";
    name.textContent = mountain.name;

    // Height
    const height = document.createElement("p");
    height.textContent = `Height: ${mountain.height}`;

    // Location
    const location = document.createElement("p");
    location.textContent = `Location: ${mountain.country}`;

    // Trails button
    const trailsLink = document.createElement("a");
    trailsLink.href = `mountain.html?id=${mountain._id}`;
    trailsLink.className = "btn btn-primary";
    trailsLink.textContent = "Trails";

    cardBody.append(name, height, location, trailsLink);
    card.append(cardBody);
    mountainResults.append(card);
  }
}
