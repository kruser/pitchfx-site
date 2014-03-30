var pitchfx = pitchfx ||
{};

/**
 * @class pitchfx.ZoneStat
 * @classdesc a data object with information about a single zone
 * @param {number}
 *            stat - the stat value
 * @param {string}
 *            description - something that can be used as a tooltip
 */
pitchfx.ZoneStat = function(stat, description)
{
    this.stat = stat;
    this.description = description;
};
