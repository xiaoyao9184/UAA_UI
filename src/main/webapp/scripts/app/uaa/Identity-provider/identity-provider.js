'use strict';

angular.module('uaaUIApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('identity-provider', {
                parent: 'uaa',
                url: '/identity-provider',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'IdentityProvider@UaaUI'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/uaa/identity-provider/identity-provider.html',
                        controller: 'IdentityProviderController'
                    }
                },
                resolve: {
                    
                }
            })
            .state('identity-provider-detail', {
                parent: 'uaa',
                url: '/identity-provider/:id/:type',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'IdentityProviderDetail@UaaUI'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/uaa/identity-provider/identity-provider-detail.html',
                        controller: 'IdentityProviderDetailController'
                    }
                },
                resolve: {
                    
                }
            })
            .state('identity-provider.new', {
                parent: 'identity-provider',
                url: '/new',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', function($state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/identity-provider/identity-provider-edit.html',
                        controller: 'IdentityProviderEditController',
                        size: 'lg',
                        resolve: {
                            entity: function (IdentityProvider) {
                                return new IdentityProvider({type:'uaa'});
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('identity-provider', null, { reload: true });
                    }, function() {
                        $state.go('identity-provider');
                    });
                }]
            })
            .state('identity-provider.edit', {
                parent: 'identity-provider',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', '$stateParams', function($state, $uibModal, $stateParams) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/identity-provider/identity-provider-edit.html',
                        controller: 'IdentityProviderEditController',
                        size: 'lg',
                        resolve: {
                            entity: function(IdentityProvider) {
                                return IdentityProvider.get({id: $stateParams.id, rawConfig: true});
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('identity-provider', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    });
                }]
            })
            .state('identity-provider.delete', {
                parent: 'identity-provider',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$state', '$uibModal', '$stateParams', function($state, $uibModal, $stateParams) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/uaa/identity-provider/identity-provider-delete.html',
                        controller: 'IdentityProviderDeleteController',
                        size: 'md',
                        resolve: {
                            entity: function(IdentityProvider) {
                                return IdentityProvider.get({id : $stateParams.id});
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('identity-provider', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    });
                }]
            })




            .state('identity-provider-detail.uaa', {
                parent: 'identity-provider-detail',
                views: {
                    'config': {
                        templateUrl: 'scripts/app/uaa/identity-provider/config-uaa-detail.html'
                    }
                }
            })
            .state('identity-provider-detail.keystone', {
                parent: 'identity-provider-detail',
                views: {
                    'config': {
                        templateUrl: 'scripts/app/uaa/identity-provider/config-keystone-detail.html'
                    }
                }
            })
            .state('identity-provider-detail.oidc10', {
                parent: 'identity-provider-detail',
                views: {
                    'config': {
                        templateUrl: 'scripts/app/uaa/identity-provider/config-oidc-detail.html'
                    }
                }
            })
            .state('identity-provider-detail.oauth20', {
                parent: 'identity-provider-detail',
                views: {
                    'config': {
                        templateUrl: 'scripts/app/uaa/identity-provider/config-oauth2-detail.html'
                    }
                }
            })
            .state('identity-provider-detail.ldap', {
                parent: 'identity-provider-detail',
                views: {
                    'config': {
                        templateUrl: 'scripts/app/uaa/identity-provider/config-ldap-detail.html'
                    }
                }
            })
            .state('identity-provider-detail.saml', {
                parent: 'identity-provider-detail',
                views: {
                    'config': {
                        templateUrl: 'scripts/app/uaa/identity-provider/config-saml-detail.html'
                    }
                }
            })
            

            .state('identity-provider.edit.uaa', {
                parent: 'identity-provider.edit',
                views: {
                    'config@': {
                        templateUrl: 'scripts/app/uaa/identity-provider/config-uaa-edit.html'
                    }
                }
            })
            .state('identity-provider.edit.keystone', {
                parent: 'identity-provider.edit',
                views: {
                    'config@': {
                        templateUrl: 'scripts/app/uaa/identity-provider/config-keystone-edit.html'
                    }
                }
            })
            .state('identity-provider.edit.oidc10', {
                parent: 'identity-provider.edit',
                views: {
                    'config@': {
                        templateUrl: 'scripts/app/uaa/identity-provider/config-oidc-edit.html'
                    }
                }
            })
            .state('identity-provider.edit.oauth20', {
                parent: 'identity-provider.edit',
                views: {
                    'config@': {
                        templateUrl: 'scripts/app/uaa/identity-provider/config-oauth2-edit.html'
                    }
                }
            })
            .state('identity-provider.edit.ldap', {
                parent: 'identity-provider.edit',
                views: {
                    'config@': {
                        templateUrl: 'scripts/app/uaa/identity-provider/config-ldap-edit.html'
                    }
                }
            })
            .state('identity-provider.edit.saml', {
                parent: 'identity-provider.edit',
                views: {
                    'config@': {
                        templateUrl: 'scripts/app/uaa/identity-provider/config-saml-edit.html'
                    }
                }
            })

            .state('identity-provider.new.uaa', {
                parent: 'identity-provider.new',
                views: {
                    'config@': {
                        templateUrl: 'scripts/app/uaa/identity-provider/config-uaa-edit.html'
                    }
                }
            })
            .state('identity-provider.new.keystone', {
                parent: 'identity-provider.new',
                views: {
                    'config@': {
                        templateUrl: 'scripts/app/uaa/identity-provider/config-keystone-edit.html'
                    }
                }
            })
            .state('identity-provider.new.oidc10', {
                parent: 'identity-provider.new',
                views: {
                    'config@': {
                        templateUrl: 'scripts/app/uaa/identity-provider/config-oidc-edit.html'
                    }
                }
            })
            .state('identity-provider.new.oauth20', {
                parent: 'identity-provider.new',
                views: {
                    'config@': {
                        templateUrl: 'scripts/app/uaa/identity-provider/config-oauth2-edit.html'
                    }
                }
            })
            .state('identity-provider.new.ldap', {
                parent: 'identity-provider.new',
                views: {
                    'config@': {
                        templateUrl: 'scripts/app/uaa/identity-provider/config-ldap-edit.html'
                    }
                }
            })
            .state('identity-provider.new.saml', {
                parent: 'identity-provider.new',
                views: {
                    'config@': {
                        templateUrl: 'scripts/app/uaa/identity-provider/config-saml-edit.html'
                    }
                }
            });
    });
