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
                    entity: function(Zone, $stateParams) {
                        return Zone.get({id : $stateParams.id});
                    }
                }
            })
            .state('zone-management.new', {
                parent: 'zone-management',
                url: '/new',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', function($state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/zone-management/zone-management-edit.html',
                        controller: 'ZoneManagementEditController',
                        size: 'lg',
                        resolve: {
                            entity: function (Zone) {
                                return new Zone();
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('zone-management', null, { reload: true });
                    }, function() {
                        $state.go('zone-management');
                    });
                }]
            })
            .state('zone-management.edit', {
                parent: 'zone-management',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', '$stateParams', function($state, $uibModal, $stateParams) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/zone-management/zone-management-edit.html',
                        controller: 'ZoneManagementEditController',
                        size: 'lg',
                        resolve: {
                            entity: function(Zone) {
                                return Zone.get({id : $stateParams.id});
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('zone-management', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    });
                }]
            })
            .state('zone-management.delete', {
                parent: 'zone-management',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', '$stateParams', function($state, $uibModal, $stateParams) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/zone-management/zone-management-delete.html',
                        controller: 'ZoneManagementDeleteController',
                        size: 'md',
                        resolve: {
                            entity: function(Zone) {
                                return Zone.get({id : $stateParams.id});
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('zone-management', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    });
                }]
            })
            .state('zone-management.change', {
                parent: 'zone-management',
                url: '/{id}/change',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', '$stateParams', function($state, $uibModal, $stateParams) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/zone-management/zone-management-change.html',
                        controller: 'ZoneManagementChangeController',
                        size: 'md',
                        resolve: {
                            entity: function(Zone) {
                                return Zone.get({id : $stateParams.id});
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('home', null, result);
                    }, function() {
                        $state.go('^');
                    });
                }]
            })
            .state('zone-management-detail.edit', {
                parent: 'zone-management-detail',
                url: '/zone/:id/edit',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', '$stateParams', function($state, $uibModal, $stateParams) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/zone-management/zone-management-edit.html',
                        controller: 'ZoneManagementEditController',
                        size: 'lg',
                        resolve: {
                            entity: function(Zone) {
                                return Zone.get({id : $stateParams.id});
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('zone-management-detail', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    });
                }]
            })
            .state('zone-management-detail.client', {
                parent: 'zone-management-detail',
                url: '/zone/:id/client',
                onEnter: ['$state', '$uibModal', '$stateParams', function($state, $uibModal, $stateParams) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/client-management/client-management-edit.html',
                        controller: 'ClientManagementEditController',
                        size: 'lg',
                        resolve: {
                            entity: function(Client) {
                                return new Client();
                            },
                            zoneId: function($stateParams) {
                                return $stateParams.id;
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('zone-management-detail', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    });
                }]
            });
    });
