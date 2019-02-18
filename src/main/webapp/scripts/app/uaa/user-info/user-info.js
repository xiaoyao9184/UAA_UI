'use strict';

angular.module('uaaUIApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('user-info', {
                parent: 'uaa',
                url: '/user-info',
                data: {
                    authorities: [],
                    pageTitle: 'UserInfo@UaaUI'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/uaa/user-info/user-info.html',
                        controller: 'UserInfoController'
                    }
                }

            });
    });
