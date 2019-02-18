'use strict';

angular.module('uaaUIApp')
    .factory('zoneInterceptor', function ($rootScope, $q, $location, localStorageService) {
        return {
            // Add X-Identity-Zone-Id and X-Identity-Zone-Subdomain to headers
            request: function (config) {
                if (config.url.indexOf('api') !== 0) {
                    return config;
                }
                var zone = localStorageService.get("zone")
                if(zone !== null &&
                    zone.id !== 'uaa'){
                    config.headers['X-Identity-Zone-Id'] = zone.id;
                    config.headers['X-Identity-Zone-Subdomain'] = zone.subdomain;
                }
                return config;
            }
        };
    });
    
