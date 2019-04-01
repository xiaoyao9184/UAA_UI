'use strict';

angular.module('uaaUIApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('token-client', {
                parent: 'client-management-detail',
                params: {
                    type: 'client'
                },
                data: {
                    previous: false
                },
                views: {
                    'token': {
                        templateUrl: 'scripts/app/uaa/token-management/token-management.html',
                        controller: 'TokenManagementController'
                    }
                }
            })
            .state('token-user', {
                parent: 'user-management-detail',
                params: {
                    type: 'user'
                },
                data: {
                    previous: false
                },
                views: {
                    'token': {
                        templateUrl: 'scripts/app/uaa/token-management/token-management.html',
                        controller: 'TokenManagementController'
                    }
                }
            });
    });
