'use strict';

angular.module('uaaUIApp')
    .factory('Passcode', function ($resource) {
        //this api is page
        return $resource('api/passcode', {}, {
                'get': { method: 'GET' }
            });
        });

