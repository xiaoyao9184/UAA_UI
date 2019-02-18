'use strict';

angular.module('uaaUIApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('token', {
                parent: 'uaa',
                url: '/token',
                data: {
                    authorities: [],
                    pageTitle: 'TokenDetails@UaaUI'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/ui/token/token.html',
                        controller: 'TokenController'
                    }
                }

            });
    });
