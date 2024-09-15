var header = document.getElementById('header');
var scrollBtn = document.getElementById('scroll-btn');


// When the user scrolls down 100px from the top of the document, show the color
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        header.style.backgroundColor = "#071903";
    } else {
        header.style.backgroundColor = "transparent";
    }

    if (document.body.scrollTop > 2000 || document.documentElement.scrollTop > 2000) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
}

// Function to get the ordinal suffix for a number
function getOrdinalSuffix(day) {
    if (day >= 11 && day <= 13) {
        return 'th';
    }
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

// Get the current date
const currentDate = new Date();

// Array of day names and month names
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Format the date
const dayOfWeek = dayNames[currentDate.getDay()];
const dayOfMonth = currentDate.getDate();
const month = monthNames[currentDate.getMonth()];

// Create the formatted string
const formattedDate = `${dayOfWeek}, ${dayOfMonth}${getOrdinalSuffix(dayOfMonth)} ${month}`;

// Display the formatted date
console.log(formattedDate);
