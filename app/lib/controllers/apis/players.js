var MongoClient = require('mongodb').MongoClient;

/**
 * Get a player by ID. The req.params.id is expected to be populated
 *
 * @param req -
 *            the express request
 * @param res -
 *            the express response
 */
exports.getPlayer = function(req, res)
{
    var query = {
        'id': parseInt(req.params.playerId, 10)
    };
    MongoClient.connect("mongodb://localhost:27017/mlbatbat", function(err, db)
    {
        db.collection('players').findOne(query, function(err, doc)
        {
            res.json(doc);
            db.close();
        });
    });
};

/**
 * Query against all players using a string query. When the query is more than
 * one word, simply split the query and search against the "first" and "last"
 * fields.
 *
 * @param req -
 *            the express request
 * @param res -
 *            the express response
 */
exports.query = function(req, res)
{

    /* Supported parameters */
    var search = req.query.search,
        from = (req.query.from) ? req.query.from : 0,
        size = (req.query.size) ? req.query.size : 20,
        query = {},
        splitty,
        options = {
            'sort':
            {
                'lastSeen': -1
            },
            'skip': from,
            'limit': size
        };
    if (search)
    {
        splitty = search.split(" ");
        if (splitty.length > 1)
        {
            query = {
                'first': new RegExp(splitty[0], 'i'),
                'last': new RegExp(splitty[1], 'i')
            };
        }
        else
        {
            query = {
                '$or': [
                {
                    'first': new RegExp(search, 'i')
                },
                {
                    'last': new RegExp(search, 'i')
                }]
            };
        }
    }

    console.log(query);

    MongoClient.connect("mongodb://localhost:27017/mlbatbat", function(err, db)
    {
        db.collection('players').find(query, options).toArray(function(err, docs)
        {
            res.json(docs);
            db.close();
        });
    });

};
