'use strict';

angular.module('uaaUIApp').controller('LoginImplicitController',
    ['$scope', '$state', '$stateParams', '$location', 'Setting', 'TokenServerProvider', 'TokenHolder', 'Principal',
        function($scope, $state, $stateParams, $location, Setting, TokenServerProvider, TokenHolder, Principal) {

        $scope.setting = Setting.get()
        $scope.uaa = {
            url: $scope.setting.url,
            clientId: $scope.setting.clientId,
            redirect_uri: $location.absUrl().replace(/#\/.*/gi, $scope.setting.authRedirectUrl),
            state: ""
        }

        $scope.login = function(){
            $scope.uaa.auth_url = $scope.setting.url + $scope.setting.authUrlPath
            TokenServerProvider.start_implicit($scope.uaa,$scope)
                .then(function(token){
                    TokenHolder.set(token);
                    Principal.token(TokenHolder.getJwt().payload);
                    $state.go('token');
                })
                .catch(function(err){
                    $scope.error = true;
                    $scope.errorMessage = err.error_description;
                })
        }
}]);