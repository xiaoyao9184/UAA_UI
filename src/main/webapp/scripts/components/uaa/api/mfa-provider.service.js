
'use strict';

angular.module('uaaUIApp')
    .factory('MFAProvider', function ($resource) {
        return $resource('api/mfa-providers/:id', {}, {
                'query': {method: 'GET', isArray: true},
                'get': {
                    method: 'GET',
                    transformResponse: function (data) {
                        data = angular.fromJson(data);
                        return data;
                    }
                },
                'save': { method:'POST' },
                'update': { method:'PUT' },
                'delete':{ method:'DELETE' }
            });
        });

        