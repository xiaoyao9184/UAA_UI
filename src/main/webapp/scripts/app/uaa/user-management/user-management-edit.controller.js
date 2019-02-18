'use strict';

angular.module('uaaUIApp').controller('UserManagementEditController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'User', 
        function($scope, $stateParams, $uibModalInstance, entity, User) {

        $scope.user = entity;
        // $scope.authorities = ["ROLE_USER", "ROLE_ADMIN"];
        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
            $uibModalInstance.close(result);
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.user.id != null) {
                User.update({id: $scope.user.id}, $scope.user, onSaveSuccess, onSaveError);
                // If-Match
            } else {
                // $scope.user.langKey = 'en';
                User.save($scope.user, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.addEmail = function() {
            $scope.user.emails.push({
                value: null, primary: false
            })
        };

        $scope.addPhoneNumber = function() {
            $scope.user.phoneNumbers.push({
                value: null
            });
        };

        $scope.deleEmail = function(index) {
            $scope.user.emails.splice(index,1);
        };

        $scope.delePhoneNumber = function(index) {
            $scope.user.phoneNumbers.splice(index,1);
        };
}]);
