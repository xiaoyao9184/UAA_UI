'use strict';

angular.module('uaaUIApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('group-management', {
                parent: 'uaa',
                url: '/group-management?search',
                params: {
                    search: ''
                },
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'GroupManagement@UaaUI'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/uaa/group-management/group-management.html',
                        controller: 'GroupManagementController'
                    }
                },
                resolve: {
                    
                }
            })
            .state('group-management-detail', {
                parent: 'uaa',
                url: '/group/:id',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'GroupManagementDetail@UaaUI'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/uaa/group-management/group-management-detail.html',
                        controller: 'GroupManagementDetailController'
                    }
                },
                resolve: {
                    
                }
            })
            .state('group-management.new', {
                parent: 'group-management',
                url: '/new',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', function($state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/group-management/group-management-edit.html',
                        controller: 'GroupManagementEditController',
                        size: 'lg',
                        resolve: {
                            entity: function (Group) {
                                return new Group();
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('group-management', null, { reload: true });
                    }, function() {
                        $state.go('group-management');
                    });
                }]
            })
            .state('group-management.edit', {
                parent: 'group-management',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', '$stateParams', function($state, $uibModal, $stateParams) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/group-management/group-management-edit.html',
                        controller: 'GroupManagementEditController',
                        size: 'lg',
                        resolve: {
                            entity: function(Group) {
                                return Group.get({id : $stateParams.id});
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('group-management', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    });
                }]
            })
            .state('group-management.delete', {
                parent: 'group-management',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', '$stateParams', function($state, $uibModal, $stateParams) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/group-management/group-management-delete.html',
                        controller: 'GroupManagementDeleteController',
                        size: 'md',
                        resolve: {
                            entity: function(Group) {
                                return Group.get({id : $stateParams.id});
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('group-management', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    });
                }]
            });
    });
