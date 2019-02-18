'use strict';

angular.module('uaaUIApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('server-info', {
                parent: 'uaa',
                url: '/server-info',
                data: {
                    authorities: [],
                    pageTitle: 'ServerInfo@UaaUI'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/uaa/server-info/server-info.html',
                        controller: 'ServerInfoController'
                    }
                }

            });
    });
