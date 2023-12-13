import { useEffect, useState } from "react";
import { ProgressBar } from "react-loader-spinner";


const WeatherNewComp = () => {
  const [cityName, setCityName] = useState("");
  const [weatherData, setWeatherData] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function getWeatherData() {
    try {
      setLoading(true);
      let API_KEY = process.env.REACT_APP_API_KEY;
      let data = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
      );
      let result = await data.json();

      if (result.cod === "404") {
        setError(result.message);
        setWeatherData("");
      }

      if (result.cod !== "400" && result.cod !== "404") {
        setWeatherData(result);
        setError("");
      }
      console.log(result);
    } catch (error) {
      setError("An error occured while fetching");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getWeatherData();
  }, [cityName]);

  function kelvinToCelcious(value) {
    let temp = value - 273;
    return temp.toFixed(1);
  }

  // const sunset = new Date(weatherData?.sys?.sunset * 1000);

  function FormatedTimeZone(time) {
    const TimeZone = new Date(time * 1000);

    const formattedData = TimeZone.toLocaleTimeString("en-us", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return formattedData;
  }
  return (
    <>
      <div className="container">
        <div className="top-part">
          <div className="nav">
            <span>&#11164;</span>
            <span>Weather Forecasts</span>
            <span>&#9881;</span>
          </div>
          <div className="search">
            <input
              className="searchbar"
              type="text"
              placeholder="Drop your location here"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
            />
            {loading && (
              <div style={{ textAlign: "center" }}>
                <ProgressBar
                  height="80"
                  width="80"
                  ariaLabel="progress-bar-loading"
                  wrapperStyle={{}}
                  wrapperClass="progress-bar-wrapper"
                  borderColor="white"
                  barColor="#275ebb"
                />
              </div>
            )}

            {error && cityName && (
              <div className="error">
                <p>Error : {error}</p>
              </div>
            )}
          </div>
        </div>
        {weatherData && cityName && (
          <div className="middle-part">
            <div className="main">
              <div className="image">
                {weatherData.weather && (
                  <img src={`${weatherData?.weather[0].icon}.svg`} alt="" />
                )}
              </div>
              <div className="temp">
                {weatherData && cityName && <p>Temperature : </p>}
                {weatherData && cityName && (
                  <h1>
                    {kelvinToCelcious(weatherData?.main?.temp)}
                    <sup>o</sup> C{" "}
                  </h1>
                )}
                <h2>
                  {weatherData.weather &&
                    weatherData?.weather[0]?.description.toUpperCase()}
                </h2>
              </div>
            </div>

            <div className="city">
              <div>
                <p>City : {weatherData?.name}</p>
                <p>Country :{weatherData?.sys?.country}</p>
              </div>
              <div className="max"></div>
              <div>
                <p>
                  Max:{kelvinToCelcious(weatherData?.main?.temp_max)}
                  <sup>o</sup> C{" "}
                </p>
                <p>
                  Min:{kelvinToCelcious(weatherData?.main?.temp_min)}
                  <sup>o</sup> C{" "}
                </p>
              </div>
            </div>
          </div>
        )}
        {weatherData && cityName && (
          <div className="lower-part">
            <div className="details">
              <p>Sunrise : {FormatedTimeZone(weatherData?.sys?.sunrise)}</p>
              <p>Sunset : {FormatedTimeZone(weatherData?.sys?.sunset)}</p>
            </div>
            <div className="details">
              <p>Humidity : {weatherData?.main?.humidity} %</p>
              <p>Pressure : {weatherData?.main?.pressure} </p>
            </div>
            <div className="details">
              <p>Wind Speed : {weatherData?.wind?.speed} </p>
              <p>Degree: {weatherData?.wind?.deg}</p>
            </div>
            <div className="details">
              <p>Visibility : {weatherData?.visibility} m</p>
              <p>Clouds : {weatherData?.clouds?.all} %</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WeatherNewComp;
