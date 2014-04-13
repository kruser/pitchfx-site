'use strict';

describe('Controller: BattingstatsCtrl', function()
{

    // load the controller's module
    beforeEach(module('pitchfxApp'));

    var BattingstatsCtrl, scope, $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function(_$httpBackend_, $controller, $rootScope)
    {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/stats/123?filter=%7B%7D').respond(
        {
            "year": 2014,
            "BA": 0.3314447592067989,
            "wOBA": 0.38983497536945805,
            "singles": 78,
            "doubles": 30,
            "triples": 0,
            "homeRuns": 9,
            "atbats": 353,
            "plateAppearances": 406,
            "iWalks": 6,
            "walks": 45,
            "rbi": 39,
            "hitByPitch": 0,
            "sacBunts": 0,
            "sacFlies": 2,
            "strikeouts": 73,
            "rboe": 1,
            "runnersPotentialBases": 487,
            "runnersMovedBases": 125,
            "hitBalls":
            {
                "liner": [
                    [136.55, -95.38],
                    [74.3, -64.26]
                ],
                "flyball": [
                    [136.55, -95.38],
                    [74.3, -64.26]
                ],
                "grounder": [
                    [136.55, -95.38],
                    [74.3, -64.26]
                ]
            }
        });
        scope = $rootScope.$new();
        scope.playerId = 123;
        BattingstatsCtrl = $controller('BattingstatsCtrl',
        {
            $scope: scope
        });
    }));

    it('Test for stats to be present', function()
    {
        expect(scope.statLines.length).toBe(0);
        $httpBackend.flush();
        expect(scope.currentLine).toBeTruthy();
        expect(scope.statLines.length).toBe(1);
    });

});
