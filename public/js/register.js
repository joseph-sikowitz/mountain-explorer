// This script populates the state dropdown in the registration form with a list of US states.
const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const stateSelect = document.querySelector("#state");

// Populate the state dropdown with options with for loop
for (const state of states) {
  const option = document.createElement("option");
  option.value = state;
  option.textContent = state;
  stateSelect.append(option);
}

const registerForm = document.querySelector("#register-form");

// Add an event listener to the form submission to prevent the default behavior and log the form data
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(registerForm);
  const user = Object.fromEntries(formData);

  // Send the user data to the server using fetch
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Converts it into JSON text that can be transmitted in the HTTP request
    body: JSON.stringify(user),
  });

  const result = await response.text();

  console.log(result);
});
