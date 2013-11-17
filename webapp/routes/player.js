/**
 * GET player page.
 */
exports.page = function(req, res) {
    res.render('player', {
        title : 'Express'
    });
};