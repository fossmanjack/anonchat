const cors = require('cors');

const whitelist = [
	'http://localhost:7777'
];

const corsOptionsDelegate = (req, callback) => {
	const corsOptions = { origin: false };

	console.log(req.header('Origin'));

	if(whitelist.includes(req.header('Origin'))) corsOptions.origin = true;

	callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
