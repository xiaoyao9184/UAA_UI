'use strict';

angular.module('uaaUIApp')
    .factory('UserInfo', function ($resource) {
        return $resource('api/userinfo', {}, {
                'get': { method: 'GET', alert: false }
            });
        });

