'use strict';

angular.module('uaaUIApp')
    .controller('AuthRedirectController', 
        function ($scope,$window,$state,$stateParams,TokenServerProvider,TokenHolder,Principal) {

        $scope.error = null;
        $scope.errorMessage = '';

        TokenServerProvider.end_redirect($scope,$window,$stateParams)
            .then(function(data){
                TokenServerProvider.end_data(data)
                    .then(function(token){
                        TokenHolder.set(token);
                        Principal.token(token);
                        $state.go('token');
                    })
                    .catch(function(err){
                        $scope.error = true;
                        $scope.errorMessage = "Error with data to token" + angular.toJson(data);
                    })
            })
            .catch(function(err){
                $scope.error = err.error;
                $scope.errorMessage = err.error_description;
            })
    });
