'use strict';

angular.module('uaaUIApp')
    .controller('NavbarController', function ($scope, $state, Principal, ZoneHolder, ENV) {
        $scope.$state = $state;
        $scope.inProduction = ENV === 'prod';

        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.isClient = Principal.isClient;

        $scope.isZoneMode = !ZoneHolder.isUAA();
        if($scope.isZoneMode){
            ZoneHolder.name().then(function(name){
                $scope.zoneName = name;
            })
        }
        
        $scope.exitZoneMode = function(){
            ZoneHolder.reset();
            $scope.isZoneMode = false;
            $scope.zoneName = 'uaa';
            $state.go('home', null, { reload: true });
        };
    });
