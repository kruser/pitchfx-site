var js2xmlparser = require("js2xmlparser"),
    MongoClient = require('mongodb').MongoClient,
    moment = require('moment');


/**
 * Loads all partials from the partials folder
 */
exports.generate = function(req, res)
{

    var urlSet = {
        '@':
        {
            xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
        },
        url: []
    },
        url,
        player,
        lastMod = moment().format('YYYY-MM-DD');

    urlSet.url.push(
    {
        loc: 'http://baseballmod.com',
        lastmod: lastMod,
        changefreq: 'monthly',
        priority: 1
    });
    res.header('Content-Type', 'text/xml');

    MongoClient.connect("mongodb://localhost:27017/mlbatbat", function(err, db)
    {
        db.collection('players').find(
        {}).toArray(function(err, docs)
        {
            for (var i in docs)
            {
                player = docs[i];
                if (player.first && player.last)
                {
                    url = {
                        loc: 'http://baseballmod.com/player/' + player.id + '/' + player.first.toLowerCase() + '-' + player.last.toLowerCase(),
                        lastmod: lastMod,
                        changefreq: 'weekly',
                        priority: 1
                    };
                    urlSet.url.push(url);
                }
            }
            db.close();
            res.send(js2xmlparser("urlset", urlSet));
        });
    });
};
