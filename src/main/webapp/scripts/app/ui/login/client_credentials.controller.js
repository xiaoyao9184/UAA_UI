'use strict';

angular.module('uaaUIApp').controller('LoginClientCredentialsController',
    ['$scope', '$state', '$stateParams', 'Setting', 'TokenServerProvider', 'TokenHolder', 'Principal',
        function($scope, $state, $stateParams, Setting, TokenServerProvider, TokenHolder, Principal) {

        $scope.setting = Setting.get();
        $scope.uaa = {
            url: $scope.setting.url,
            clientId: $scope.setting.clientId,
            clientSecret: $scope.setting.clientSecret
        };

        $scope.login = function(){
            TokenServerProvider.client($scope.uaa)
                .then(function(res){
                    TokenHolder.set(res.data);
                    Principal.token(TokenHolder.getJwt().payload);
                    $state.go('token');
                })
                .catch(function(err){
                    $scope.error = true;
                    $scope.errorMessage = err.error_description;
                });
        };
}]);