'use strict';

angular.module('uaaUIApp')
    .controller('SAMLServiceProviderController', function ($scope, clipboard, SAMLServiceProvider) {
        $scope.providers = [];
        $scope.loadAll = function () {
            SAMLServiceProvider.query({}, function (result) {
                $scope.providers = result;

                angular.forEach(result, function(provider){
                    provider.ui = {};

                    //Same like https://github.com/cloudfoundry/uaa/blob/4.26.0/model/src/main/java/org/cloudfoundry/identity/uaa/provider/saml/idp/SamlServiceProviderDefinition.java#L80
                    if(provider.config.metaDataLocation.indexOf("<?xml") == 0 ||
                        provider.config.metaDataLocation.indexOf("<md:EntityDescriptor") == 0 ||
                        provider.config.metaDataLocation.indexOf("<EntityDescriptor") == 0){
                        provider.ui.MetaDataFormat = 'XML';
                    }else if(provider.config.metaDataLocation.indexOf("http") == 0){
                        provider.ui.MetaDataFormat = 'URL';
                    }
                });
            });
        };

        $scope.loadAll();

        $scope.clear = function () {
            $scope.provider = {};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };

        $scope.copy = function(text){
            clipboard.copyText(text);
        };
    });
