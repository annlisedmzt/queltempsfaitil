import { useEffect, useState } from "react"
import loader from "./assets/loader.svg"
import browser from "./assets/browser.svg"
import "./App.css"
const APIKEY = import.meta.env.VITE_WEATHER_API_KEY

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [errorInfo, setErrorInfo] = useState(null)
  const currentDate = new Date();

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(`https://api.airvisual.com/v2/nearest_city?key=${APIKEY}`)
        if (!response.ok) {
          throw new Error(`Error ${response.status}, ${response.statusText}`)
        }

        const responseData = await response.json()

        setWeatherData({
          city: responseData.data.city,
          country: responseData.data.country,
          iconId: responseData.data.current.weather.ic,
          temperature: responseData.data.current.weather.tp,
          humidity: responseData.data.current.weather.hu,
          hectopascals: responseData.data.current.weather.pr
        })
      } catch (err) {
        setErrorInfo(err.message)
      }
    }
    fetchWeatherData()
  }, [])

  // Test des backgrounds en simulant manuellement les données
  // useEffect(() => {
  //   setWeatherData({
  //     city: "Paris",
  //     country: "France",
  //     iconId: "01d",
  //     temperature: 10,
  //     humidity: 60,
  //     hectopascals: 1013,
  //   });
  // }, []);

  useEffect(() => {
    if (!weatherData) return
    const bodyClass = getIconForBackground(weatherData.iconId)
    document.body.classList.remove("cloudy-day", "sunny-day", "thunderstorm", "snow-day", "night", "shadow-night", "default-background")
    document.body.classList.add(bodyClass)
    return () => {
      document.body.classList.remove(bodyClass)
    }
  }, [weatherData])

  const formattedDate = currentDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  function getTemperatureMessage(temperature) {
    if (temperature <= 0) {
      return "Il fait super froid. 🥶"
    } else if (temperature >= 1 && temperature <= 10) {
      return "Il fait froid, n'oublie pas ta doudoune. "
    } else if (temperature >= 11 && temperature <= 20) {
      return "Il fait frais, un p'tit pull est de mise."
    } else if (temperature >= 21 && temperature <= 25) {
      return "Il fait bon, tu peux te poser en terrasse ou lire un bon livre au parc. 🍻​"
    } else {
      return "Il fait chaud, n'oublie pas de t'hydrater. 🥵​"
    }
  }

  function getIconForBackground(iconId) {
    if (iconId === "03d" || iconId === "04d" || iconId === "50d" || iconId === "09d" || iconId === "10d") {
      return "cloudy-day"
    } else if (iconId === "01d" || iconId === "02d") {
      return "sunny-day"
    } else if (iconId === "11d") {
      return "thunderstorm"
    } else if (iconId === "13d") {
      return "snow-day"
    } else if (iconId === "01n" || iconId === "02n" || iconId === "03n" || iconId === "04n" || iconId === "50n") {
      return "night"
    } else if (iconId === "09n" || iconId === "10n" || iconId === "11n" || iconId === "13n") {
      return "shadow-night"
    } else {
      return "default-background"
    }
  }

  return (
    <main className="app-container">
      <div className={`loader-container ${(!weatherData && !errorInfo) && "active"}`}>
        <img src={loader} alt="loading icon" />
      </div>

      {weatherData && (
        <>
          <p className="city">{weatherData.city} <br /> <span className="date">{formattedDate}</span> </p>
          {/* <p className="country-name">{weatherData.country}</p> */}
          <div className="icon-container">
            <img src={`/icons/${weatherData.iconId}.svg`} className="icon" alt="weather icon" />
          </div>
          <p className="temperature">{weatherData.temperature}°</p>
          <p className="temp-message">
            {getTemperatureMessage(weatherData.temperature)}
          </p>

        </>
      )}

      {(errorInfo && !weatherData) && (
        <>
          <p className="error-information">{errorInfo}</p>
          <img src={browser} alt="error icon" />
        </>
      )}
    </main>
  )
}

export default App
