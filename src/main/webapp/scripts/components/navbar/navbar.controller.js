'use strict';

angular.module('uaaUIApp')
    .controller('NavbarController', function ($scope, $state, Principal, ZoneHolder, ENV) {
        $scope.$state = $state;
        $scope.inProduction = ENV === 'prod';
        
        //revert
        Principal.identity(true);

        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.isClient = Principal.isClient;

        $scope.isZoneMode = !ZoneHolder.isUAA();
        if($scope.isZoneMode){
            ZoneHolder.current().then(function(zone){
                $scope.zone = zone;
            })
        }
    });
