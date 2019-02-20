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
                // only login as user
                'change': { 
                    method:'PUT',
                    headers: {
                        "Authorization": function(config) {
                            if(angular.isUndefined(config.data.token)){
                                return null;
                            }
                            var auth = 'Bearer ' + config.data.token
                            return auth;
                        }
                    },
                    transformRequest: function(data) {
                        // you can delete the variable if you don't want it sent to the backend
                        // delete data['old_secret'];
                        delete data['token'];
                        // transform payload before sending
                        return JSON.stringify(data);
                    }
                }
            });
        })
    .factory('UserStatus', function ($resource) {
        return $resource('api/Users/:id/status', {}, {
                'change': { method:'PATCH' }
            });
        });