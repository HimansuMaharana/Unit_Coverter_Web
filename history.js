// Get references to necessary DOM elements
const historyList = document.getElementById('history-list');
const backButton = document.getElementById('back-button');

// Retrieve conversion history from localStorage, or initialize an empty array if none exists
let history = JSON.parse(localStorage.getItem('conversionHistory')) || [];

// Function to populate the history list with previous conversions
function populateHistory() {
    historyList.innerHTML = ''; // Clear the existing list before adding new items

    // Loop through the stored history and create list items for each conversion
    history.forEach(conversion => {
        const listItem = document.createElement('li');
        listItem.textContent = `${conversion.input} ${conversion.inputUnit} = ${conversion.output} ${conversion.outputUnit}`;
        historyList.appendChild(listItem);
    });
}

// Event listener to navigate back to the main conversion page when the back button is clicked
backButton.addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirect to main page
});

// Populate history list on page load
populateHistory();
