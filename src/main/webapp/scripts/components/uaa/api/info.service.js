'use strict';

angular.module('uaaUIApp')
    .factory('Info', function ($resource) {
        return $resource('api/info', {}, {
                'get': { method: 'GET', alert: false }
            });
        });

