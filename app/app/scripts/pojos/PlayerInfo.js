var pitchfx = pitchfx ||
{};

/**
 * @class pojos.PlayerInfo
 * @classdesc the player_info object as it comes from the MLBAM APIs
 *
 * @param {object}
 *            dataObj - the player_info data as it comes from the wire
 */
pitchfx.PlayerInfo = function(dataObj)
{
    angular.extend(this, dataObj);
};

/**
 * @memberof pojos.PlayerInfo
 * @instance
 * @returns {Date} the birthday
 */
pitchfx.PlayerInfo.prototype.getBirthDate = function()
{
    return moment(this.birth_date).toDate();
};

/**
 * @memberof pojos.PlayerInfo
 * @instance
 * @returns {Date} the mlb debut date
 */
pitchfx.PlayerInfo.prototype.getMlbDebut = function()
{
    if (this.pro_debut_date)
    {
        return moment(this.pro_debut_date).toDate();
    }
    return undefined;
};
