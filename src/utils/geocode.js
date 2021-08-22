const request = require('request');

//geocode find an location from  geocode service and then execute callback as callback(error, data)
const geocode = (location, callback) => {
	// .env is already loaded from the main application;
	const apiKey = process.env.API_KEY; // Api key for openweathermap.org
	const maxResults = 5; //maximum return search results in the array

	const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=${maxResults}&appid=${apiKey}`;

	request({ url, json: true }, (err, response) => {
		if (err) {
			//callback(error,data)
			//Network error
			callback('Unable to connect to geocode service!', undefined);
		} else if (response.body.length === 0) {
			//No result
			callback('Unable to find that location. Try another search.', undefined);
		} else if (response.body.cod) {
			//Request error
			callback(response.body.message, undefined);
		} else {
			//callback on the most relevant result
			callback(undefined, response.body[0]);
		}
	});
};

module.exports = geocode;
