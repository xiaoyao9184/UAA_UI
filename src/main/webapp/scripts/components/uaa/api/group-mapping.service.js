'use strict';

angular.module('uaaUIApp')
    .factory('GroupMapping', function ($resource) {
        return $resource('api/Groups/External', {}, {
                'save': { method:'POST' },
                'query': { method: 'GET', isArray: false }
            });
        })
    .factory('GroupMappingById', function ($resource) {
        return $resource('api/Groups/External/groupId/:groupId/externalGroup/:externalGroup/origin/:origin', {}, {
                'delete':{ method:'DELETE' }
            });
        })
    .factory('GroupMappingByDisplay', function ($resource) {
        return $resource('api/Groups/External/displayName/:displayName/externalGroup/:externalGroup/origin/:origin', {}, {
                'delete':{ method:'DELETE' }
            });
        });
