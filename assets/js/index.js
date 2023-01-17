/*
CREATE VARIABLES
ADD COMMENTS ABOVE EACH ADDED SECTION TO EXPLAIN STEPS
 
 
Step 1 (JS page #1): Get users search term and push to new page
Add event listener to form, save search term, and push to new page
>>>conditional statement - does not match city then modal that notifies invalid entry
>>>>push to next page
save input to local storage
 
Remove?? Step 2 (JS page #2): Capture term and put into the URL
Get parameters from javascript file #1
form.value
 
Step 3: Fetch
Fetch data from Brewery DB API
 
Step 4: Print Results
>>>>Display title, schedule, address, and website

 
Step 5: Save and display favorites (Katie & Carson)
>>>>Pull from local storage
>>>>Make past searches clickable
 
*/

// Creates states in select dropdown input
var states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
var selectEl = document.querySelector('#states');
var searchBtn = document.querySelector('#submit');
var cityName = document.querySelector('#city');
var cityNameTwo = document.querySelector('#city');
var errorModal = document.querySelector('#error-modal');
var breweryStoredArray = [];
var breweryFavoritesArray = [];

for (var i = 0; i < states.length; i++) {
    var option = document.createElement('option')
    option.textContent = states[i]
    selectEl.append(option);
}

/*
if(!cityName) {
  //Trigger modal
}
*/

//window.location.href = "./assets/html/app.html";

searchBtn.addEventListener("click", fetchRequest);


function fetchRequest() {
    fetch('https://api.openbrewerydb.org/breweries?by_city=' + cityName.value + "&by_state=" + selectEl.value)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        
        var isValid = false;
          for (let i = 0; i < data.length; i++) {
    
            // if (data[i].state != selectEl.value){
            //   continue;
            //}
            if (data[i].city.toUpperCase() == cityName.value.toUpperCase()){
              isValid = true;
              //brewery latitude
              var lat = data[i].latitude;
              //brewery longitude
              var long = data[i].longitude;
              //brewery name
              var breweryName = data[i].name;
              //brewery street address
              var address = data[i].street;
              //brewery city name
              var cityN = data[i].city;
              //brewery state
              var state = data[i].state;
              //brewery zip code/postal code
              var zipCode = data[i].postal_code;
              //brewery phone number
              var number = data[i].phone;
              //brewery website url
              var website = data[i].website_url;
              
              //If there is missing information, give value instead of null
              switch (true) {
                case lat === null || long === null:
                  continue;
                case number === null:
                  number = "No number";
                  break;
                case website === null:
                  website = "No website";
                  break;
                case address === null:
                  address = "No address";
                  break;
              }
  
  
              // if (lat == null || long == null){
              //   continue;
              // }
  
              // if (number == null) {
              //   number = "No number";
              // }
  
              // if (website == null){
              //   website = "No website";
              // }
  
              // if (address == null) {
              //   address = "No address";
              // }
  
              console.log(lat, long);
              console.log(breweryName, address, cityN, state, zipCode, number, website);
              
            }
            // saves to local storage
            var information = {
              name: breweryName,
              street: address,
              city: cityN,
              state: state,
              zipCode: zipCode,
              phone: number,
              website: website
            }
  
            breweryStoredArray.push(information);
  
          }
          
          if (!isValid) {
            console.log("this bitch empty yeet");
            errorModal.classList.add("visible");
            errorModal.classList.remove("hidden");
          };
          
          console.log(breweryStoredArray);
          storeBreweries();
        })
  };
          // TODO: The mapping will be populated when the card is made.
          // var map = L.map("map").setView([lat, long], 15);
  
          // L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          //   maxZoom: 19,
          //   attribution:
          //     '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          // }).addTo(map);
  
          // var marker = L.marker([lat, long]).addTo(map);
  
          //create element dynamically within the loop for each container
  function storeBreweries() {
        localStorage.setItem('allBreweries', JSON.stringify(breweryStoredArray));
        JSON.parse(localStorage.getItem('allBreweries'));
        createBreweryHTML();
  }
  
  var cardContainer = document.querySelector('#card-container');
  var breweryName = document.querySelector('.breweryName');
  
  // TODO: Make a function that will be the html for the Modal window. Can call in fetch so we can use the data
  var brewCard = `
    <!-- Cards Container -->
    <div
      id="card-container"
      class="grid w-full grid-cols-1 gap-6 mx-auto lg:grid-cols-3"
    >
      <!-- Card -->
      <div class="p-6 rounded-lg bg-white bg-opacity-75">
        <img
          alt="Brewery map."
          class="object-cover object-center w-full mb-8 lg:h-48 md:h-36 rounded-xl"
          id="map"
          src="../images/map-placeholder.jpg"
        />
        <h2
          class="mb-8 text-xl font-semibold tracking-widest text-stone-700 uppercase breweryName"
        >
          Brewery Name
        </h2>
        <button
          class="self-center mx-2 my-2 px-3 py-2 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-yellow-600 rounded-xl hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          type="submit"
        >
          <span
            role="img"
            aria-label="red heart"
            alt="Favorite this brewery."
            >🤍</span
          >
        </button>
      </div>
      <!-- Card End -->
    `;
  
  function createBreweryHTML() {
    for (var i = 0; i < breweryStoredArray.length; i++) {
      cardContainer.append(brewCard);
      breweryName.value = breweryStoredArray[i].name;
    };
  }
  
  
  //TODO: Create modal notification for isValid=false "No breweries found"
  
  
  
  
  
  
  
  // LOCAL STORAGE STUFF
  
  
  // // 1. Create variables
  // var pastContainer = document.querySelector('#past-container');
  // var citiesSearchedArray = [];
  
  // // 2. Add to the event listener to store brewery search term:
  //   if (cityName) {
  //     var citiesSearchedTemp =
  //     {
  //       city: cityName,
  //     };
  //     citiesSearchedArray.push(citiesSearchedTemp);
  //     storeInput();
  //   }
  
  // // 3. Add the following function to put object in storage and JSON.stringify to convert it as a string
  // function storeInput() {
  //     localStorage.setItem("citiesSearchedArray", JSON.stringify(citiesSearchedArray));
  // }
  // // 4. Add the following function to use JSON.parse() to convert text to JavaScript object
  // function init(){
  //     var citiesSearchedStored = JSON.parse(localStorage.getItem("citiesSearchedArray"));
     
  //     if (citiesSearchedStored !== null){
  //         citiesSearchedArray = citiesSearchedStored;
  //     };
     
  //     printPastSearches();
  // }
     
  // init();
  
  // // 5. Add function to create buttons to print past searches
  // function printPastSearches() {
     
  //     for (var i = 0; i < citiesSearchedArray.length; i++) {
  //         var citySearched= citiesSearchedArray[i];
  
  //         var cityli = document.createElement("li");
  //         cityli.textContent = citySearched;
  //         pastContainer.appendChild(cityli);
  //     };
  // };
  
  // //6. Add event listener to printPastSearches
  
  // pastContainer.addEventListener("click", function(event) {
  //     event.preventDefault();
  //     //Confirm which button was clicked with event.target
  //     printPastSearches();
  // });
  