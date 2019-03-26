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
                                if(angular.isUndefined($state.current.data)){
                                    $state.go('member-management', null, { reload: true });
                                }
                                return $state.current.data.paths;
                            }
                        }
                    }).result.then(function(result) {
                        var reload = result.length > 0;
                        if(reload){
                            //reload part
                            $state.reflash(result);
                            reload = false;
                        }
                        $state.go('member-management', null, { reload: reload });
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
                        var reload = result.length > 0;
                        if(reload){
                            //reload part
                            $state.reflash(result);
                            reload = false;
                        }
                        $state.go('member-management', null, { reload: reload });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
