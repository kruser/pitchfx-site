/**
 * Build an $in filter sourced by an object like this.... { '1':true, '2':false }
 * 
 * @param {object}
 *            object - the object containing boolean objects that we can iterate
 * @param {string}
 *            fieldName - the name of the MongoDB field
 * @returns {object} the filter, can be undefined if no values pass
 */
exports.buildInFilter = function(object, fieldName) {
    var values = [];
    for ( var key in object) {
        if (object[key]) {
            if (/^\d+$/.test(key)) {
                values.push(parseInt(key, 10));
            } else {
                values.push(key);
            }
        }
    }
    if (values.length > 0) {
        var filter = {};
        filter[fieldName] = {
            '$in' : values
        };
        return filter;
    } else {
        return undefined;
    }
};