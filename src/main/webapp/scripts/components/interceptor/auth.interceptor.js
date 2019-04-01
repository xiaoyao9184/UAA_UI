'use strict';

angular.module('uaaUIApp')
    .factory('authInterceptor', function (localStorageService, Setting) {
        return {
            // Add authorization token to headers
            request: function (config) {
                if (config.url.indexOf('api') !== 0) {
                    return config;
                }

                config.url = config.url.replace("api/", Setting.get().url);
                config.headers = config.headers || {};
                
                var token = localStorageService.get('token');
                // var token = $rootScope.uaatokendetails;
                // var expiredAt = new Date();
                // expiredAt.setSeconds(expiredAt.getSeconds() + token.expires_in);
                // token.expires_at = expiredAt.getTime();

                if (typeof config.headers.Authorization === 'undefined' &&
                    token && 
                    token.expires_at && 
                    token.expires_at > new Date().getTime()) {
                    config.headers.Authorization = 'Bearer ' + token.access_token;
                }
                
                return config;
            }
        };
    })
    .factory('authExpiredInterceptor', function ($rootScope, $q, $injector, localStorageService) {
        return {
            responseError: function (response) {
                // token has expired
                if (response.config.removeIfError === true &&
                    response.status === 401 && 
                    (response.data.error == 'invalid_token' || response.data.error == 'unauthorized')) {
                    localStorageService.remove('token');
                    var Principal = $injector.get('Principal');
                    if (Principal.isAuthenticated()) {
                        Principal.authenticate(undefined);
                    }
                }
                return $q.reject(response);
            }
        };
    });
