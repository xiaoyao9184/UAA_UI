'use strict';

angular.module('uaaUIApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('member-management', {
                parent: 'uaa',
                url: '/{gid}/member-management',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'MemberManagement@UaaUI'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/uaa/member-management/member-management.html',
                        controller: 'MemberManagementController'
                    }
                },
                resolve: {
                    group: function($stateParams, Group) {
                        return Group.get({id : $stateParams.gid});
                    }
                }
            })
            .state('member-management.add', {
                parent: 'member-management',
                url: '/new',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', function($state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/member-management/member-management-add.html',
                        controller: 'MemberManagementAddController',
                        size: 'lg',
                        resolve: {
                            paths: function () {
                                return $state.current.data.paths;
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('member-management', null, { reload: false });
                    }, function() {
                        $state.go('member-management');
                    })
                }]
            })
            .state('member-management.delete', {
                parent: 'member-management',
                url: '/delete',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', function($state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/member-management/member-management-delete.html',
                        controller: 'MemberManagementDeleteController',
                        size: 'md',
                        resolve: {
                            paths: function () {
                                return $state.current.data.paths;
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('member-management', null, { reload: false });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
