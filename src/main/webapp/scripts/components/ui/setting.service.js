'use strict';

angular.module('uaaUIApp')
    .factory('Setting', function apiService(localStorageService, $rootElement, ENV, SETTING) {
        var setting_key = 'setting';
        if(ENV.includes('dev')){
            setting_key = setting_key + '_' + $rootElement.attr('ng-app');
        }
        return {
            version: 7,
            set: function(setting) {
                localStorageService.set(setting_key, setting);
            },
            get: function () {
                var setting = localStorageService.get(setting_key);
                if(setting === null || setting.version < this.version){
                    setting = angular.merge({},SETTING);
                    localStorageService.set(setting_key, setting);
                }
                return setting;
            }
        };
    });
