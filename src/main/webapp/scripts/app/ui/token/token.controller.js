'use strict';

angular.module('uaaUIApp')
    .controller('TokenController', 
    function ($scope, $rootScope, $state, $location, 
        TokenServerProvider, TokenHolder, Principal, 
        SSOServerProvider, AutoLogin, Setting, AlertService) {

        if(TokenHolder.get() === null) {
            // if not token then go to homepage
            $state.go('home');
            return;
        }

        $scope.setting = Setting.get();
        $scope.token = TokenHolder.getJwt().payload;

        $scope.removeToken = function(){
            TokenHolder.remove();
            Principal.authenticate(undefined);
            $state.go('home', null, { reload: true });
        };

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
                    AlertService.success('<strong>UI: </strong>Refresh success!');
                })
                .catch(function(err){
                    $scope.error = true;
                    $scope.errorMessage = err.error_description;
                });
        };

        
        $scope.isSSO = Principal.isUAALogin;
        $scope.logoutUaa = function(){
            var params = {
                url: $scope.setting.url,
                clientId: $scope.setting.clientId,
                redirect_uri: $location.absUrl().replace(/#\/.*/gi, $scope.setting.authRedirectUrl)
            };
            SSOServerProvider.start_logout(params,$scope)
                .then(function(){
                    Principal.uaaLogin(false);
                    AlertService.success('<strong>UI: </strong>Logout success!');
                });
        };
        $scope.sso = {
            username: $scope.setting.username,
            password: $scope.setting.password
        };
        $scope.loginUaa = function(){
            AutoLogin.code({
                url: $scope.setting.url,
                clientId: $scope.setting.clientId,
                clientSecret: $scope.setting.clientSecret,
                username: $scope.sso.username,
                password: $scope.sso.password
            }).then(function(res){
                SSOServerProvider.start_autologin({
                    url: $scope.setting.url,
                    code: res.data.code,
                    clientId: $scope.setting.clientId
                });
                Principal.uaaLogin(true);
                AlertService.warning('<strong>UI: </strong>Unable to get login status, default is login!');
            }).catch(function(res){
                AlertService.error(res.data.error_description);
            });
        };

        $scope.checkUaaSSO = function(){
            var setting = Setting.get();
            //https://github.com/cloudfoundry/uaa/issues/950
            var userId = $scope.token.user_id;
            if(setting.sessionCheckUrl === 'session_management'){
                var res = sjcl.hash.sha256.hash(setting.clientId +
                    ' ' + window.location.origin +
                    ' ' + userId +
                    ' ' + 'ui');
                userId = sjcl.codec.hex.fromBits(res) + "." + 'ui';
            }

            SSOServerProvider.start_session({
                url: setting.url + setting.sessionCheckUrl,
                clientId: setting.clientId,
                messageOrigin: window.location.origin,
                userId: userId
            },$scope)
            .then(function(data){
                if(data.text === 'changed'){
                    Principal.uaaLogin(false);
                }else{
                    Principal.uaaLogin(true);
                }
            });
        };

    });
