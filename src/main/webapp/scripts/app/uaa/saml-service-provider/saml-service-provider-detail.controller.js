'use strict';

angular.module('uaaUIApp')
    .controller('SAMLServiceProviderDetailController', 
    function ($scope, $state, $stateParams, $location, $filter,
        SAMLServiceProvider, Setting) {
        
        $scope.provider = {};
        $scope.load = function (id) {
            SAMLServiceProvider.get({id: id}, function(result) {
                $scope.provider = result;
                result.config = JSON.parse(result.config);

                //Same like https://github.com/cloudfoundry/uaa/blob/b513cb9ccd0ca23bd6e5e83bbca72a46de45a44f/model/src/main/java/org/cloudfoundry/identity/uaa/provider/saml/idp/SamlServiceProviderDefinition.java#L80
                if(result.config.metaDataLocation.indexOf("<?xml") == 0 ||
                    result.config.metaDataLocation.indexOf("<md:EntityDescriptor") == 0 ||
                    result.config.metaDataLocation.indexOf("<EntityDescriptor") == 0){
                    $scope.ui.MetaDataFormat = 'XML'
                }else if(result.config.metaDataLocation.indexOf("http") == 0){
                    $scope.ui.MetaDataFormat = 'URL'
                }
            });
        };
        $scope.load($stateParams.id);

        $scope.ui = {
            MetaDataFormat: 'URL'
        }
    });
