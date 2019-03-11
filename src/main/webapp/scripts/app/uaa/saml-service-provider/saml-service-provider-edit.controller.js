'use strict';

angular.module('uaaUIApp').controller('SAMLServiceProviderEditController',
    ['$scope', '$q', '$uibModalInstance', 'entity', 'SAMLServiceProvider',
        function($scope, $q, $uibModalInstance, entity, SAMLServiceProvider) {

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
            $scope.provider.config.staticCustomAttributes = angular.fromJson($scope.config_staticCustomAttributes);
            if ($scope.provider.id != null) {
                SAMLServiceProvider.update({id: $scope.provider.id}, $scope.provider, onSaveSuccess, onSaveError);
            } else {
                SAMLServiceProvider.save($scope.provider, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.ui = {
            MetaDataFormat: 'URL'
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
                if(angular.isUndefined(provider.active)){
                    provider.active = true;
                }

                $scope.config_staticCustomAttributes = angular.toJson(provider.config.staticCustomAttributes,true);
            
                //Same like https://github.com/cloudfoundry/uaa/blob/b513cb9ccd0ca23bd6e5e83bbca72a46de45a44f/model/src/main/java/org/cloudfoundry/identity/uaa/provider/saml/idp/SamlServiceProviderDefinition.java#L80
                if(provider.config.metaDataLocation.indexOf("<?xml") == 0 ||
                    provider.config.metaDataLocation.indexOf("<md:EntityDescriptor") == 0 ||
                    provider.config.metaDataLocation.indexOf("<EntityDescriptor") == 0){
                    $scope.ui.MetaDataFormat = 'XML'
                }else if(provider.config.metaDataLocation.indexOf("http") == 0){
                    $scope.ui.MetaDataFormat = 'URL'
                }
            });
        };

        init();

}]);
