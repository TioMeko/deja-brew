var submitBtn2 = document.querySelector('#submit2');

getParam();

// TODO: Make a new fetch function for second page to clear html and repopulate. Might be able
// to manipulate the URL to use the same fetch.

// TODO: Create the functionality of the favorites button with modal. Maybe add to local
// storage and delete/input as users like?

//Second page search
// function newPage2(event) {
//     event.preventDefault;
//     var queryString =
//       "./assets/html/app.html?q=&" + cityNameTwo.value.split(" ").join("_") + "&" + stateNameTwo.value;
//     location.assign(queryString);
//     getParam();
//   }
  
//   submitBtn2.addEventListener("click", newPage2);


submitBtn2.addEventListener('click', anotherFunction);

function anotherFunction() {
    //fetchRequest(cityNameTwo.value, stateName.value)
    console.log("HI")
    newPage();
}