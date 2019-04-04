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
        
        
        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.isClient = Principal.isClient;


        $scope.isZoneMode = !ZoneHolder.isUAA();

        $scope.isSwitchingZone = Principal.isSwitchingZone;
        $scope.exitZoneMode = function(){
            ZoneHolder.reset();
            $state.go('home', null, { reload: true });
        };

        
        ZoneHolder.current().then(function(zone){
            $scope.zone = zone;
            if(!$scope.isSwitchingZone()){
                UAAServerProvider.info(true);
            }
        });
        Principal.userName().then(function(userName){
            $scope.userName = userName;
        });
    });
