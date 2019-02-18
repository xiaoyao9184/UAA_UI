'use strict';

angular.module('uaaUIApp')
    .factory('Passcode', function ($resource) {
        return $resource('api/passcode', {}, {
                'get': { method: 'GET' }
            });
        });

