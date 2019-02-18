'use strict';

angular.module('uaaUIApp').controller('SettingController',
    ['$scope', '$stateParams', '$uibModalInstance', 'Setting',
        function($scope, $stateParams, $uibModalInstance, Setting) {

        $scope.setting = Setting.get()
        
        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
            $uibModalInstance.close(result);
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            Setting.set($scope.setting);
            onSaveSuccess($scope.setting)
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
}]);