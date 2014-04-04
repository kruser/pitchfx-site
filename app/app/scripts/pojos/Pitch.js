var pitchfx = pitchfx ||
{};

/**
 * @class pitchfx.Pitch
 * @classdesc a Pitch data object
 *
 * @param {object}
 *            dataObj - the pitch data as it comes from the wire
 */
pitchfx.Pitch = function(dataObj)
{
    angular.extend(this, dataObj);
};

/**
 * @returns {Boolean} true if this is a ball, false if a strike
 */
pitchfx.Pitch.prototype.isBall = function()
{
    return this.type === 'B';
};

/**
 * @returns {Boolean} true if this is a foul ball
 */
pitchfx.Pitch.prototype.isFoul = function()
{
    return this.des === 'Foul';
};

/**
 * @returns {Boolean} true if this pitch was hit in play
 */
pitchfx.Pitch.prototype.isBallInPlay = function()
{
    return this.type === 'X';
};

/**
 * @returns {Boolean} true if this pitch was swung at
 */
pitchfx.Pitch.prototype.isSwing = function()
{
    return this.type !== 'B' && this.des !== 'Called Strike';
};

/**
 * @returns {Boolean} true if this pitch was swung at and missed
 */
pitchfx.Pitch.prototype.isWhiff = function()
{
    return (/Swinging Strike.*/i.test(this.des));
};

/**
 * @returns {Boolean} true if this pitch resulted in a hit
 */
pitchfx.Pitch.prototype.isHit = function()
{
    return (/in play,\s*(no out|run.*)/i.test(this.des));
};

/**
 * @returns {Boolean} true if this pitch results in a hit ball, which in turn
 *          results in an out
 */
pitchfx.Pitch.prototype.isOut = function()
{
    return this.des === 'In play, out(s)';
};

/**
 * @returns {Boolean} true if this pitch resulted in a home run
 */
pitchfx.Pitch.prototype.isHomeRun = function()
{
    if (this.hip && this.hip.des)
    {
        return (/home run/i.test(this.hip.des));
    }
    return false;
};

/**
 * @returns {number} if this pitch resulted in an event that contributes to
 *          weighted on-base average, that value is returned here. In the case
 *          the pitch doesn't result in an event, this function returned
 *          undefined.
 */
pitchfx.Pitch.prototype.getWeightedObaValue = function()
{
    if (this.hip && this.hip.des)
    {
        var des = this.hip.des;
        if (/single/i.test(des))
        {
            return 0.9;
        }
        else if (/double/i.test(des))
        {
            return 1.24;
        }
        else if (/triple/i.test(des))
        {
            return 1.56;
        }
        else if (/home run/i.test(des))
        {
            return 1.95;
        }
        else if (/field error/i.test(des))
        {
            return 1.56;
        }
    }
    return undefined;
};

/**
 *
 * @returns {String} if the pitch was hit in play (hip), this gets the
 *          trajectory as one of 'liner|grounder|flyball|popup'
 */
pitchfx.Pitch.prototype.getHipTrajectory = function()
{
    if (this.hip)
    {
        var des = this.atbat.des;
        if (/pop up|pops out/i.test(des))
        {
            return 'popup';
        }
        else if (/line drive|lines out/i.test(des))
        {
            return 'liner';
        }
        else if (/fly ball|flies out/i.test(des))
        {
            return 'flyball';
        }
        else
        {
            return 'grounder';
        }
    }
    return '';
};

/**
 * Get the short code representation for this pitch
 *
 * @returns {string} the pitch code
 */
pitchfx.Pitch.prototype.getPitchType = function()
{
    var pitchCode = this.pitch_type;
    if (!pitchCode)
    {
        pitchCode = 'UN';
    }
    return pitchCode;
};

/**
 * Gets the display name of this pitch type
 *
 * Pitch Types Key FA Fastball FF 4-seam Fastball FT 2-seam Fastball FC Cut
 * Fastball FS Split-finger Fastball FO Forkball SI Sinker SL Slider CU
 * Curveball KC Knuckle Curve EP Ephuus CH Change-up SC Screwball KN Knuckleball
 * UN Unknown
 *
 * @param {string}
 *            the pitch code, e.g. 'FC', 'FF'
 * @returns {string} the pitch name
 */
pitchfx.Pitch.getPitchDisplayName = function(pitchCode)
{
    switch (pitchCode)
    {
        case 'FA':
            return 'Fastball';
        case 'FF':
            return '4-seam';
        case 'FT':
            return '2-seam';
        case 'FC':
            return 'Cutter';
        case 'FS':
            return 'Splitter';
        case 'FO':
            return 'Forkball';
        case 'SI':
            return 'Sinker';
        case 'SL':
            return 'Slider';
        case 'CU':
            return 'Curve';
        case 'KC':
            return 'Knuck-Curve';
        case 'EP':
            return 'Ephuus';
        case 'CH':
            return 'Change';
        case 'SC':
            return 'Screwball';
        case 'KN':
            return 'Knuckleball';
        case 'UN':
            return 'Unknown';
    }
    return 'Other';
};
