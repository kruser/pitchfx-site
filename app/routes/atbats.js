var MongoClient = require('mongodb').MongoClient;

exports.query = function(req, res) {

	/* Supported parameters */
	var batter = req.query.batter;
	var pitcher = req.query.pitcher;
	var start = req.query.start;
	var end = req.query.end;

	var query = {};
	if (batter) {
		query.batter = parseInt(batter);
	}
	if (pitcher) {
		query.pitcher = parseInt(pitcher);
	}
	if (start && end) {
		query.start_tfs_zulu = {
			'$gte' : new Date(start),
			'$lte' : new Date(end)
		};
	} else if (start) {
		query.start_tfs_zulu = {
			'$gte' : new Date(start)
		};
	} else if (end) {
		query.start_tfs_zulu = {
			'$lt' : new Date(end)
		};
	}

	MongoClient.connect("mongodb://localhost:27017/mlbatbat", function(err, db) {
		db.collection('atbats').find(query).toArray(function(err, docs) {
			res.json(docs);
			db.close();
		});
	});

};