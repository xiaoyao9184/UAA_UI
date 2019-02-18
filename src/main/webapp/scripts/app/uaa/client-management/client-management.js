'use strict';

angular.module('uaaUIApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('client-management', {
                parent: 'uaa',
                url: '/client-management',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'ClientManagement@UaaUI'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/uaa/client-management/client-management.html',
                        controller: 'ClientManagementController'
                    }
                },
                resolve: {
                    
                }
            })
            .state('client-management-detail', {
                parent: 'uaa',
                url: '/client/:id',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'ClientManagementDetail@UaaUI'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/uaa/client-management/client-management-detail.html',
                        controller: 'ClientManagementDetailController'
                    }
                },
                resolve: {
                    
                }
            })
            .state('client-management.new', {
                parent: 'client-management',
                url: '/new',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/client-management/client-management-edit.html',
                        controller: 'ClientManagementEditController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    client_id: null, client_secret: null,  
                                    authorized_grant_types: [], 
                                    redirect_uri: []
                                };
                            },
                            mode: function() {
                                return 'new'
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('client-management', null, { reload: true });
                    }, function() {
                        $state.go('client-management');
                    })
                }]
            })
            .state('client-management.edit', {
                parent: 'client-management',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/client-management/client-management-edit.html',
                        controller: 'ClientManagementEditController',
                        size: 'lg',
                        resolve: {
                            entity: ['Client', function(Client) {
                                return Client.get({id : $stateParams.id});
                            }],
                            mode: function() {
                                return 'edit'
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('client-management', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('client-management.delete', {
                parent: 'client-management',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/client-management/client-management-delete.html',
                        controller: 'ClientManagementDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['Client', function(Client) {
                                return Client.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('client-management', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('client-management.meta', {
                parent: 'client-management',
                url: '/{id}/meta',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/client-management/client-management-meta.html',
                        controller: 'ClientManagementMetaController',
                        size: 'lg',
                        resolve: {
                            entity: ['ClientMeta', function(ClientMeta) {
                                return ClientMeta.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('client-management', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
    });
