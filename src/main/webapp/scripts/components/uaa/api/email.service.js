'use strict';

angular.module('uaaUIApp')
    .factory('Email', function ($resource) {
        return $resource('api/:action', {}, {
                'verification': {method: 'POST', params: { action: 'email_verifications' },
                    isArray: false,
                    transformResponse: function(data){
                        return {
                            code: data
                        };
                    }},
                'change': {method: 'POST', params: { action: 'email_changes' }}
            });
        });

