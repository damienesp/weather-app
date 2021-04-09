const key = "ee23f572ef86b1ae5a0c728528dff1a3";
const tempDiv = document.getElementById("temp-card");
const formDiv = document.querySelector(".form-search");
const searchInput = document.querySelector(".search-styling");

// fetch data
async function getWeather(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`
  );
  if (!response.ok) {
    const message = response.status;
    throw new Error(message);
  }
  const data = await response.json();

  addWeather(data);
}

// add weather in html
function addWeather(data) {
  searchInput.classList.remove("error");
  searchInput.placeholder = "Search by location";
  const showTemp = document.createElement("div");
  showTemp.classList.add("weather");
  showTemp.innerHTML = `<div class="temp-wrapper"><div class="top"><p class="temp-city">${
    searchInput.value
  }, ${data.sys.country}</p>
                        <p class="time-date">${time(
                          data.dt,
                          data.timezone
                        )}</p></div>
                        <span class="temp-num">${Math.round(
                          data.main.temp
                        )}°C</span></div>
                        <div class="temp-icon">
                        <img class="weather-icon" src="./img/weather_icon/${
                          data.weather[0].icon
                        }.svg"/></div>`;
  // clean prev temp
  tempDiv.innerHTML = "";
  // clean search result
  searchInput.value = null;
  // append new temp
  tempDiv.appendChild(showTemp);
}

// get time and day by localisation
function time(dt, tz) {
  const timedata = new Date((dt + tz) * 1000);

  let hour = timedata.getHours() - 1;
  let min = timedata.getMinutes();
  let day = timedata.getDate();
  let month = timedata.getMonth() + 1;

  if (min < 10) {
    min = "0" + min;
  }

  if (hour < 10) {
    hour = "0" + hour;
  }

  if (day < 10) {
    day = "0" + day;
  }

  if (month < 10) {
    month = "0" + month;
  }

  return `${hour}:${min} • ${day}/${month}`;
}

// submit event
formDiv.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = searchInput.value;

  getWeather(city).catch((error) => {
    if (error.message === "404") {
      searchInput.value = null;
      searchInput.classList.add("error");
      searchInput.placeholder = "City not found";
    } else {
      searchInput.value = null;
      searchInput.classList.add("error");
      searchInput.placeholder = "Server error";
    }
  });
});
