'use strict';

angular.module('uaaUIApp').controller('LoginPasswordController',
    ['$scope', '$state', '$stateParams', 'Setting', 'TokenServerProvider', 'TokenHolder', 'Principal',
        function($scope, $state, $stateParams, Setting, TokenServerProvider, TokenHolder, Principal) {

        $scope.setting = Setting.get();
        $scope.uaa = {
            url: $scope.setting.url,
            clientId: $scope.setting.clientId,
            clientSecret: $scope.setting.clientSecret,
            username: $scope.setting.username,
            password: $scope.setting.password
        };

        $scope.login = function(){
            TokenServerProvider.password($scope.uaa)
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