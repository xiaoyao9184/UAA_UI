'use strict';

angular.module('uaaUIApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('mfa-provider', {
                parent: 'uaa',
                url: '/mfa-provider',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'MFAProvider@UaaUI'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/uaa/mfa-provider/mfa-provider.html',
                        controller: 'MFAProviderController'
                    }
                },
                resolve: {
                    
                }
            })
            .state('mfa-provider-detail', {
                parent: 'uaa',
                url: '/mfa-provider/:id/:type',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'MFAProviderDetail@UaaUI'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/uaa/mfa-provider/mfa-provider-detail.html',
                        controller: 'MFAProviderDetailController'
                    }
                },
                resolve: {
                    
                }
            })
            .state('mfa-provider.new', {
                parent: 'mfa-provider',
                url: '/new',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', function($state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/mfa-provider/mfa-provider-edit.html',
                        controller: 'MFAProviderEditController',
                        size: 'lg',
                        resolve: {
                            entity: function (MFAProvider) {
                                return new MFAProvider();
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('mfa-provider', null, { reload: true });
                    }, function() {
                        $state.go('mfa-provider');
                    });
                }]
            })
            .state('mfa-provider.delete', {
                parent: 'mfa-provider',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', '$stateParams', function($state, $uibModal, $stateParams) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/mfa-provider/mfa-provider-delete.html',
                        controller: 'MFAProviderDeleteController',
                        size: 'md',
                        resolve: {
                            entity: function(MFAProvider) {
                                return MFAProvider.get({id : $stateParams.id});
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('mfa-provider', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    });
                }]
            });

    });
