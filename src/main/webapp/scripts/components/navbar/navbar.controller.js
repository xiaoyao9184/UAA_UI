'use strict';

angular.module('uaaUIApp')
    .controller('NavbarController', function ($scope, $state, Principal, ZoneHolder, ENV) {
        $scope.$state = $state;
        $scope.inProduction = ENV === 'prod';
        
        //revert
        Principal.identity(true)
            .catch(function() {
                if($state.current.name !== 'home' && 
                    $state.current.parent !== 'home' ){
                    $state.go('home');
                }
            });

        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.isClient = Principal.isClient;

        $scope.isZoneMode = !ZoneHolder.isUAA();
        if($scope.isZoneMode){
            ZoneHolder.current().then(function(zone){
                $scope.zone = zone;
            });
        }
    });
