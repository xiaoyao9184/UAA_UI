'use strict';

angular.module('uaaUIApp')
    .factory('Setting', function apiService(localStorageService, SETTING) {
        return {
            version: 7,
            set: function(setting) {
                localStorageService.set('setting', setting);
            },
            get: function () {
                var setting = localStorageService.get('setting');
                if(setting === null || setting.version < this.version){
                    setting = angular.merge({},SETTING);
                    localStorageService.set('setting', setting);
                }
                return setting;
            }
        };
    });
