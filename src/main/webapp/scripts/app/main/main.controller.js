'use strict';

angular.module('uaaUIApp')
    .controller('MainController', function ($scope, $state, $sce, Setting,UAAServerProvider,Principal) {

        $scope.error = null;
        $scope.errorMessage = '';

        $scope.setting = Setting.get()

        if($state.current.name !== $scope.setting.loginType){
            $state.go($scope.setting.loginType)
        }

        $scope.url_healthz = $sce.trustAsResourceUrl($scope.setting.url + 'healthz');
        UAAServerProvider.info();
        $scope.isHealthy = UAAServerProvider.isHealthy
        
        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.isClient = Principal.isClient;
        Principal.userName().then(function(userName){
            $scope.userName = userName;
        });
    });
