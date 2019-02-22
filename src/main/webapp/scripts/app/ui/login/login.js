'use strict';

angular.module('uaaUIApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('password', {
                parent: 'home',
                // url: '/',
                views: {
                    'login': {
                        templateUrl: 'scripts/app/ui/login/password.html',
                        controller: 'LoginPasswordController'
                    }
                }
            })
            .state('authorization_code', {
                parent: 'home',
                // url: '/',
                views: {
                    'login': {
                        templateUrl: 'scripts/app/ui/login/authorization_code.html',
                        controller: 'LoginAuthorizationCodeController'
                    }
                }
            })
            .state('implicit', {
                parent: 'home',
                // url: '/',
                views: {
                    'login': {
                        templateUrl: 'scripts/app/ui/login/implicit.html',
                        controller: 'LoginImplicitController'
                    }
                }
            })
            .state('client_credentials', {
                parent: 'home',
                // url: '/',
                views: {
                    'login': {
                        templateUrl: 'scripts/app/ui/login/client_credentials.html',
                        controller: 'LoginClientCredentialsController'
                    }
                }
            })
            .state('auto_login', {
                parent: 'home',
                // url: '/',
                views: {
                    'login': {
                        templateUrl: 'scripts/app/ui/login/auto_login.html',
                        controller: 'LoginAutoLoginController'
                    }
                }
            })
            .state('auth_redirect', {
                parent: 'site',
                url: '/auth_redirect?code&state&error&error_description&token_type&access_token&id_token&expires_in&scope',
                params: {
                    code: null,
                    state: null,
                    error: null,
                    error_description: null,
                    token_type: null,
                    access_token: null,
                    id_token: null,
                    expires_in: null,
                    scope: null
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/ui/login/redirect.html',
                        controller: 'AuthRedirectController'
                    }
                }
            })
            .state('passcode', {
                parent: 'home',
                // url: '/',
                views: {
                    'login': {
                        templateUrl: 'scripts/app/ui/login/passcode.html',
                        controller: 'LoginPasscodeController'
                    }
                }
            });
    });
