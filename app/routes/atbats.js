var mongo = require('mongodb');

var server = new mongo.Server('localhost', 27017, {
	auto_reconnect : true
});
db = new mongo.Db('mlbatbat', server);

exports.findAll = function(req, res) {

	/* Supported parameters */
	var batter = req.query.batter;
	var pitcher = req.query.pitcher;
	var start = req.query.start;
	var end = req.query.end;

	var query = {};

	if (batter) {
		query.batter = batter;
	}
	if (pitcher) {
		query.pitcher = pitcher;
	}

	db.collection('atbats', function(err, collection) {
		collection.find(query).toArray(function(err, docs) {
			res.send(docs);
		});
	});
};