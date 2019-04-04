'use strict';

angular.module('uaaUIApp')
    .controller('ZoneManagementController', function ($scope, $state, Zone, ZoneHolder, Principal) {
        $scope.zones = [];
        $scope.loadAll = function () {
            Zone.query({}, function (result) {
                $scope.zones = result;
            });
        };

        $scope.loadAll();

        $scope.setActive = function (zone, isActivated) {
            zone.active = isActivated;
            Zone.update({id: zone.id}, zone, function (result) {
                delete result.$promise;
                delete result.$resolved;
                angular.merge(zone,result);
            });
        };

        $scope.canChangeZone = function (zone) {
            return zone !== 'uaa';
        };

        $scope.clear = function () {
            $scope.zone = {};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });
