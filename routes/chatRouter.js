const express = require('express');
const path = require('path');
const cors = require('../routes/cors');

const Router = express.Router();

Router.route('/')
	.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
	.get(cors.cors, (req, res, next) => {
		res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
	});

module.exports = Router;
