var MongoClient = require('mongodb').MongoClient;

/**
 * Query atbats for a batter or a pitcher. If there isn't a "batter" or
 * "pitcher" query parameter than this method will throw a 500.
 *
 * @param req -
 *            the express request
 * @param res -
 *            the express response
 */
exports.query = function(req, res) {

    /* Supported parameters */
    var batter = req.query.batter,
        pitcher = req.query.pitcher,
        start = req.query.from,
        end = req.query.to,
        query = {};

    if (batter) {
        query.batter = parseInt(batter, 10);
    }
    if (pitcher) {
        query.pitcher = parseInt(pitcher, 10);
    }
    if (!pitcher && !batter) {
        res.send(500, {
            error: 'pitcher or batter parameters are required'
        });
        return;
    }
    if (start && end) {
        query.start_tfs_zulu = {
            '$gte': new Date(start),
            '$lte': new Date(end)
        };
    } else if (start) {
        query.start_tfs_zulu = {
            '$gte': new Date(start)
        };
    } else if (end) {
        query.start_tfs_zulu = {
            '$lt': new Date(end)
        };
    }

    MongoClient.connect("mongodb://localhost:27017/mlbatbat", function(err, db) {
        db.collection('atbats').find(query).toArray(function(err, docs) {
            res.json(docs);
            db.close();
        });
    });

};
