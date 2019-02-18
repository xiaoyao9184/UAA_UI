'use strict';

angular.module('uaaUIApp')
    .factory('TokenHolder', function apiService(localStorageService,$window) {
        return {
            set: function(token) {
                var access_token = token.access_token ? token.access_token : null;
                if(access_token) {
                    console.log('JWT:', access_token);
                    
                    var expiredAt = new Date();
                    expiredAt.setSeconds(expiredAt.getSeconds() + token.expires_in);
                    token.expires_at = expiredAt.getTime();
                    
                    localStorageService.set('token', token);
                }
            },
            get: function () {
                return localStorageService.get('token');
            },
            remove: function () {
                return localStorageService.remove('token');
            },
            parseJwt: function(token) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                return JSON.parse($window.atob(base64));
            },
            hasValidToken: function () {
                var token = this.get();
                return token && token.expires_at && token.expires_at > new Date().getTime();
            },
            getJwt: function(){
                var token = this.get()
                var jwt = token.access_token.split('.');
                
                //Base64URL to Base64
                var header = jwt[0].replace(/-/g, '+').replace(/_/g, '/');
                var payload = jwt[1].replace(/-/g, '+').replace(/_/g, '/');
                var signature = jwt[2].replace(/-/g, '+').replace(/_/g, '/');
                header = JSON.parse($window.atob(header))
                payload = JSON.parse($window.atob(payload))
                signature = $window.atob(signature)
                return {
                    header: header,
                    payload: payload,
                    signature: signature
                }
            },
            isSupportRefresh: function(){
                var token = localStorageService.get('token');
                return token !== null && 
                    angular.isDefined(token.refresh_token)
            }
        };
    });
