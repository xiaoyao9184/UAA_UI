'use strict';

angular.module('uaaUIApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('saml-service-provider', {
                parent: 'uaa',
                url: '/saml-service-provider',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'SAMLServiceProvider@UaaUI'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/uaa/saml-service-provider/saml-service-provider.html',
                        controller: 'SAMLServiceProviderController'
                    }
                },
                resolve: {
                    
                }
            })
            .state('saml-service-provider-detail', {
                parent: 'uaa',
                url: '/saml-service-provider/:id/:type',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'SAMLServiceProviderDetail@UaaUI'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/uaa/saml-service-provider/saml-service-provider-detail.html',
                        controller: 'SAMLServiceProviderDetailController'
                    }
                },
                resolve: {
                    
                }
            })
            .state('saml-service-provider.new', {
                parent: 'saml-service-provider',
                url: '/new',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', function($state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/saml-service-provider/saml-service-provider-edit.html',
                        controller: 'SAMLServiceProviderEditController',
                        size: 'lg',
                        resolve: {
                            entity: function (SAMLServiceProvider) {
                                return new SAMLServiceProvider();
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('saml-service-provider', null, { reload: true });
                    }, function() {
                        $state.go('saml-service-provider');
                    })
                }]
            })
            .state('saml-service-provider.edit', {
                parent: 'saml-service-provider',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', '$stateParams', function($state, $uibModal, $stateParams) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/saml-service-provider/saml-service-provider-edit.html',
                        controller: 'SAMLServiceProviderEditController',
                        size: 'lg',
                        resolve: {
                            entity: function(SAMLServiceProvider) {
                                return SAMLServiceProvider.get({id : $stateParams.id});
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('saml-service-provider', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('saml-service-provider.delete', {
                parent: 'saml-service-provider',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', '$stateParams', function($state, $uibModal, $stateParams) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/saml-service-provider/saml-service-provider-delete.html',
                        controller: 'SAMLServiceProviderDeleteController',
                        size: 'md',
                        resolve: {
                            entity: function(SAMLServiceProvider) {
                                return SAMLServiceProvider.get({id : $stateParams.id});
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('saml-service-provider', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })

    });
