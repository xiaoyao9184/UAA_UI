'use strict';

angular.module('uaaUIApp')
    .controller('MainController', 
    function ($scope, $state, $sce, Setting,UAAServerProvider,Principal,ZoneHolder) {

        $scope.error = null;
        $scope.errorMessage = '';

        $scope.setting = Setting.get();

        if($state.current.name !== $scope.setting.loginType){
            $state.go($scope.setting.loginType);
        }

        $scope.url_healthz = $sce.trustAsResourceUrl($scope.setting.url + 'healthz');
        $scope.isHealthy = UAAServerProvider.isHealthy;
        UAAServerProvider.info(true);
        
        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.isClient = Principal.isClient;
        Principal.userName().then(function(userName){
            $scope.userName = userName;
        });

        $scope.isZoneMode = !ZoneHolder.isUAA();
        if($scope.isZoneMode){
            ZoneHolder.current().then(function(zone){
                $scope.zone = zone;
            });
        }
        $scope.isSwitchingZone = function(){
            return Principal.isSwitchingZone();
        };
        $scope.exitZoneMode = function(){
            ZoneHolder.reset();
            $state.go('home', null, { reload: true });
        };
    });
