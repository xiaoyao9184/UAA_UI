'use strict';

angular.module('uaaUIApp')
    .factory('Token', function ($resource) {
        return $resource('api/oauth/token/:action/:target/:id/:target2/:id2', {}, {
                'userList': { method: 'GET', isArray: true, params: { action: 'list', target: 'user' }},
                'userRevoke': { method: 'GET', params: { action: 'revoke', target: 'user' }},
                'clientList': { method: 'GET', isArray: true, params: { action: 'list', target: 'client' }},
                'clientRevoke': { method: 'GET', params: { action: 'revoke', target: 'client' }},
                'userClientRevoke': { method:'POST', 
                    params: { action: 'revoke', target: 'user', target2: 'client' }},
                'revoke': { method:'DELETE', params: { action: 'revoke' }}
            });
        });

        