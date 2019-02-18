'use strict';

angular.module('uaaUIApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('user-management', {
                parent: 'uaa',
                url: '/user-management',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'UserManagement@UaaUI'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/uaa/user-management/user-management.html',
                        controller: 'UserManagementController'
                    }
                },
                resolve: {
                    
                }
            })
            .state('user-management-detail', {
                parent: 'uaa',
                url: '/user/:id',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'UserManagementDetail@UaaUI'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/uaa/user-management/user-management-detail.html',
                        controller: 'UserManagementDetailController'
                    }
                },
                resolve: {
                    
                }
            })
            .state('user-management.new', {
                parent: 'user-management',
                url: '/new',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/user-management/user-management-edit.html',
                        controller: 'UserManagementEditController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    id: null, password: null, userName: null, 
                                    name: {
                                        familyName: null,
                                        givenName: null
                                    }, 
                                    phoneNumbers: [
                                        ""
                                    ],
                                    emails: [
                                        {
                                            value: null,
                                            primary: true
                                        }
                                    ],
                                    active: true, verified: false
                                    // , origin: null, externalId: null
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('user-management', null, { reload: true });
                    }, function() {
                        $state.go('user-management');
                    })
                }]
            })
            .state('user-management.edit', {
                parent: 'user-management',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/user-management/user-management-edit.html',
                        controller: 'UserManagementEditController',
                        size: 'lg',
                        resolve: {
                            entity: ['User', function(User) {
                                return User.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('user-management', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('user-management.delete', {
                parent: 'user-management',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/user-management/user-management-delete.html',
                        controller: 'UserManagementDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['User', function(User) {
                                return User.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('user-management', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });