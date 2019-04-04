'use strict';

angular.module('uaaUIApp')
    .factory('Zone', function ($resource) {
        return $resource('api/identity-zones/:id', {}, {
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
                'delete':{ method:'DELETE'}
            });
        })
    .factory('ZoneClient', function ($resource) {
        return $resource('api/identity-zones/:id/clients/:cid', {}, {
                'save': { method:'POST' },
                'delete':{ method:'DELETE'}
            });
        });
    
