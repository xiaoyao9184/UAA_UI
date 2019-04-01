'use strict';

angular.module('uaaUIApp')
    .factory('AutoLogin', function ($http, Base64) {
        return {
            code: function(credentials) {
                var data = "username=" +  encodeURIComponent(credentials.username) + 
                    "&password=" + encodeURIComponent(credentials.password);
                return $http.post('api/autologin', data, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Accept": "application/json",
                        "Authorization": "Basic " + Base64.encode(credentials.clientId + ':' + credentials.clientSecret)
                    }
                });
            },
        };
    });

