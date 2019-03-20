'use strict';

angular.module('uaaUIApp')
    .controller('IdentityProviderDetailController', 
    function ($scope, $state, $stateParams, IdentityProvider) {
        
        $scope.types = [
            "uaa",
            "oauth2.0","oidc1.0",
            "keystone",
            "saml",
            "ldap"
        ]
        $scope.isUnknowType = function(type){
            return $scope.types.indexOf(type) === -1
        };

        if(!$scope.isUnknowType($stateParams.type) &&
            $state.current.name.indexOf($stateParams.type) === -1){
            $state.go("identity-provider-detail." + $stateParams.type.replace('.',''))
        }
    
        $scope.provider = {};
        $scope.load = function (id) {
            IdentityProvider.get({id: id, rawConfig: true}, function(result) {
                $scope.provider = result;

                if(result.type === 'saml'){
                    //Same like https://github.com/cloudfoundry/uaa/blob/4.26.0/model/src/main/java/org/cloudfoundry/identity/uaa/provider/saml/idp/SamlServiceProviderDefinition.java#L80
                    if(result.config.metaDataLocation.indexOf("<?xml") == 0 ||
                        result.config.metaDataLocation.indexOf("<md:EntityDescriptor") == 0 ||
                        result.config.metaDataLocation.indexOf("<EntityDescriptor") == 0){
                        $scope.ui.MetaDataFormat = 'XML'
                    }else if(result.config.metaDataLocation.indexOf("http") == 0){
                        $scope.ui.MetaDataFormat = 'URL'
                    }
                }
            });
        };
        $scope.load($stateParams.id);

        $scope.ui = {
            MetaDataFormat: 'URL'
        }

    });
