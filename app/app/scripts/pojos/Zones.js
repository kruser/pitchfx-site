var pitchfx = pitchfx ||
{};

/**
 * @class pitchfx.Zones
 * @classdesc a zone contains a 2D array of pitch zones that pitches can be
 *            added to. The inner 60% of values will always be the strike zone.
 *
 * For example, given a 10x10 2D array, the middle 6x6 will represent the strike
 * zone.
 */
pitchfx.Zones = function()
{
    var arr = [],
        i, j, rows = 10;
    for (i = 0; i < rows; i++)
    {
        arr[i] = [];
        for (j = 0; j < rows; j++)
        {
            arr[i].push(new pitchfx.Zone());
        }
    }
    this.pitchZones = arr;
    this.rows = rows;
    this.strikeZone = {
        top: 3.5,
        right: 0.709,
        bottom: 1.5,
        left: -0.709,
    };
    this.squareWidth = (this.strikeZone.right - this.strikeZone.left) / (0.60 * rows);
    this.squareHeight = (this.strikeZone.top - this.strikeZone.bottom) / (0.60 * rows);
    this.xOffset = this.squareWidth * rows / 2;
    this.bottomBounds = this.strikeZone.bottom - (0.20 * rows * this.squareHeight);
    this.topBounds = this.strikeZone.top + (0.20 * rows * this.squareHeight);
};

/**
 * Get the column for a pitch given the x coordinate
 *
 * @param {number}
 *            x
 * @return {number} the column
 */
pitchfx.Zones.prototype.getColumn = function(x)
{
    var col = 0,
        newX = x + this.xOffset;
    if (newX > 0)
    {
        /* Only do this if we're right of the leftmost */
        col = parseInt(newX / this.squareWidth, 10);
    }

    if (col >= this.rows)
    {
        /* Too far right, stick it in the last bin */
        col = this.rows - 1;
    }
    return col;
};

/**
 * Get the row for a pitch given an y coordinate
 *
 * @param {number}
 *            y
 * @return {number} the row
 */
pitchfx.Zones.prototype.getRow = function(y)
{
    if (y < this.bottomBounds)
    {
        return 0;
    }
    else if (y > this.topBounds)
    {
        return this.rows - 1;
    }
    else
    {
        return parseInt((y - this.bottomBounds) / this.squareHeight, 10);
    }
};

/**
 * Add a pitch to this set of zones if it has x and y coords
 *
 * @param {pitchfx.Pitch}
 *            pitch - the pitch to add to the zones
 */
pitchfx.Zones.prototype.addPitch = function(pitch)
{
    if (!angular.isDefined(pitch.px) || !angular.isDefined(pitch.pz))
    {
        return;
    }
    var col = this.getColumn(pitch.px),
        row = this.getRow(pitch.pz),
        zone = this.pitchZones[col][row];
    zone.addPitch(pitch);
};

/**
 * Get the swing rates for each zone
 *
 * @returns {Array} a grid of rates
 */
pitchfx.Zones.prototype.getSwingRates = function()
{
    return this.buildZoneStats(function(pitchZone)
    {
        return pitchZone.getSwingRate();
    });
};

/**
 * Get a grid of whiffs per swing rates
 *
 * @returns {Array} a grid of rates
 */
pitchfx.Zones.prototype.getWhiffsPerSwingRates = function()
{
    return this.buildZoneStats(function(pitchZone)
    {
        return pitchZone.getWhiffsPerSwingRate();
    });
};

/**
 * This function is responsible for iterating over all pitch zones and creating
 * a new 2d array of only a single stat.
 *
 * @param {function(pitchfx.Zone)}
 *            pitchZoneCallback - this function will be called on each pitchZone
 *            object. The return value is what will be stuck in each cell of the
 *            2d array.
 * @returns {Array}
 * @private
 */
pitchfx.Zones.prototype.buildZoneStats = function(pitchZoneCallback)
{
    var zones = [],
        cols;
    angular.forEach(this.pitchZones, function(value)
    {
        cols = [];
        angular.forEach(value, function(pitchZone)
        {
            cols.push(pitchZoneCallback(pitchZone));
        });
        zones.push(cols);
    });
    return zones;
};
