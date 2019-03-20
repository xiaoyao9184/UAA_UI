'use strict';

angular.module('uaaUIApp')
    .controller('ZoneManagementController', function ($scope, $state, Zone, ZoneHolder) {
        $scope.zones = [];
        $scope.loadAll = function () {
            Zone.query({}, function (result) {
                $scope.zones = result;
            });
        };

        $scope.loadAll();

        $scope.setActive = function (zone, isActivated) {
            zone.active = isActivated;
            Zone.update({id: zone.id}, zone, function () {
                $scope.loadAll();
            });
        };

        $scope.changeZone = function (zone) {
            ZoneHolder.change(zone.id)
                .then(function(){
                    $state.go('home', null, { reload: true });
                })
        };

        $scope.clear = function () {
            $scope.zone = {};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });
