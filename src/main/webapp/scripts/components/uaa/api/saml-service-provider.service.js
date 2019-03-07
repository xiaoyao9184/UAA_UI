
'use strict';

angular.module('uaaUIApp')
    .factory('SAMLServiceProvider', function ($resource) {
        return $resource('api/saml/service-providers/:id', {}, {
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

        