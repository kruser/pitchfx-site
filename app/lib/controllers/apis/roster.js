var MongoClient = require('mongodb').MongoClient;

/**
 * Query players on latest roster given a team code. The req.query.team_code is
 * expected to be populated
 *
 * @param req -
 *            the express request
 * @param res -
 *            the express response
 */
exports.query = function(req, res)
{
    var team = req.query.team,
        query = {
            '$and': [
            {
                '$or': [
                {
                    'home_name_abbrev': team
                },
                {
                    'away_name_abbrev': team
                }]
            },
            {
                'team.player':
                {
                    '$exists': true
                }
            }]
        }, options = {
            'sort':
            {
                'start': -1
            },
            'limit': 1
        };

    MongoClient.connect("mongodb://localhost:27017/mlbatbat", function(err, db)
    {
        db.collection('games').findOne(query, options, function(err, doc)
        {
            if (doc && doc.team && doc.team.length > 0)
            {

                if (doc.team[0].id === team)
                {
                    res.json(doc.team[0].player);
                }
                else
                {
                    res.json(doc.team[1].player);
                }
            }
            else
            {
                res.send(404, 'Invalid Team');
            }
            db.close();
        });
    });

};
