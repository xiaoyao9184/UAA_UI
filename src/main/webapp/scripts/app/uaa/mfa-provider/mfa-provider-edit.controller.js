'use strict';

angular.module('uaaUIApp').controller('MFAProviderEditController',
    ['$scope', '$http', '$uibModalInstance', '$state', 'entity', 'MFAProvider', 'Setting',
        function($scope, $http, $uibModalInstance, $state, entity, MFAProvider, Setting) {

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
                MFAProvider.update({id: $scope.provider.id}, $scope.provider, onSaveSuccess, onSaveError);
            } else {
                MFAProvider.save($scope.provider, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

}]);
