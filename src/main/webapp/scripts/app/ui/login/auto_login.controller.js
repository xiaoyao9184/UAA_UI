'use strict';

angular.module('uaaUIApp').controller('LoginAutoLoginController',
    ['$scope', '$state', '$stateParams', '$location', 'Setting', 'TokenServerProvider', 'TokenHolder', 'Principal', 'AutoLogin',
        function($scope, $state, $stateParams, $location, Setting, TokenServerProvider, TokenHolder, Principal, AutoLogin) {

        $scope.setting = Setting.get();
        $scope.uaa = {
            url: $scope.setting.url,
            clientId: $scope.setting.clientId,
            clientSecret: $scope.setting.clientSecret,
            redirect_uri: $location.absUrl().replace(/#\/.*/gi, $scope.setting.authRedirectUrl),
            state: '',
            username: $scope.setting.username,
            password: $scope.setting.password
        };

        $scope.login = function(){
            AutoLogin.code($scope.uaa)
                .then(function(res){
                    $scope.uaa.auth_url = res.data.path.replace(/^\//gi,$scope.setting.url);
                    $scope.uaa.code = res.data.code;
                    // $scope.uaa.response_type = 'code,code=' + res.data.code
                    TokenServerProvider.start_authorization_code($scope.uaa,$scope)
                        .then(function(token){
                            TokenHolder.set(token);
                            Principal.token(TokenHolder.getJwt().payload);
                            $state.go('token');
                        })
                        .catch(function(err){
                            $scope.error = true;
                            $scope.errorMessage = err.error_description;
                        });
                });
        };
}]);