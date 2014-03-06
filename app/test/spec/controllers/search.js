'use strict';

describe('Controller: SearchCtrl', function()
{

    // load the controller's module
    beforeEach(module('pitchfxApp'));

    var SearchCtrl, scope, $httpBackend;

    // Initialize the controller and a mock scope
    beforeEach(inject(function(_$httpBackend_, $controller, $rootScope)
    {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('/api/players?search=test&size=10').respond([
        {
            "_id": "52ea6a0135d384be390e8a98",
            "first": "Renyel",
            "last": "Pinto",
            "id": 430594
        },
        {
            "_id": "52ea94c4ccd240a2510f982a",
            "first": "Josmil",
            "last": "Pinto",
            "id": 500887
        }]);
        scope = $rootScope.$new();
        SearchCtrl = $controller('SearchCtrl',
        {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function()
    {
        expect(scope.playersLoading).toBe(false);
        var result = scope.searchPlayers('test');
        expect(scope.playersLoading).toBe(true);
        $httpBackend.flush();
        expect(scope.playersLoading).toBe(false);
        result.then(function(players)
        {
            expect(players.length).toBe(2);
        });
    });
});
