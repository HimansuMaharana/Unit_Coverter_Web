// Get references to all necessary DOM elements
const inputValue = document.getElementById('input-value');
const inputUnit = document.getElementById('input-unit');
const outputUnit = document.getElementById('output-unit');
const outputValue = document.getElementById('output-value');
const categorySelect = document.getElementById('category');
const clearButton = document.getElementById('clear-button');
const historyButton = document.getElementById('history-button');
const precisionInput = document.getElementById('precision');
const themeToggle = document.getElementById('theme-toggle');

// Load conversion history from localStorage, or initialize an empty array
let history = JSON.parse(localStorage.getItem('conversionHistory')) || [];

// Define conversion rates for different measurement categories
const units = {
    length: {
        meters: 1,
        kilometers: 1000,
        centimeters: 0.01,
        millimeters: 0.001,
        feet: 0.3048,
        inches: 0.0254,
        miles: 1609.34
    },
    weight: {
        grams: 1,
        kilograms: 1000,
        pounds: 453.592,
        ounces: 28.3495
    },
    temperature: {
        celsius: 1,
        fahrenheit: 'convertFahrenheit',
        kelvin: 'convertKelvin'
    },
    volume: {
        liters: 1,
        milliliters: 0.001,
        gallons: 3.78541,
        quarts: 0.946353
    },
    area: {
        squareMeters: 1,
        squareKilometers: 1000000,
        squareFeet: 0.092903,
        squareInches: 0.00064516
    },
    speed: {
        metersPerSecond: 1,
        kilometersPerHour: 0.277778,
        milesPerHour: 0.44704
    },
    time: {
        seconds: 1,
        minutes: 60,
        hours: 3600,
        days: 86400
    }
};

// Function to populate the unit dropdowns based on selected category
function populateUnits() {
    const category = categorySelect.value;
    inputUnit.innerHTML = '';
    outputUnit.innerHTML = '';

    // Populate dropdowns with available units for the selected category
    for (const unit in units[category]) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
        inputUnit.appendChild(option);
        outputUnit.appendChild(option.cloneNode(true));
    }
}

// Function to perform unit conversion
function convert() {
    const inputValueNum = parseFloat(inputValue.value); // Get input value as a number
    const inputUnitValue = inputUnit.value;
    const outputUnitValue = outputUnit.value;
    const category = categorySelect.value;
    const precision = parseInt(precisionInput.value); // Get desired decimal precision

    // Check if input is valid
    if (isNaN(inputValueNum)) {
        outputValue.value = 'Invalid input';
        return;
    }

    let result;
    // Special conversion logic for temperature since it's not a linear conversion
    if (category === 'temperature') {
        if (inputUnitValue === 'celsius') {
            if (outputUnitValue === 'fahrenheit') {
                result = (inputValueNum * 9 / 5) + 32;
            } else if (outputUnitValue === 'kelvin') {
                result = inputValueNum + 273.15;
            } else {
                result = inputValueNum;
            }
        } else if (inputUnitValue === 'fahrenheit') {
            if (outputUnitValue === 'celsius') {
                result = (inputValueNum - 32) * 5 / 9;
            } else if (outputUnitValue === 'kelvin') {
                result = (inputValueNum - 32) * 5 / 9 + 273.15;
            } else {
                result = inputValueNum;
            }
        } else if (inputUnitValue === 'kelvin') {
            if (outputUnitValue === 'celsius') {
                result = inputValueNum - 273.15;
            } else if (outputUnitValue === 'fahrenheit') {
                result = (inputValueNum - 273.15) * 9 / 5 + 32;
            } else {
                result = inputValueNum;
            }
        }
    } else {
        // General conversion formula for other categories
        result = (inputValueNum * units[category][inputUnitValue]) / units[category][outputUnitValue];
    }

    // Display the result rounded to the specified precision
    outputValue.value = result.toFixed(precision);

    // Save conversion result in history
    addToHistory(inputValueNum, inputUnitValue, outputValue.value, outputUnitValue);
}

// Function to store recent conversions in history (up to 5 entries)
function addToHistory(input, inputUnit, output, outputUnit) {
    history.unshift({ input, inputUnit, output, outputUnit }); // Add new conversion to the front
    if (history.length > 5) {
        history.pop(); // Remove oldest entry if history exceeds 5 items
    }
    localStorage.setItem('conversionHistory', JSON.stringify(history)); // Save history to localStorage
}

// Function to clear input and output fields
function clearFields() {
    inputValue.value = '';
    outputValue.value = '';
}

// Function to toggle between light and dark mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

// Event listeners for real-time conversion and interactions
inputValue.addEventListener('input', convert);
inputUnit.addEventListener('change', convert);
outputUnit.addEventListener('change', convert);
categorySelect.addEventListener('change', () => {
    populateUnits(); // Update unit options when category changes
    convert(); // Recalculate conversion
});
clearButton.addEventListener('click', clearFields);
historyButton.addEventListener('click', () => {
    window.location.href = 'history.html'; // Redirect to history page
});
precisionInput.addEventListener('change', convert);
themeToggle.addEventListener('click', toggleTheme);

// Initialize dropdown options and perform an initial conversion
populateUnits();
convert();
