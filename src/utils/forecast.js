const request = require('request');
const chalk = require('chalk');

const forecast = function (longitude, latitude, location, callback) {
	// .env is already loaded from the main application;
	const apiKey = process.env.API_KEY; // Api key for openweathermap.org

	const lang = 'en'; //default return language is english
	const units = 'metric'; // standard for Kelvin..., metric for Celcius,.. imperial for Ferenheit

	const url = `http://api.openweathermap.org/data/2.5/onecall?lon=${longitude}&lat=${latitude}&units=${units}&appid=${apiKey}&lang=${lang}`;

	// make a GET request to weather forecase API then execute callback function on result: callback(error, data)
	// using error first callback not only for compatible with JS error first style but also easier to convert
	// to promise in later update
	request(
		{
			url,
			json: true, // return body type
		},
		(error, response) => {
			if (error) {
				callback('Unable to connect to weather services!', undefined);
			} else if (response.body.cod) {
				callback(response.body.message, undefined);
			} else {
				const weather = response.body;
				const currentTemp = weather.current.temp;
				const precipProp = weather.hourly[0].pop * 100;
				let weatherStat = weather.current.weather[0].description;
				weatherStat = weatherStat[0].toUpperCase() + weatherStat.slice(1); //Upper case the first letter

				callback(undefined, {
					forecastData: `${weatherStat}. It is currently ${currentTemp} degree out. There is ${precipProp}% chance of rain in the next 1 hour`,
					location,
				});
			}
		}
	);
};

module.exports = forecast;
