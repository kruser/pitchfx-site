var MongoClient = require('mongodb').MongoClient;

exports.getPlayer = function(req, res) {
	var query = {
		'id' : parseInt(req.params.id)
	};
	MongoClient.connect("mongodb://localhost:27017/mlbatbat", function(err, db) {
		db.collection('players').findOne(query, function(err, doc) {
			res.json(doc);
			db.close();
		});
	});
}

exports.query = function(req, res) {

	/* Supported parameters */
	var search = req.query.search;

	var query = {};
	var options = {
			'sort' : 'last'
		};
	if (search) {
		var splitty = search.split(" ");
		if (splitty.length > 1) {
			query = {
				'first' : new RegExp(splitty[0], 'i'),
				'last' : new RegExp(splitty[1], 'i')
			};
		} else {
			query = {
				'first' : new RegExp(search, 'i')
			};
		}
	} 
	
	console.log(query);

	MongoClient.connect("mongodb://localhost:27017/mlbatbat", function(err, db) {
		db.collection('players').find(query, options).toArray(function(err, docs) {
			res.json(docs);
			db.close();
		});
	});

};