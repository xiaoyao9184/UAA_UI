'use strict';

angular.module('uaaUIApp')
    .factory('Setting', function apiService(localStorageService) {
        return {
            version: 7,
            set: function(setting) {
                localStorageService.set('setting', setting);
            },
            get: function () {
                var setting = localStorageService.get('setting');
                if(setting === null || setting.version < this.version){
                    setting = {
                        version: this.version,
                        debug: false,
                        hide: {
                            setting: [
                                'username', 
                                'password'
                            ],
                        },
                        

                        // debug edit
                        username: 'admin',
                        password: 'u6q90szh217x1b8btlto',

                        // can edit
                        url: 'http://localhost:8080/uaa/',
                        clientId: 'uaa_admin',
                        clientSecret: 't5rrjmtupeno2puoqmao',
                        loginType: 'password',


                        authUrlPath: 'oauth/authorize',
                        authRedirectUrl: '#/auth_redirect?',

                        authWindowType: 'popup',
                        authWindowParam :'toolbar=no,scrollbars=no,resizable=no,top=100,left=500,width=600,height=800',
                    
                        sessionCheckUrl: 'session_management'
                    }
                    localStorageService.set('setting', setting);
                }
                return setting;
            }
        };
    });
