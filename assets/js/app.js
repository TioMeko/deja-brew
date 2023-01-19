var submitBtn2 = document.querySelector('#submit2');

// Calls getParam from index.js to get parameters from URL
getParam();

// Triggers a new fetch from a search on the second page
submitBtn2.addEventListener('click', secondPageSearch);

// Calls newPage from index.js to create new query
function secondPageSearch() {
    newPage();
};