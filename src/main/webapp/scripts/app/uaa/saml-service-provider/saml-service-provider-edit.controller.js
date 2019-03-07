'use strict';

angular.module('uaaUIApp').controller('SAMLServiceProviderEditController',
    ['$scope', '$http', '$uibModalInstance', '$state', 'entity', 'SAMLServiceProvider', 'Setting',
        function($scope, $http, $uibModalInstance, $state, entity, SAMLServiceProvider, Setting) {

        $scope.setting = Setting.get();
        $scope.provider = entity;
        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
            $uibModalInstance.close(result);
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.ui = {
            MetaDataFormat: 'URL'
        }
        $scope.config = {};
        if(angular.isDefined(entity.$promise)){
            entity.$promise.then(function (provider) {
                $scope.config = JSON.parse(provider.config);
                $scope.config.staticCustomAttributes = JSON.stringify($scope.config.staticCustomAttributes,null,"  ");
            
                //Same like https://github.com/cloudfoundry/uaa/blob/b513cb9ccd0ca23bd6e5e83bbca72a46de45a44f/model/src/main/java/org/cloudfoundry/identity/uaa/provider/saml/idp/SamlServiceProviderDefinition.java#L80
                if($scope.config.metaDataLocation.indexOf("<?xml") == 0 ||
                    $scope.config.metaDataLocation.indexOf("<md:EntityDescriptor") == 0 ||
                    $scope.config.metaDataLocation.indexOf("<EntityDescriptor") == 0){
                    $scope.ui.MetaDataFormat = 'XML'
                }else if($scope.config.metaDataLocation.indexOf("http") == 0){
                    $scope.ui.MetaDataFormat = 'URL'
                }
                
            });
        }

        $scope.save = function () {
            $scope.isSaving = true;
            var config = angular.copy($scope.config);
            config.staticCustomAttributes = JSON.parse(config.staticCustomAttributes);
            $scope.provider.config = JSON.stringify(config);
        
            if ($scope.provider.id != null) {
                SAMLServiceProvider.update({id: $scope.provider.id}, $scope.provider, onSaveSuccess, onSaveError);
            } else {
                SAMLServiceProvider.save($scope.provider, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

}]);
