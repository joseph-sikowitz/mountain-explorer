/*
  Author: Joseph Sikowitz
  October 2026
*/

/*
  Function: getAllMountains()
    Retrieves a list of all mountains for the dropdown in the trails
    admin area.
  Params: none
  Return: array of mountain JSON
*/

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

/*
  Function: addMountainList()
    Adds the list of all mountains to the dropdown in the trails
    admin area as dropdown options.
  Params: none
  Return: none
*/
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
