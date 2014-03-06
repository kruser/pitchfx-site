/**
 * Push on an array, but only if the object to push is truthy
 *
 * @param {Array}
 *            theArray - the source array
 * @param {object}
 *            theObject - the object to push on the array if it is truthy
 */
exports.pushIfExists = function(theArray, theObject)
{
    if (theObject)
    {
        theArray.push(theObject);
    }
};
