'use strict';

angular.module('uaaUIApp')
    .controller('TokenController', 
    function ($scope, $rootScope, $state, $location, Setting, TokenServerProvider, TokenHolder, Principal, SSOServerProvider, AlertService) {

        if(TokenHolder.get() === null) {
            // if not token then go to homepage
            $state.go('home');
            return
        }

        $scope.setting = Setting.get();
        $scope.token = TokenHolder.getJwt().payload;

        $scope.removeToken = function(){
            TokenHolder.remove();
            Principal.authenticate(undefined)
            $state.go('home', null, { reload: true });
        }

        $scope.isSSO = Principal.isUAALogin;
        $scope.logoutUaa = function(){
            var params = {
                url: $scope.setting.url,
                clientId: $scope.setting.clientId,
                redirect_uri: $location.absUrl().replace(/#\/.*/gi, $scope.setting.authRedirectUrl)
            }
            SSOServerProvider.start_logout(params,$scope)
                .then(function(){
                    Principal.uaaLogout()
                    AlertService.success('Logout success!');
                })
        }

        $scope.isRefresh = TokenHolder.isSupportRefresh;
        $scope.refreshToken = function(){
            var param = {
                clientId: $scope.setting.clientId,
                clientSecret: $scope.setting.clientSecret,
                token: TokenHolder.get().refresh_token
            };
            TokenServerProvider.refresh(param)
                .then(function(res){
                    TokenHolder.set(res.data);
                    Principal.token(TokenHolder.getJwt().payload);
                    $scope.token = TokenHolder.getJwt().payload;
                    // $state.go('token');
                })
                .catch(function(err){
                    $scope.error = true;
                    $scope.errorMessage = err.error_description;
                })
        };

    });
