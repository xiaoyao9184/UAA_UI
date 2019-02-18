'use strict';

angular.module('uaaUIApp')
    .controller('ZoneManagementController', function ($scope, $state, Zone, ZoneHolder, ParseLinks) {
        $scope.zones = [];
        // $scope.authorities = ["ROLE_USER", "ROLE_ADMIN"];

        // $scope.page = 1;
        $scope.loadAll = function () {
            Zone.query({}, function (result, headers) {
                // $scope.links = ParseLinks.parse(headers('link'));
                // $scope.totalItems = headers('X-Total-Count');
                $scope.zones = result;
            });
        };

        // $scope.loadPage = function (page) {
        //     $scope.page = page;
        //     $scope.loadAll();
        // };
        $scope.loadAll();

        $scope.setActive = function (zone, isActivated) {
            zone.active = isActivated;
            Zone.update({id: zone.id}, zone, function () {
                $scope.loadAll();
                // $scope.clear();
            });
        };

        $scope.changeZone = function (zone) {
            ZoneHolder.change(zone.id)
                .then(function(){
                    $state.go('home', null, { reload: true });
                    // $scope.loadAll();
                })
        };

        $scope.clear = function () {
            $scope.zone = {
                id: null, subdomain: null, name: null, description: null,
                active: true, config: null
            };
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });
