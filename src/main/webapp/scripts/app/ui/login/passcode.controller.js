'use strict';

angular.module('uaaUIApp').controller('LoginPasscodeController',
    // ['$scope', '$state', '$stateParams', 'Setting', 'TokenServerProvider', 'SSOServerProvider', 'TokenHolder', 'Principal',
        function($scope, $state, $stateParams, Setting, 
        TokenServerProvider, SSOServerProvider, TokenHolder, Principal) {

        $scope.setting = Setting.get();
        $scope.uaa = {
            url: $scope.setting.url,
            clientId: $scope.setting.clientId,
            clientSecret: $scope.setting.clientSecret
        };

        $scope.goPasscode = function(){
            SSOServerProvider.start_passcode({
                url: Setting.get().url
            });
        };
        $scope.pastePasscode = function(){
            navigator.clipboard.readText()
                .then(function(text){
                    $scope.uaa.passcode = text;
                    $scope.$apply();
                })
                .catch(function(err){
                    $scope.error = true;
                    $scope.errorMessage = 'Failed to read clipboard contents: ' + err;
                });
        };

        $scope.login = function(){
            TokenServerProvider.passcode($scope.uaa)
                .then(function(res){
                    TokenHolder.set(res.data);
                    Principal.token(TokenHolder.getJwt().payload);
                    Principal.uaaLogin(true);
                    $state.go('token');
                })
                .catch(function(err){
                    $scope.error = true;
                    $scope.errorMessage = err.error_description;
                });
        };
});