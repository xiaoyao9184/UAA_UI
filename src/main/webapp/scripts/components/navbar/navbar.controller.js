'use strict';

angular.module('uaaUIApp')
    .controller('NavbarController', function ($scope, $state, Principal, TokenHolder, ZoneHolder, ENV) {
        $scope.$state = $state;
        $scope.inProduction = ENV === 'prod';
        
        
        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.isClient = Principal.isClient;

        $scope.isZoneMode = !ZoneHolder.isUAA();
        
        //revert
        Principal.token(TokenHolder.getJwt().payload);

        ZoneHolder.current().then(function(zone){
            $scope.zone = zone;
            Principal.zone(zone);
            if(Principal.isSwitchingZone()){
                return;
            }
            Principal.identity(true)
                .catch(function() {
                    if($state.current.name !== 'home' && 
                        $state.current.parent !== 'home' ){
                        $state.go('home');
                    }
                });
        });
    });
