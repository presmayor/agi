const container = document.getElementById('numbers-container');
const placeholdersContainer = document.getElementById('placeholders-container');
let draggedItem = null;
let generatedNumbers = [];
let originalNumbers = [];
let correctAttempts = 0;
let wrongAttempts = 0;
let numberOfDigits = 4; // Default to 4 digits

// Function to generate random numbers between 1 and 20
function generateRandomNumbers(count) {
    const numbers = [];
    while (numbers.length < count) {
        const num = Math.floor(Math.random() * 20) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    return numbers;
}

// Function to clear the placeholders
function clearPlaceholders() {
    document.querySelectorAll('.placeholder').forEach(placeholder => {
        placeholder.innerText = '';   // Clear text inside the placeholder
        placeholder.classList.remove('filled');  // Reset styling
    });
}

// Function to render the numbers for dragging
function renderNumbers(numbers = generateRandomNumbers(numberOfDigits)) {
    container.innerHTML = '';  // Clear previous numbers
    clearPlaceholders();  // Clear placeholders
    
    generatedNumbers = [...numbers];  // Save the current numbers for reference
    originalNumbers = [...numbers];   // Save the original state of the numbers

    generatedNumbers.forEach(num => {
        const numberElement = document.createElement('span');
        numberElement.classList.add('number');
        numberElement.setAttribute('draggable', true);
        numberElement.innerText = num;
        container.appendChild(numberElement);

        // Add drag event listeners
        numberElement.addEventListener('dragstart', (event) => {
            draggedItem = event.target;
            setTimeout(() => {
                event.target.style.display = 'none';
            }, 0);
        });

        numberElement.addEventListener('dragend', (event) => {
            setTimeout(() => {
                draggedItem.style.display = 'inline-block';
                draggedItem = null;
            }, 0);
        });
    });

    adjustPlaceholders(numberOfDigits);  // Adjust placeholders based on digits

    document.getElementById('check-order').disabled = false;
}

// Adjust placeholders based on the number of digits
function adjustPlaceholders(count) {
    document.querySelectorAll('.placeholder').forEach((placeholder, index) => {
        placeholder.style.display = index < count ? 'inline-block' : 'none';  // Show/hide placeholders
    });
}

// Add event listeners to placeholders for dropping
document.querySelectorAll('.placeholder').forEach(placeholder => {
    placeholder.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    placeholder.addEventListener('dragenter', (event) => {
        event.preventDefault();
        event.target.classList.add('filled');
    });

    placeholder.addEventListener('dragleave', (event) => {
        event.target.classList.remove('filled');
    });

    placeholder.addEventListener('drop', (event) => {
        event.preventDefault();
        if (event.target.classList.contains('placeholder') && !event.target.innerText) {
            event.target.innerText = draggedItem.innerText;
            draggedItem.parentNode.removeChild(draggedItem);
            event.target.classList.add('filled');
        }
    });
});

// Check the order of numbers in the placeholders
document.getElementById('check-order').addEventListener('click', () => {
    const placedNumbers = Array.from(document.querySelectorAll('.placeholder')).map(el => parseInt(el.innerText)).filter(Boolean);

    if (placedNumbers.length === numberOfDigits) {
        const sortedNumbers = document.getElementById('order-select').value === 'biggest' 
            ? [...placedNumbers].sort((a, b) => b - a)  // Biggest to Smallest
            : [...placedNumbers].sort((a, b) => a - b); // Smallest to Biggest
        
        if (JSON.stringify(placedNumbers) === JSON.stringify(sortedNumbers)) {
            document.getElementById('result').innerText = "Correct! Well done!";
            document.getElementById('result').style = "color:green"
            correctAttempts++; // Increment correct attempts
        } else {
            document.getElementById('result').innerText = "Oops! Try again.";
            document.getElementById('result').style = "color:red"
            wrongAttempts++; // Increment wrong attempts

            // Reset numbers back to the original position
            resetNumbers();
        }
        
        // Update summary display
        updateSummary();
    } else {
        document.getElementById('result').innerText = "Please place all numbers.";
    }
});

// Function to reset numbers back to their original position
function resetNumbers() {
    // Render the original numbers again
    renderNumbers(originalNumbers);
}

// Function to update the summary of correct and wrong attempts
function updateSummary() {
    document.getElementById('correct-attempts').innerText = correctAttempts;
    document.getElementById('wrong-attempts').innerText = wrongAttempts;
}

// Event listener for digit selection change
document.getElementById('digit-select').addEventListener('change', (event) => {
    numberOfDigits = parseInt(event.target.value);
    adjustPlaceholders(numberOfDigits);
});

// Generate new numbers when button is clicked
document.getElementById('generate-numbers').addEventListener('click', () => {
    document.getElementById('result').innerText = "";
    renderNumbers(generateRandomNumbers(numberOfDigits));
});
