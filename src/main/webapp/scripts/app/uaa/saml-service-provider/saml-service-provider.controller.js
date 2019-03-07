'use strict';

angular.module('uaaUIApp')
    .controller('SAMLServiceProviderController', function ($scope, clipboard, SAMLServiceProvider) {
        $scope.providers = [];

        $scope.loadAll = function () {
            SAMLServiceProvider.query({}, function (result, headers) {
                $scope.providers = result;

                angular.forEach(result, function(provider){
                    provider.config = JSON.parse(provider.config);
                    provider.ui = {}

                    //Same like https://github.com/cloudfoundry/uaa/blob/b513cb9ccd0ca23bd6e5e83bbca72a46de45a44f/model/src/main/java/org/cloudfoundry/identity/uaa/provider/saml/idp/SamlServiceProviderDefinition.java#L80
                    if(provider.config.metaDataLocation.indexOf("<?xml") == 0 ||
                        provider.config.metaDataLocation.indexOf("<md:EntityDescriptor") == 0 ||
                        provider.config.metaDataLocation.indexOf("<EntityDescriptor") == 0){
                        provider.ui.MetaDataFormat = 'XML'
                    }else if(provider.config.metaDataLocation.indexOf("http") == 0){
                        provider.ui.MetaDataFormat = 'URL'
                    }
                })
            });
        };

        $scope.loadAll();

        $scope.clear = function () {
            $scope.provider = {
                id: null, name: null, type: null, config: null
            };
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };

        $scope.copy = function(text){
            clipboard.copyText(text);
        }
    });
