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
var states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",];
var stateName = document.querySelector("#states");
var submitBtn = document.querySelector("#submit");
var cityName = document.querySelector("#city");
var cardContainer = document.querySelector("#card-container");
var errorModal = document.querySelector("#error-modal");

var breweryStoredArray = [];
var breweryFavoritesArray = [];

for (var i = 0; i < states.length; i++) {
  var option = document.createElement("option");
  option.textContent = states[i];
  stateName.append(option);
}

/*
if(!cityName) {
  //Trigger modal
}
*/

function newPage(event) {
  if (event !== undefined){
    event.preventDefault
  }
  //event.preventDefault;
  var queryString =
    "./assets/html/app.html?q=&" + cityName.value.split(" ").join("_") + "&" + stateName.value;
  location.href = queryString;
  console.log(queryString);
  console.log(event);
}
console.log(submitBtn)
if (submitBtn !== null){
  submitBtn.addEventListener("click", newPage);
}

function getParam() {
  var searchParamsArr = document.location.search.split("&");
  var cityName2 = searchParamsArr[1].split("&").pop();
  var stateName2 = searchParamsArr[2].split("&").pop();

  fetchRequest(cityName2, stateName2);
}

function fetchRequest(cityName2, stateName2) {
  fetch(
    "https://api.openbrewerydb.org/breweries?by_city=" + cityName2 + "&by_state=" + stateName2)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var isValid = false;
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].city.split(" ").join("_").toUpperCase() ==
          cityName2.toUpperCase()
        ) {
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
            case lat == null || long == null:
              continue;
            case number == null:
              number = "N/A";
            case address == null:
              address = "No address";
            case website == null:
              website = "No website";
          }

          console.log(lat, long);
          console.log(
            breweryName,
            address,
            cityN,
            state,
            zipCode,
            number,
            website
          );
        }
        // saves to object
        var information = {
          name: breweryName,
          street: address,
          city: cityN,
          state: state,
          zipCode: zipCode,
          phone: number,
          website: website,
          lat: lat,
          long: long,
        };

        //Add object to array
        breweryStoredArray.push(information);
      }

      if (!isValid) {
        var closeButton = document.querySelector("#close-button");
        console.log("this bitch empty yeet");
        errorModal.classList.add("visible");
        errorModal.classList.remove("hidden");
        overlay.classList.remove("hidden");
        overlay.classList.add("visible");

        closeButton.addEventListener("click", function () {
          errorModal.classList.add("hidden");
          errorModal.classList.remove("visible");
          overlay.classList.add("hidden");
          overlay.classList.remove("visible");
        })
      }

      console.log(breweryStoredArray);

      //put array into local storage
      storeBreweries();
    });
}

//create element dynamically within the loop for each container
function storeBreweries() {
  localStorage.setItem("allBreweries", JSON.stringify(breweryStoredArray));
  createBreweryHTML();
}

// TODO: Make a function that will be the html for the Modal window. Can call in fetch so we can use the data
function brewCard(brew, i) {
  return `
      <!-- Card -->
      <div class="p-6 rounded-lg bg-white bg-opacity-75">
      <div id="map${i}" style="height:180px" class="z-0 object-cover object-center w-full mb-8 lg:h-48 md:h-36 rounded-xl"></div>
        <h2
          class="mb-8 text-xl font-semibold tracking-wide text-yellow-700 uppercase breweryName"
        >
        ${brew.name}
        </h2>
        <p class="mx-auto text-base leading-relaxed text-stone-700">
          ${brew.street}<br>${brew.city}, ${brew.state} ${brew.zipCode}
          </p>
          <p class="mx-auto text-base leading-relaxed text-stone-700">
          ${brew.phone.slice(0, 3)}-${brew.phone.slice(
    3,
    6
  )}-${brew.phone.slice(6, 11)}
          </p>
        <p class="mx-auto text-base leading-relaxed text-stone-700">
          <a class="inline-flex items-center font-semibold text-yellow-700 lg:mb-0 hover:text-yellow-700" target="_blank" href="${brew.website
    }">Website »</a>
          </p>
        <button
          class="self-center mt-8 mx-2 my-2 px-3 py-2 text-base font-medium text-center text-white transition duration-500 ease-in-out transform bg-yellow-600 rounded-xl hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
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
}

//Pull information from storage and print to page
function createBreweryHTML() {
  JSON.parse(localStorage.getItem("allBreweries"));
  console.log(breweryStoredArray[0].name);

  for (var i = 0; i < breweryStoredArray.length; i++) {
    // Create the HTML card content depending on array length
    var div = document.createElement("div");
    div.innerHTML = brewCard(breweryStoredArray[i], i);
    cardContainer.append(div);

    var map = L.map("map" + i).setView(
      [breweryStoredArray[i].lat, breweryStoredArray[i].long],
      15
    );

    // Dynamically create mapping through each iteration
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    var marker = L.marker([
      breweryStoredArray[i].lat,
      breweryStoredArray[i].long,
    ]).addTo(map);
  }
}
