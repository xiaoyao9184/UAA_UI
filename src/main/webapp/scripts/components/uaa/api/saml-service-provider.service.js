
'use strict';

angular.module('uaaUIApp')
    .factory('SAMLServiceProvider', function ($resource) {
        var transformRequest = function(data) {
            data.config = angular.toJson(data.config);
            return angular.toJson(data);
        }
        var transformResponse = function(json) {
            var data = angular.fromJson(json);
            data.config = angular.fromJson(data.config);
            return data;
        }
        var transformResponses = function(json) {
            var list = angular.fromJson(json);
            angular.forEach(list, function(data){
                data.config = angular.fromJson(data.config);
            });
            return list;
        }
        
        return $resource('api/saml/service-providers/:id', {}, {
                'query': {
                    method: 'GET', 
                    transformResponse: transformResponses,
                    isArray: true
                },
                'get': { 
                    method: 'GET',
                    transformResponse: transformResponse
                },
                'save': { 
                    method:'POST',
                    transformRequest: transformRequest
                },
                'update': { 
                    method:'PUT',
                    transformRequest: transformRequest
                },
                'delete':{ method:'DELETE' }
            });
        });

        