'use strict';

angular.module('uaaUIApp').controller('ZoneManagementEditController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Zone',
        function($scope, $stateParams, $uibModalInstance, entity, Zone) {

        $scope.zone = entity;
        $scope.authorities = ["ROLE_USER", "ROLE_ADMIN"];
        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
            $uibModalInstance.close(result);
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if(typeof $scope.zone.config === 'string'){
                $scope.zone.config = JSON.parse($scope.zone.config)
            }
            if ($scope.zone.id != null) {
                Zone.update({id: $scope.zone.id}, $scope.zone, onSaveSuccess, onSaveError);
            } else {
                // $scope.zone.langKey = 'en';
                Zone.save($scope.zone, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
}]);
