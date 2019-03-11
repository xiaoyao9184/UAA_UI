'use strict';

angular.module('uaaUIApp').controller('MFAProviderEditController',
    ['$scope', '$q', '$uibModalInstance', 'entity', 'MFAProvider',
        function($scope, $q, $uibModalInstance, entity, MFAProvider) {

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
                MFAProvider.update({id: $scope.provider.id}, $scope.provider, onSaveSuccess, onSaveError);
            } else {
                MFAProvider.save($scope.provider, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
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
                if(angular.isUndefined(provider.type)){
                    provider.type = 'google-authenticator';
                }
            });
        };

        init();

}]);
