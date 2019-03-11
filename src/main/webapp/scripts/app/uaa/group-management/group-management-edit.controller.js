'use strict';

angular.module('uaaUIApp').controller('GroupManagementEditController',
    ['$scope', '$q', '$uibModalInstance', 'entity', 'Group', 
        function($scope, $q, $uibModalInstance, entity, Group) {

        $scope.group = entity;
        
        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
            $uibModalInstance.close(result);
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.group.id != null) {
                Group.update({id: $scope.group.id}, $scope.group, onSaveSuccess, onSaveError);
            } else {
                Group.save($scope.group, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        var init = function() {
            var promise;
            if(angular.isUndefined($scope.group.$promise)){
                var deferred = $q.defer();
                deferred.resolve($scope.group);
                promise = deferred.promise;
            }else{
                promise = $scope.group.$promise;
            }
            promise.then(function(group){
                
            });
        };

        init();
}]);
