'use strict';

angular.module('uaaUIApp')
    .factory('Healthz', function ($resource) {
        //this api cant cors
        return $resource('api/healthz', {}, {
                'get': { method: 'GET' }
            });
        });

