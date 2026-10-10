const favoritesMessage = document.querySelector("#favorites-message");
const favoritesResults = document.querySelector("#favorites-results");

const email = sessionStorage.getItem("userEmail");

if (!email) {
  favoritesMessage.textContent = "Please log in before viewing your favorites.";
  favoritesMessage.className = "alert alert-warning";
} else {
  loadFavorites();
}

// Function to load the user's favorites from the server - READ favorites
async function loadFavorites() {
  try {
    const response = await fetch(`/api/favorites/${encodeURIComponent(email)}`);

    const favorites = await response.json();

    if (!response.ok) {
      favoritesMessage.textContent =
        favorites.error || "Unable to load favorites.";
      favoritesMessage.className = "alert alert-danger";
      return;
    }

    await displayFavorites(favorites);
  } catch (error) {
    console.error("Error loading favorites:", error);

    favoritesMessage.textContent = "Unable to load favorites.";
    favoritesMessage.className = "alert alert-danger";
  }
}

// Function to display the user's favorites in the results section
async function displayFavorites(favorites) {
  favoritesResults.replaceChildren();

  if (favorites.length === 0) {
    favoritesMessage.textContent = "You do not have any favorite trails yet.";
    favoritesMessage.className = "alert alert-info";
    return;
  }

  favoritesMessage.textContent = "";

  // User can have multiple favorites, so we need to fetch the trail and mountain data for each favorite.
  for (const favorite of favorites) {
    try {
      // Use the IDs internally to get the actual trail and mountain data.
      const [trailResponse, mountainResponse] = await Promise.all([
        fetch(`/api/trails/${favorite.trail_id}`),
        fetch(`/api/mountains/${favorite.mountain_id}`),
      ]);

      const trail = await trailResponse.json();
      const mountain = await mountainResponse.json();

      if (!trailResponse.ok || !mountainResponse.ok) {
        throw new Error("Unable to load trail or mountain information.");
      }

      const card = document.createElement("div");
      card.className = "card mb-4";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      // Mountain image
      const mountainImage = document.createElement("img");
      mountainImage.src = mountain.image_url;
      mountainImage.alt = mountain.name;
      mountainImage.className = "img-fluid mb-3";

      // Mountain name
      const mountainName = document.createElement("h2");

      const mountainLink = document.createElement("a");
      mountainLink.href = `mountain.html?id=${favorite.mountain_id}`;
      mountainLink.textContent = mountain.name;

      mountainName.append(mountainLink);

      // Trail name
      const trailName = document.createElement("h3");
      trailName.className = "h5";
      trailName.textContent = trail.name;

      // Status
      const statusLabel = document.createElement("label");
      statusLabel.className = "form-label";
      statusLabel.textContent = "Status";

      // Display update messages for this favorite
      const cardMessage = document.createElement("div");
      cardMessage.className = "mt-3";

      // For status, we will show in dropdown and the options are "Planned" and "Completed" only.
      const statusSelect = document.createElement("select");
      statusSelect.className = "form-select mb-3";

      const plannedOption = document.createElement("option");
      plannedOption.value = "Planned";
      plannedOption.textContent = "Planned";

      const completedOption = document.createElement("option");
      completedOption.value = "Completed";
      completedOption.textContent = "Completed";

      statusSelect.append(plannedOption, completedOption);
      statusSelect.value = favorite.status;

      // Planned hike date
      const dateLabel = document.createElement("label");
      dateLabel.className = "form-label";
      dateLabel.textContent = "Planned Hike Date";

      const plannedDateInput = document.createElement("input");
      plannedDateInput.type = "date";
      plannedDateInput.className = "form-control mb-3";
      plannedDateInput.value = favorite.planned_hike_date || "";

      // Personal notes
      const notesLabel = document.createElement("label");
      notesLabel.className = "form-label";
      notesLabel.textContent = "Personal Notes";

      const notesInput = document.createElement("textarea");
      notesInput.className = "form-control mb-3";
      notesInput.rows = 3;
      notesInput.value = favorite.personal_notes || "";

      // Date added - display only
      const dateAdded = document.createElement("p");
      dateAdded.textContent = `Date Added: ${new Date(favorite.date_added).toLocaleDateString()}`;

      // Save button
      const saveButton = document.createElement("button");
      saveButton.type = "button";
      saveButton.className = "btn btn-primary me-2";
      saveButton.textContent = "Save Changes";

      // Add event listener to save changes
      saveButton.addEventListener("click", async () => {
        await updateFavorite(
          favorite._id,
          statusSelect.value,
          plannedDateInput.value,
          notesInput.value,
          cardMessage
        );
      });

      // Remove button
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "btn btn-danger";
      removeButton.textContent = "Remove";

      removeButton.addEventListener("click", async () => {
        await deleteFavorite(favorite._id);
      });

      cardBody.append(
        mountainImage,
        mountainName,
        trailName,
        cardMessage,
        statusLabel,
        statusSelect,
        dateLabel,
        plannedDateInput,
        notesLabel,
        notesInput,
        dateAdded,
        saveButton,
        removeButton
      );

      card.append(cardBody);
      favoritesResults.append(card);
    } catch (error) {
      console.error("Error displaying favorite:", error);

      favoritesMessage.textContent =
        "Unable to load some favorite information.";
      favoritesMessage.className = "alert alert-danger";
    }
  }
}

// Function to update a favorite - UPDATE favorite
async function updateFavorite(
  favoriteId,
  status,
  plannedHikeDate,
  personalNotes,
  cardMessage
) {
  try {
    const response = await fetch(`/api/favorites/${favoriteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: status,
        planned_hike_date: plannedHikeDate,
        personal_notes: personalNotes,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      cardMessage.textContent = result.error || "Unable to update favorite.";
      cardMessage.className = "alert alert-danger mt-3";
      return;
    }

    cardMessage.textContent = "Favorite updated successfully!";
    cardMessage.className = "alert alert-success mt-3";
  } catch (error) {
    console.error("Error updating favorite:", error);

    cardMessage.textContent = "Unable to update favorite.";
    cardMessage.className = "alert alert-danger mt-3";
  }
}

// Function to delete a favorite - DELETE favorite
async function deleteFavorite(favoriteId) {
  try {
    const response = await fetch(`/api/favorites/${favoriteId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      favoritesMessage.textContent =
        result.error || "Unable to remove favorite.";
      favoritesMessage.className = "alert alert-danger";
      return;
    }

    // Reload the favorites list after deletion
    await loadFavorites();

    favoritesMessage.textContent = "Favorite removed successfully!";
    favoritesMessage.className = "alert alert-success";
  } catch (error) {
    console.error("Error removing favorite:", error);

    favoritesMessage.textContent = "Unable to remove favorite.";
    favoritesMessage.className = "alert alert-danger";
  }
}
