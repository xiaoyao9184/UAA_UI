'use strict';

angular.module('uaaUIApp')
    .factory('Password', function ($resource) {
        return $resource('api/:action', {}, {
                'reset': {method: 'POST', params: { action: 'password_resets' }},
                'change': {method: 'POST', params: { action: 'password_change' }}
            });
        });

