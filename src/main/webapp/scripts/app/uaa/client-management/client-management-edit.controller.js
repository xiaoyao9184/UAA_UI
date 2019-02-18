'use strict';

angular.module('uaaUIApp').controller('ClientManagementEditController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'mode', 'Client', 
        function($scope, $stateParams, $uibModalInstance, entity, mode, Client) {

        
        $scope.client = entity;
        $scope.mode = mode;
        $scope.is_refresh_token = false;

        if(mode === 'edit'){
            entity.$promise
                .then(function(client){
                    if(typeof client.redirect_uri === 'undefined'){
                        client.redirect_uri = []
                    }
                    $scope.is_refresh_token = $scope.enableGrant('refresh_token')
                    if($scope.is_refresh_token){
                        $scope.toggleGrant('refresh_token');
                    }
                });
        }
        

        // $scope.addGrant = function (value) {
        //     $scope.client.authorized_grant_types.push(value);
        // };

        // $scope.deleGrant = function (index) {
        //     $scope.client.authorized_grant_types.splice(index,1);
        // };

        $scope.enableGrant = function (grant) {
            if(!$scope.client.$resolved){
                return
            }
            var index = $scope.client.authorized_grant_types.indexOf(grant);
            return index !== -1
        };

        $scope.toggleGrant = function (grant) {
            if($scope.enableGrant(grant)){
                var index = $scope.client.authorized_grant_types.indexOf(grant);
                $scope.client.authorized_grant_types.splice(index,1);
                return
            }
            $scope.client.authorized_grant_types.push(grant);
        };

        $scope.addRedirect = function () {
            $scope.client.redirect_uri.push('http://');
        };

        $scope.deleRedirect = function (index) {
            $scope.client.redirect_uri.splice(index,1);
        };

        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
            $uibModalInstance.close(result);
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if($scope.mode === 'edit'){
                Client.update({id: $scope.client.client_id}, $scope.client, onSaveSuccess, onSaveError);
            } else {
                Client.save($scope.client, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

}]);
