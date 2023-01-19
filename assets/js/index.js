// Welcome to Deja Brew!

var states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",];
var stateName = document.querySelector("#states");
var submitBtn = document.querySelector("#submit");
var cityName = document.querySelector("#city");
var cardContainer = document.querySelector("#card-container");
var errorModal = document.querySelector("#error-modal");

// Empty array to be used in fetch
var breweryStoredArray = [];

// Creates the options for the states drop-down menu
for (var i = 0; i < states.length; i++) {
  var option = document.createElement("option");
  option.textContent = states[i];
  stateName.append(option);
};

// Creates a queried string to be used in app.html
function newPage(event) {
  if (event !== undefined) {
    event.preventDefault
  };
  // If working locally, the variable queryString needs to be set to ./assets/html/app.html?q=& not /deja-brew/assets/html/app.html?q=&
  var queryString = "./assets/html/app.html?q=&" + cityName.value.split(" ").join("_") + "&" + stateName.value;
  location.href = queryString;
}

// Checks if there is a button with an id of submit
if (submitBtn !== null) {
  submitBtn.addEventListener("click", newPage);
}

// Grabs the city and state parameters from the queried URL and passes them as an arguement to fetchRequest
function getParam() {
  var searchParamArr = document.location.search.split("&");
  var cityNameParam = searchParamArr[1].split("&").pop();
  var stateNameParam = searchParamArr[2].split("&").pop();

  fetchRequest(cityNameParam, stateNameParam);
}

// Runs a fetch request to retrieve information from open brew api
function fetchRequest(cityNameParam, stateNameParam) {
  fetch("https://api.openbrewerydb.org/breweries?by_city=" + cityNameParam + "&by_state=" + stateNameParam)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var isValid = false;
      for (let i = 0; i < data.length; i++) {
        if (data[i].city.split(" ").join("_").toUpperCase() == cityNameParam.toUpperCase()) {

          isValid = true;

          var lat = data[i].latitude;
          var long = data[i].longitude;
          var breweryName = data[i].name;
          var address = data[i].street;
          var city = data[i].city;
          var state = data[i].state;
          var zipCode = data[i].postal_code;
          var number = data[i].phone;
          var website = data[i].website_url;

          // If there is missing information, give a value instead of null
          switch (true) {
            case lat == null || long == null:
              continue;
            case number == null:
              number = "N/A";
            case address == null:
              address = "No address";
            case website == null:
              website = "No website";
          };
        }
        // Create object with information from fetch
        var information = {
          name: breweryName,
          street: address,
          city: city,
          state: state,
          zipCode: zipCode,
          phone: number,
          website: website,
          lat: lat,
          long: long,
        };

        breweryStoredArray.push(information);
      };

      // Modal message if invalid city name is entered or nothing is entered
      if (!isValid) {
        var closeButton = document.querySelector("#close-button");
        errorModal.classList.add("visible");
        errorModal.classList.remove("hidden");
        overlay.classList.remove("hidden");
        overlay.classList.add("visible");

        closeButton.addEventListener("click", function () {
          errorModal.classList.add("hidden");
          errorModal.classList.remove("visible");
          overlay.classList.add("hidden");
          overlay.classList.remove("visible");
        });
      };

      storeBreweries();
    });
}

// Creates the local storage
function storeBreweries() {
  localStorage.setItem("allBreweries", JSON.stringify(breweryStoredArray));
  createBreweryHTML();
}

// creates a template for each card to display the breweries
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
          ${brew.phone.slice(0, 3)}-${brew.phone.slice(3, 6)}-${brew.phone.slice(6, 11)}
          </p>
        <p class="mx-auto text-base leading-relaxed text-stone-700">
          <a class="inline-flex items-center font-semibold text-yellow-700 lg:mb-0 hover:text-yellow-700" target="_blank" href="${brew.website}">Website »</a>
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
};

// Pulls data from local storage and creates each card depending on length of array
function createBreweryHTML() {
  JSON.parse(localStorage.getItem("allBreweries"));

  for (var i = 0; i < breweryStoredArray.length; i++) {
    var div = document.createElement("div");
    div.innerHTML = brewCard(breweryStoredArray[i], i);
    cardContainer.append(div);

    // Dynamically creates mapping through each iteration
    var map = L.map("map" + i).setView([breweryStoredArray[i].lat, breweryStoredArray[i].long], 15);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    var marker = L.marker([breweryStoredArray[i].lat, breweryStoredArray[i].long]).addTo(map);
  };
};