goog.provide('kruser.pojos.PlayerInfo');

/**
 * @class kruser.pojos.PlayerInfo
 * @classdesc the player_info object as it comes from the MLBAM APIs
 * 
 * @param {object}
 *            dataObj - the player_info data as it comes from the wire
 */
kruser.pojos.PlayerInfo = function(dataObj) {
    angular.extend(this, dataObj);
}

/**
 * @memberof kruser.pojos.PlayerInfo
 * @instance
 * @returns {Date} the birthday
 */
kruser.pojos.PlayerInfo.prototype.getBirthDate = function() {
    return moment(this.birth_date).toDate();
}

/**
 * @memberof kruser.pojos.PlayerInfo
 * @instance
 * @returns {Date} the mlb debut date
 */
kruser.pojos.PlayerInfo.prototype.getMlbDebut = function() {
    if (this.pro_debut_date) {
        return moment(this.pro_debut_date).toDate();
    }
    return undefined;
}