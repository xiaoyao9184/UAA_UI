'use strict';

angular.module('uaaUIApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('zone-management', {
                parent: 'uaa',
                url: '/zone-management',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'ZoneManagement@UaaUI'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/uaa/zone-management/zone-management.html',
                        controller: 'ZoneManagementController'
                    }
                },
                resolve: {
                    
                }
            })
            .state('zone-management-detail', {
                parent: 'uaa',
                url: '/zone/:id',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'ZoneManagementDetail@UaaUI'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/uaa/zone-management/zone-management-detail.html',
                        controller: 'ZoneManagementDetailController'
                    }
                },
                resolve: {
                    
                }
            })
            .state('zone-management.new', {
                parent: 'zone-management',
                url: '/new',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/zone-management/zone-management-edit.html',
                        controller: 'ZoneManagementEditController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    id: null, subdomain: null, name: null, description: null,
                                    active: true, config: null
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('zone-management', null, { reload: true });
                    }, function() {
                        $state.go('zone-management');
                    })
                }]
            })
            .state('zone-management.edit', {
                parent: 'zone-management',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/zone-management/zone-management-edit.html',
                        controller: 'ZoneManagementEditController',
                        size: 'lg',
                        resolve: {
                            entity: ['Zone', function(Zone) {
                                var v = Zone.get({id : $stateParams.id})
                                v.$promise
                                    .then(function (z) {
                                        z.config = JSON.stringify(z.config);
                                    });
                                return v;
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('zone-management', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('zone-management.delete', {
                parent: 'zone-management',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/zone-management/zone-management-delete.html',
                        controller: 'ZoneManagementDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['Zone', function(Zone) {
                                return Zone.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('zone-management', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
