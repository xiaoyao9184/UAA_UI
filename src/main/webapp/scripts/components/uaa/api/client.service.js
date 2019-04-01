'use strict';

angular.module('uaaUIApp')
    .factory('Client', function ($resource) {
        var transformRequest = function(data) {
            if(data.allowedproviders != null &&
                data.allowedproviders.length == 0){
                //https://github.com/cloudfoundry/uaa/blob/b9f228091ee9856129b157c9f908978549e8ca37/server/src/main/java/org/cloudfoundry/identity/uaa/oauth/UaaAuthorizationRequestManager.java#L222-L227
                delete data.allowedproviders;
            }
            return angular.toJson(data);
        };

        return $resource('api/oauth/clients/:id', {}, {
                'query': { method: 'GET', isArray: false},
                'get': { method: 'GET' },
                'save': { 
                    method:'POST',
                    transformRequest: transformRequest
                },
                'update': { 
                    method:'PUT',
                    transformRequest: transformRequest
                },
                'delete':{ method:'DELETE'}
            });
        })
    .factory('ClientSecret', function ($resource, Base64) {
        return $resource('api/oauth/clients/:id/secret', {}, {
                // only login as user
                'change': { 
                    method:'PUT',
                    headers: {
                        "Authorization": function(config) {
                            // var up = config.data.clientId + ':' + config.data.old_secret
                            // var auth = 'Basic ' + Base64.encode(up)
                            // // access variable via config.data
                            // return auth;

                            if(angular.isUndefined(config.data.token)){
                                return null;
                            }
                            var auth = 'Bearer ' + config.data.token;
                            return auth;
                        }
                    },
                    transformRequest: function(data) {
                        // you can delete the variable if you don't want it sent to the backend
                        // delete data['old_secret'];
                        delete data.token;
                        // transform payload before sending
                        return angular.fromJson(data);
                    }
                }
            });
        })
    .factory('ClientMeta', function ($resource) {
        return $resource('api/oauth/clients/:id/meta', {}, {
                'query': {method: 'GET', isArray: true},
                'get': {
                    method: 'GET',
                    transformResponse: function (data) {
                        data = angular.fromJson(data);
                        return data;
                    }
                },
                'update': { method:'PUT' }
            });
        });
