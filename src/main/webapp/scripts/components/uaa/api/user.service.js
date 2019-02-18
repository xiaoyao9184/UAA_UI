'use strict';

angular.module('uaaUIApp')
    .factory('User', function ($resource) {
        return $resource('api/Users/:id', {}, {
                'query': {method: 'GET', isArray: false},
                'get': {
                    method: 'GET',
                    transformResponse: function (data) {
                        data = angular.fromJson(data);
                        return data;
                    }
                },
                'save': { method:'POST' },
                'update': { 
                    method:'PUT',
                    headers : {
                        'if-match': function(config) {
                            return config.data.meta.version;
                        }
                    },
                },
                'delete':{ method:'DELETE'}
            });
        })
    .factory('UserPassword', function ($resource) {
        return $resource('api/Users/:id/password', {}, {
                'change': { method:'PUT' }
            });
        });