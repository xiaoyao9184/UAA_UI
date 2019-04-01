'use strict';

angular.module('uaaUIApp').controller('SettingController',
    ['$scope', '$stateParams', '$uibModalInstance', 'Setting', 'AlertService',
        function($scope, $stateParams, $uibModalInstance, Setting, AlertService) {

        $scope.setting = Setting.get();
        $scope.count = 5;
        
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
            onSaveSuccess($scope.setting);
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.goingDebug = function(){
            AlertService.clear();
            if($scope.count === 0){
                $scope.setting.debug = !$scope.setting.debug;
                Setting.set($scope.setting);
                $scope.count = 5;
            }else{
                AlertService.info('<strong>UI: </strong>click ' + $scope.count + ' times to enter/exit debug mode');
                $scope.count = $scope.count - 1;
            }
        };
}]);