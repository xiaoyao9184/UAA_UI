'use strict';

angular.module('uaaUIApp').controller('IdentityProviderEditController',
    ['$scope', '$q', '$http', '$uibModalInstance', '$state', 'entity', 'IdentityProvider', 'Setting', 'SetUtils',
        function($scope, $q, $http, $uibModalInstance, $state, entity, IdentityProvider, Setting, SetUtils) {

        $scope.setting = Setting.get();
        $scope.provider = entity;
        $scope.baseState = $state.current.name;


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

        var change_processors = {
            'saml': function(config){
                angular.merge(
                    config,
                    {
                        emailDomain: [],
                        externalGroupsWhitelist: [],
                        attributeMappings: {
                            external_groups: []
                        },

                        metaDataLocation: '',
                        authnContext: []
                    },
                    config);

                //Same like https://github.com/cloudfoundry/uaa/blob/b513cb9ccd0ca23bd6e5e83bbca72a46de45a44f/model/src/main/java/org/cloudfoundry/identity/uaa/provider/saml/idp/SamlServiceProviderDefinition.java#L80
                if(config.metaDataLocation.indexOf("<?xml") == 0 ||
                    config.metaDataLocation.indexOf("<md:EntityDescriptor") == 0 ||
                    config.metaDataLocation.indexOf("<EntityDescriptor") == 0){
                    $scope.ui.MetaDataFormat = 'XML'
                }else if(config.metaDataLocation.indexOf("http") == 0){
                    $scope.ui.MetaDataFormat = 'URL'
                }               
            },
            'ldap': function(config){
                angular.merge(
                    config,
                    {
                        emailDomain: [],
                        externalGroupsWhitelist: [],
                        attributeMappings: {
                            external_groups: []
                        }
                    },
                    config);
            },
            'oidc1.0': function(config){
                angular.merge(
                    config,
                    {
                        emailDomain: [],
                        externalGroupsWhitelist: [],
                        attributeMappings: {
                            external_groups: []
                        },

                        scopes: [],
                        prompts: [],
                        showLinkText: false
                    },
                    config);
            },
            'oauth2.0': function(config){
                angular.merge(
                    config,
                    {
                        emailDomain: [],
                        externalGroupsWhitelist: [],
                        attributeMappings: {
                            external_groups: []
                        },

                        scopes: [],
                        showLinkText: false
                    },
                    config);
            },
            'uaa': function(config){
                angular.merge(
                    config,
                    {
                        emailDomain: []
                    },
                    config);
            },
            'keystone': function(config){
                angular.merge(
                    config,
                    {
                        emailDomain: [],
                        externalGroupsWhitelist: [],
                        attributeMappings: {
                            external_groups: []
                        }
                    },
                    config);
            }
        };
        $scope.change = function(name) {
            if(angular.isUndefined($scope.provider.type)){
                //first active
                $scope.active = 'none';
                return
            }else if($scope.provider.type !== name){
                $scope.provider.config = {}
            }else if($scope.provider.config === null ||
                angular.isUndefined($scope.provider.config)){
                $scope.provider.config = {}
            }
            $scope.provider.type = name;

            var processor = change_processors[name];
            if(angular.isFunction(processor)){
                processor($scope.provider.config);
            };
            
            $state.go($scope.baseState + '.' + name.replace('.',''))
            return
        };
        
        $scope.addItem = SetUtils.addItem;
        $scope.deleItem = SetUtils.deleItem;
        $scope.hasItem = SetUtils.hasItem;
        $scope.toggleItem = SetUtils.toggleItem;


        //SAML
        $scope.ui = {
            MetaDataFormat: 'URL'
        }


        //OIDC1
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


        var init = function() {
            var promise;
            if(angular.isUndefined($scope.provider.$promise)){
                var deferred = $q.defer();
                deferred.resolve($scope.provider);
                promise = deferred.promise;
            }else{
                promise = $scope.provider.$promise;
            }
            promise.then(function(provider){
                $scope.active = provider.type;
            });
        };

        init();
}]);
