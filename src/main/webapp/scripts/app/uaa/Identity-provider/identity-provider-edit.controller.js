'use strict';

angular.module('uaaUIApp').controller('IdentityProviderEditController',
    ['$scope', '$http', '$uibModalInstance', '$state', 'entity', 'IdentityProvider', 'Setting',
        function($scope, $http, $uibModalInstance, $state, entity, IdentityProvider, Setting) {

        $scope.setting = Setting.get();
        $scope.provider = entity;
        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
            $uibModalInstance.close(result);
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.provider.id != null) {
                IdentityProvider.update({id: $scope.provider.id}, $scope.provider, onSaveSuccess, onSaveError);
            } else {
                IdentityProvider.save($scope.provider, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        if(angular.isDefined($scope.provider.$promise)){
            $scope.provider.$promise.then(function(provider){
                $scope.active = provider.type;
            })
        }
        
        $scope.types = [
            "uaa",
            "oauth2.0","oidc1.0",
            "keystone", 
            "ldap",
            "saml",
        ]
        $scope.isUnknowType = function(type){
            return $scope.types.indexOf(type) === -1
        };


        $scope.after_init_processors = {
            'saml': function(){
                var config;
                if(!angular.isObject($scope.provider.config)){
                    $scope.provider.config = {}
                }
                config = $scope.provider.config;
                if(!angular.isArray(config.emailDomain)){
                    config.emailDomain = [];
                }
                if(!angular.isArray(config.externalGroupsWhitelist)){
                    config.externalGroupsWhitelist = [];
                }
                if(config.attributeMappings === null ||
                    angular.isUndefined(config.attributeMappings)){
                    config.attributeMappings = {};
                }
            },
            'ldap': function(){
                var config;
                if(!angular.isObject($scope.provider.config)){
                    $scope.provider.config = {}
                }
                config = $scope.provider.config;
                if(!angular.isArray(config.emailDomain)){
                    config.emailDomain = [];
                }
                if(!angular.isArray(config.externalGroupsWhitelist)){
                    config.externalGroupsWhitelist = [];
                }
                if(config.attributeMappings === null ||
                    angular.isUndefined(config.attributeMappings)){
                    config.attributeMappings = {};
                }
                if(config.attributeMappings.external_groups === null ||
                    angular.isUndefined(config.attributeMappings.external_groups)){
                    config.attributeMappings.external_groups = []
                }
            },
            'oidc1.0': function(){
                var config;
                if(!angular.isObject($scope.provider.config)){
                    $scope.provider.config = {}
                }
                config = $scope.provider.config;
                if(!angular.isArray(config.emailDomain)){
                    config.emailDomain = [];
                }
                if(!angular.isArray(config.externalGroupsWhitelist)){
                    config.externalGroupsWhitelist = [];
                }
                if(config.attributeMappings === null ||
                    angular.isUndefined(config.attributeMappings)){
                    config.attributeMappings = {};
                }
                if(config.attributeMappings.external_groups === null ||
                    angular.isUndefined(config.attributeMappings.external_groups)){
                    config.attributeMappings.external_groups = []
                }
                if(!angular.isArray(config.scopes)){
                    config.scopes = [];
                }
                if(!angular.isArray(config.prompts)){
                    config.prompts = [];
                }
                if(angular.isUndefined(config.showLinkText)){
                    config.showLinkText = false
                }
            },
            'oauth2.0': function(){
                var config;
                if(!angular.isObject($scope.provider.config)){
                    $scope.provider.config = {}
                }
                config = $scope.provider.config;
                if(!angular.isArray(config.emailDomain)){
                    config.emailDomain = [];
                }
                if(!angular.isArray(config.externalGroupsWhitelist)){
                    config.externalGroupsWhitelist = [];
                }
                if(config.attributeMappings === null ||
                    angular.isUndefined(config.attributeMappings)){
                    config.attributeMappings = {};
                }
                if(config.attributeMappings.external_groups === null ||
                    angular.isUndefined(config.attributeMappings.external_groups)){
                    config.attributeMappings.external_groups = []
                }
                if(!angular.isArray(config.scopes)){
                    config.scopes = [];
                }
                if(angular.isUndefined(config.showLinkText)){
                    config.showLinkText = false
                }
            },
            'uaa': function(){
                var config;
                if(!angular.isObject($scope.provider.config)){
                    $scope.provider.config = {}
                }
                config = $scope.provider.config;
                if(!angular.isArray(config.emailDomain)){
                    config.emailDomain = [];
                }
            },
            'keystone': function(){
                var config;
                if(!angular.isObject($scope.provider.config)){
                    $scope.provider.config = {}
                }
                config = $scope.provider.config;
                if(!angular.isArray(config.emailDomain)){
                    config.emailDomain = [];
                }
                if(!angular.isArray(config.externalGroupsWhitelist)){
                    config.externalGroupsWhitelist = [];
                }
                if(config.attributeMappings === null ||
                    angular.isUndefined(config.attributeMappings)){
                    config.attributeMappings = {};
                }
                if(config.attributeMappings.external_groups === null ||
                    angular.isUndefined(config.attributeMappings.external_groups)){
                    config.attributeMappings.external_groups = []
                }
            }
        };

        $scope.init = function(name) {
            // if(angular.isUndefined($scope.provider.$promise)){
            //     var processor = $scope.after_init_processors[name];
            //     if(angular.isFunction(processor)){
            //         processor();
            //     };
            //     return
            // }
            // $scope.provider.$promise.then(function(provider){
            //     var processor = $scope.after_init_processors[name];
            //     if(angular.isFunction(processor)){
            //         processor();
            //     };
            // })
        };


        $scope.baseState = $state.current.name 

        $scope.change = function(name) {
            $scope.provider.type = name;
            var processor = $scope.after_init_processors[name];
            if(angular.isFunction(processor)){
                processor(false);
            };
            
            $state.go($scope.baseState + '.' + name.replace('.',''))
            return
        };
        
        $scope.initIfNull = function(name) {
            $scope.provider.type = name;
            var processor = $scope.after_init_processors[name];
            if(angular.isFunction(processor)){
                processor(false);
            };
            return
        };

        $scope.import = {
            url: $scope.setting.url + '.well-known/openid-configuration'
        };
        $scope.importConfig = function(){
            $http.get($scope.import.url, {}, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                }
            })
            .then(function(res){
                var config = $scope.provider.config;
                config.issuer = res.data.issuer;
                config.authUrl = res.data.authorization_endpoint;
                config.tokenUrl = res.data.token_endpoint;
                config.userInfoUrl = res.data.userinfo_endpoint;
                config.tokenKeyUrl = res.data.jwks_uri;
                config.scopes = res.data.scopes_supported;
            })
        };
        
        $scope.addItem = function(listOrMap, item) {
            if(angular.isUndefined(listOrMap)){
                return;
            }
            if(angular.isArray(listOrMap)){
                listOrMap.push(item);
            }else{
                listOrMap[item.key] = item.value
            }
        }

        $scope.deleItem = function(listOrMap, index) {
            if(angular.isUndefined(listOrMap)){
                return;
            }
            if(angular.isArray(listOrMap)){
                listOrMap.splice(index,1);
            }else{
                var key = index;
                delete listOrMap[key];
            }
        };

        $scope.hasItem = function(listOrMap, item) {
            if(angular.isUndefined(listOrMap)){
                return;
            }
            if(angular.isArray(listOrMap)){
                var index = listOrMap.indexOf(item);
                return index !== -1
            }else{
                return item in listOrMap;
            }
        };

        $scope.toggleItem = function(listOrMap, item) {
            if(angular.isUndefined(listOrMap)){
                return;
            }
            if(angular.isArray(listOrMap)){
                if($scope.hasItem(listOrMap,item)){
                    var index = listOrMap.indexOf(item);
                    listOrMap.splice(index,1);
                    return
                }
                listOrMap.push(item);
            }else{
                if($scope.hasItem(listOrMap,item)){
                    $scope.deleItem(listOrMap,item);
                    return
                }
                $scope.addItem(listOrMap,item);
            }
        };
}]);
