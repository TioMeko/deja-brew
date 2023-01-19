var submitBtn2 = document.querySelector('#submit2');

getParam();


// Triggers a new fetch from a search on the second page
submitBtn2.addEventListener('click', secondPageSearch);

function secondPageSearch() {
    newPage();
};