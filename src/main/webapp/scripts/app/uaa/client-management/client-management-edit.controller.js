'use strict';

angular.module('uaaUIApp').controller('ClientManagementEditController',
    ['$scope', '$q', '$uibModalInstance', 'entity', 'Client', 'IdentityProvider', 'SetUtils', 'GRANTS', 'GROUPS',
        function($scope, $q, $uibModalInstance, entity, Client, IdentityProvider, SetUtils, GRANTS, GROUPS) {

        $scope.client = entity;
        
        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
            $uibModalInstance.close(result);
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if($scope.client.client_id != null){
                Client.update({id: $scope.client.client_id}, $scope.client, onSaveSuccess, onSaveError);
            } else {
                Client.save($scope.client, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.ui = {
            grants: {},
            groups: GROUPS,
            resourceIds: [
                'zones',
                'idps',
                'clients',
                'scim',
                'password',
                'oauth',
                'approvals', 
                'groups',
                'uaa'
            ]
        };
        angular.forEach(GRANTS,function(grant){
            if(grant.grant){
                var value = grant.value ? grant.value: grant.name;
                $scope.ui.grants[value] = grant;
            }
        });

        $scope.providers = {
            identity: null
        };
        
        $scope.addItem = SetUtils.addItem;
        $scope.deleItem = SetUtils.deleItem;
        $scope.hasItem = SetUtils.hasItem;
        $scope.toggleItem = SetUtils.toggleItem;

        var init = function() {
            var promise;
            if(angular.isUndefined($scope.client.$promise)){
                var deferred = $q.defer();
                deferred.resolve($scope.client);
                promise = deferred.promise;
            }else{
                promise = $scope.client.$promise;
            }
            promise.then(function(client){
                angular.merge(
                    client,
                    {
                        authorized_grant_types: [],
                        redirect_uri: [],
                        scope: [],
                        resource_ids: [],
                        authorities: [],
                        autoapprove: angular.isUndefined($scope.client.$promise) ? ['true'] : [],
                        allowedproviders: [],
                        required_user_groups: []
                    });
            });

            IdentityProvider.query({}, function (result) {
                $scope.providers.identity = result;
            });
        };

        init();
        
}]);
