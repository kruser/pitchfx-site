var directives = directives || {};

/**
 * Sets up the default player image when a mugshot isn't available.
 * 
 * Usage...
 * 
 * <img src="path/to/mug.png" default-avatar></img>
 */
directives.defaultAvatar = [ function() {
    return {
        link : function(scope, element, attrs) {
            element.bind('error', function() {
                element.attr('src', '/images/default-player.png');
            });
        }
    };
} ];