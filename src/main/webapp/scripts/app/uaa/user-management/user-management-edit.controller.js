'use strict';

angular.module('uaaUIApp').controller('UserManagementEditController',
    ['$scope', '$q', '$uibModalInstance', 'entity', 'User', 'IdentityProvider', 'SetUtils',
        function($scope, $q, $uibModalInstance, entity, User, IdentityProvider, SetUtils) {

        $scope.user = entity;

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
            } else {
                User.save($scope.user, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        
        $scope.addItem = SetUtils.addItem;
        $scope.deleItem = SetUtils.deleItem;
        
        $scope.providers = {
            identity: null
        };
        
        var init = function() {
            var promise;
            if(angular.isUndefined($scope.user.$promise)){
                var deferred = $q.defer();
                deferred.resolve($scope.user);
                promise = deferred.promise;
            }else{
                promise = $scope.user.$promise;
            }
            promise.then(function(user){
                if(angular.isUndefined(user.name)){
                    user.name = {};
                }
                if(angular.isUndefined(user.phoneNumbers)){
                    user.phoneNumbers = [];
                }
                if(angular.isUndefined(user.emails)){
                    user.emails = [{ value: null, primary: true}];
                }
                if(angular.isUndefined(user.active)){
                    user.active = true;
                }
                if(angular.isUndefined(user.verified)){
                    user.verified = false;
                }
                if(angular.isUndefined(user.origin)){
                    user.origin = 'uaa';
                }
                if(angular.isUndefined(user.approvals)){
                    user.approvals = [];
                }
            });

            IdentityProvider.query({}, function (result) {
                $scope.providers.identity = result;
            });
        };

        init();
}]);
