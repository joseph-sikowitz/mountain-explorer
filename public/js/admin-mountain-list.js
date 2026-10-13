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

export default async function addMountainList() {
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
