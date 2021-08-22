'use strict';
const path = require('path');
const express = require('express');
const hbs = require('hbs');

//load util functions
const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');
//load .env from project directory
require('dotenv').config();

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialPath = path.join(__dirname, '../templates/partials');

//Create a server instance
const app = express();
const port = process.env.PORT || 3000;

//Set up view engine (handlebars) and views location path
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialPath);

//Set up static files directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
	res.render('index', {
		title: 'Weather app',
		creator: 'Hoai Phu',
	});
});

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About',
		creator: 'Hoai Phu',
	});
});

app.get('/help', (req, res) => {
	res.render('help', {
		title: 'Help',
		content:
			'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam esse animi non totam illum sequi inventore veniam, eveniet rem, consequuntur, similique at aspernatur necessitatibus accusamus voluptates nihil cumque maiores saepe!',
		creator: 'Hoai Phu',
	});
});

app.get('/help/*', (req, res) => {
	res.render('404', {
		title: '404',
		creator: 'Hoai Phu',
		message: 'Help article not found',
	});
});

//use forecast utils
app.get('/weather', (req, res) => {
	if (!req.query.address) {
		return res.send({
			error: 'You must provide an address',
		});
	}

	//code based on weather-app/app.js
	geocode(req.query.address, (error, { lon, lat, name } = {}) => {
		if (error) {
			return res.send({ error });
		} else {
			forecast(lon, lat, name, (error, data) => {
				if (error) {
					return res.send({ error });
				} else {
					return res.send({ address: req.query.address, forecastData: data.forecastData, location: data.location });
				}
			});
		}
	});
});

app.get('/products', (req, res) => {
	if (!req.query.search) {
		return res.send({
			error: 'You must provide a search term',
		});
	}

	console.log(req.query);
	res.send({
		products: [],
	});
});

//* means match anthing else
app.get('*', (req, res) => {
	res.render('404', {
		message: '404 not found',
		title: '404',
		creator: 'Hoai Phu',
	});
});

//Start up the server
app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});
