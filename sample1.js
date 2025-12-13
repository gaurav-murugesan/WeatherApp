document.addEventListener("DOMContentLoaded", () => {
  try {
    const toggleBtn = document.querySelector(".navbar-toggle");
    const menu = document.querySelector(".navbar-menu");

    toggleBtn.addEventListener("click", () => {
      console.log("Hamburger clicked");
      toggleBtn.classList.toggle("active");
      menu.classList.toggle("active");
    });

    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("active");
        toggleBtn.classList.remove("active");
      });
    });
  }
  catch (err) {
    console.error("Error in sample1.js:", err);
  }
});

document.querySelectorAll(".navbar-menu a").forEach(link => {
  link.addEventListener("click", (e) => {
    const target = e.target.getAttribute("href");
    if (target.startsWith("#")) {
      e.preventDefault();
      document.querySelector(target).scrollIntoView({ behavior: "smooth" });
    }
  });
});

const searchInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const errorMsg = document.getElementById("errorMsg");
const resultsBox = document.getElementById("searchResults");
const searchButton = document.getElementById("searchBtn");
searchButton.addEventListener("click", () => {
  document.querySelector("#search").scrollIntoView({ behavior: "smooth" });
});

const API_KEY = "32d36d8deac04f2d82d73509250912";  

searchBtn.addEventListener("click", searchCity);

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchCity();
  }
});

function searchCity() {
  const city = searchInput.value.trim();
  errorMsg.textContent = "";
  resultsBox.innerHTML = "";

  if (city === "") {
    errorMsg.textContent = "Please enter a city name.";
    return;
  }

  const url = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${city}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (!data || data.length === 0) {
        errorMsg.textContent = "City not found. Please check the spelling and try again.";
        return;
      }

      const exactMatch = data.filter(loc =>
        loc.name.toLowerCase() === city.toLowerCase()
      );

      if (exactMatch.length === 0) {
        errorMsg.textContent = "Exact city name not found.";
        return;
      }

      exactMatch.forEach(location => {
        const div = document.createElement("div");
        div.classList.add("result-item");
        div.textContent = `${location.name}, ${location.region}`;
        resultsBox.appendChild(div);
        div.addEventListener("click", () => {
          fetchWeather(location.name);
          document.querySelector("#weather").scrollIntoView({ behavior: "smooth" });
          updateRecentSearches(location.name);
        });

      });
    })

    .catch(err => {
      errorMsg.textContent = "Something went wrong. Try again.";
      console.error(err);
    });
}


function showWeatherSection() {
  document.querySelector("#weather").scrollIntoView({ behavior: "smooth" });
}


function updateRecentSearches(city) {
  let history = JSON.parse(localStorage.getItem("recentCities")) || [];
  history.unshift(city);
  history = history.slice(0, 5);
  localStorage.setItem("recentCities", JSON.stringify(history));
  displayRecentSearches();
}

function displayRecentSearches() {
  const box = document.getElementById("recentSearches");
  const history = JSON.parse(localStorage.getItem("recentCities")) || [];

  if (history.length === 0) {
    box.style.display = "none"; 
    return;
  }

  box.style.display = "block"; 
  box.innerHTML = "<h3>Recent Searches:</h3>";

  history.forEach(item => {
    box.innerHTML += `<p>${item}</p>`;
  });
}

let currentTempC = null;
let currentTempF = null;
let currentUnit = "C";
function fetchWeather(city) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {

      document.getElementById("weather").style.display = "block";
      document.getElementById("recentSearches").style.display = "block";
      document.getElementById("cityName").textContent = data.location.name;
      const date = new Date(data.location.localtime);
      document.getElementById("current-date").textContent = date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
      currentTempC = data.current.temp_c;
      currentTempF = data.current.temp_f;
      currentUnit = "C";
      document.getElementById("temperature").textContent = `${currentTempC}°C`;
      document.getElementById("toggleUnitBtn").textContent = "Change to °F";
      document.getElementById("description").textContent = `Description: ${data.current.condition.text}`;
      document.getElementById("humidity").textContent = `Humidity: ${data.current.humidity}%`;
      document.getElementById("wind").textContent = `Wind: ${data.current.wind_kph} kph`;
      document.getElementById("pressure").textContent = `Pressure: ${data.current.pressure_mb} mb`;
      document.querySelector("#weather").scrollIntoView({ behavior: "smooth" });

      const condition = data.current.condition.text.toLowerCase();
      const icon = document.getElementById("weather-icon");
      if (condition.includes("rain")) icon.src = "rainy.png";
      else if (condition.includes("cloud")) icon.src = "cloudy.png";
      else if (condition.includes("sun") || condition.includes("clear")) icon.src = "sunny.png";
      else if (condition.includes("snow")) icon.src = "snowy.jpg";
      else if (condition.includes("storm") || condition.includes("thunder")) icon.src = "lightning.png";
      else icon.src = "cloudy.png";

    })
    .catch(err => {
      errorMsg.textContent = "Could not load weather.";
      console.error(err);
    });
}

document.getElementById("toggleUnitBtn").addEventListener("click", () => {

    const tempEl = document.getElementById("temperature");
    const btn = document.getElementById("toggleUnitBtn");

    if (currentUnit === "C") {
        tempEl.textContent = `${currentTempF}°F`;
        currentUnit = "F";
        btn.textContent = "Change to °C";
    } else {
        tempEl.textContent = `${currentTempC}°C`;
        currentUnit = "C";
        btn.textContent = "Change to °F";
    }
});



document.addEventListener("DOMContentLoaded", () => {
  const backToTopBtn = document.getElementById("backToTopBtn");
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
