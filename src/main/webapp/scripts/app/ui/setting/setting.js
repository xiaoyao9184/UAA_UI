'use strict';

angular.module('uaaUIApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('setting', {
                parent: 'home',
                url: '/setting',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'Setting@UaaUI'
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/ui/setting/setting.html',
                        controller: 'SettingController',
                        size: 'lg',
                        resolve: {
                            
                        }
                    }).result.then(function(result) {
                        $state.go('home', null, { reload: true });
                    }, function() {
                        $state.go('home', null, { reload: true });
                    });
                }]
            });
    });
