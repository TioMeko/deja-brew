/*
CREATE VARIABLES
ADD COMMENTS ABOVE EACH ADDED SECTION TO EXPLAIN STEPS
 
 
Step 1 (JS page #1): Get users search term and push to new page
Add event listener to form, save search term, and push to new page
>prevent default
>conditional statement - does not match city then modal that notifies invalid entry
>push to next page
>save input to local storage
 
Step 2 (JS page #2): Capture term and put into the URL
Get parameters from javascript file #1
>form.value
 
Step 3: Fetch
Fetch data from Brewery DB API
Fetch data from Open Food Facts API
 
Step 4: Print Results
Nearby breweries
>Display title, schedule, address, and website
 
Random fun fact
>Random number generator and loop over array
>Modal
 
Display past searches
>Pull from local storage
>Make past searches clickable
 
 
Cool Additions:
Compare current day/time to brewery schedule
Suggested cities (dropdown)
*/

/*var citySearch = document.getElementById("city");
 
 
 
function fetchRequest(cityName){
fetch('https://api.openbrewerydb.org/breweries?by_city=' + cityName + '&per_page=6')
   .then(function (response) {
       return response.json();
   })
   .then(function (data) {
       //brewery name
       //street address
       //state
       //country
       //zip code
       //phone number
       //website
       console.log(data);
   });
}
 
citySearch.addEventListener("submit", function(event){
   event.preventDefault();
   var cityName = citySearch.value;
   console.log(cityName);
   fetchRequest(cityName);
   console.log("submited");
})*/

function fetchRequest() {
  fetch("https://api.openbrewerydb.org/breweries?by_city=chicago&per_page=6")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      for (let i = 0; i < data.length; i++) {
        //brewery latitude
        var lat = data[i].latitude;
        //brewery longitude
        var long = data[i].longitude;
        //brewery name
        var name = data[i].name;
        //brewery street address
        var address = data[i].street;
        //brewery state
        var state = data[i].state;
        //brewery country
        var country = data[i].country;
        //brewery zip code/postal code
        var zipCode = data[i].postal_code;
        //brewery phone number
        var number = data[i].phone;
        //brewery website url
        var website = data[i].website_url;

        if (lat == null || long == null){
          continue;
        }
        
        console.log(lat, long);
        console.log(name, address, state, country, zipCode, number, website);

        // var map = L.map("map").setView([lat, long], 15);

        // L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        //   maxZoom: 19,
        //   attribution:
        //     '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        // }).addTo(map);

        // var marker = L.marker([lat, long]).addTo(map);

        //create element dynamically within the loop for each container
      }
    });
}

// Make a function that will be the html for the Modal window. Can call in fetch so we can use the data
function createBreweryHTML(brewery){
  return `
    <div class="col-3">
      <div class="card">
        <div class="card-body">
          <h3>${brewery.name}</h3>
          <p class="card-text">${brewery.address}</p>
        </div>
            <p class="modal-content">
              ${brewery.number}
            </p>
            <button class="modal-close modal-exit">X</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

fetchRequest();
