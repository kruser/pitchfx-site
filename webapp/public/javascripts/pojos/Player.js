var pojos = pojos || {};

/**
 * @class pojos.Player
 * @classdesc a player object identifies
 * 
 * @param {object}
 *            dataObj - the player data as it comes from the wire
 */
pojos.Player = function(dataObj) {
    angular.extend(this, dataObj);
};

/**
 * @memberof pojos.Player
 * @instance
 * @returns {string} the full name of the player
 */
pojos.Player.prototype.getFullName = function() {
    return this.first + ' ' + this.last;
};

/**
 * Use this method to make a name into something that can be part
 * of a URL.
 * 
 * @memberof pojos.Player
 * @instance
 * @returns {string} the url friendly name
 */
pojos.Player.prototype.getUrlFriendlyName = function() {
    var url = this.first + '-' + this.last;
    return url.replace(/\./g,'').toLowerCase();
};