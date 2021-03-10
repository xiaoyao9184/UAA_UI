'use strict';

angular.module('uaaUIApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('group-mapping', {
                parent: 'uaa',
                url: '/group-mapping?search',
                params: {
                    search: ''
                },
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'GroupMapping@UaaUI'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/uaa/group-mapping/group-mapping.html',
                        controller: 'GroupMappingController'
                    }
                },
                resolve: {
                    
                }
            })
            .state('group-mapping.map', {
                parent: 'group-mapping',
                url: '/map',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', function($state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/group-mapping/group-mapping-map.html',
                        controller: 'GroupMappingMapController',
                        size: 'lg',
                        resolve: { }
                    }).result.then(function(result) {
                        $state.go('group-mapping', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    });
                }]
            })
            .state('group-mapping.unmap', {
                parent: 'group-mapping',
                url: '/unmap/{groupId}/{externalGroup}/{origin}',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', '$stateParams', function($state, $uibModal, $stateParams) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/group-mapping/group-mapping-unmap.html',
                        controller: 'GroupMappingUnmapController',
                        size: 'md',
                        resolve: {
                            entity: function() {
                                return {
                                    groupId : $stateParams.groupId,
                                    externalGroup : $stateParams.externalGroup,
                                    origin : $stateParams.origin,
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('group-mapping', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    });
                }]
            });
    });
