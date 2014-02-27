'use strict';

angular.module('pitchfxApp').directive('defaultAvatar', [ function() {
    return {
        link : function(scope, element) {
            element.bind('error', function() {
                element.attr('src', '/images/default-player.png');
            });
        }
    };
} ]);
