'use strict';

angular.module('uaaUIApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('ui', {
                abstract: true,
                parent: 'site'
            });
    });
