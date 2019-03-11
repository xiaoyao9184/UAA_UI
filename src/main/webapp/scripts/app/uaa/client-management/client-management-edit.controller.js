'use strict';

angular.module('uaaUIApp').controller('ClientManagementEditController',
    ['$scope', '$q', '$uibModalInstance', 'entity', 'Client', 'IdentityProvider', 'SetUtils',
        function($scope, $q, $uibModalInstance, entity, Client, IdentityProvider, SetUtils) {

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
            if($scope.client.id != null){
                Client.update({id: $scope.client.client_id}, $scope.client, onSaveSuccess, onSaveError);
            } else {
                Client.save($scope.client, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.ui = {
            grants: {
                "client_credentials": {
                    name: "client_credentials",
                    type: "oauth2"
                },
                "implicit": {
                    name: "implicit",
                    type: "oauth2"
                },
                "password": {
                    name: "password",
                    type: "oauth2"
                },
                "authorization_code": {
                    name: "authorization_code",
                    type: "oauth2"
                },
                "refresh_token": {
                    name: "refresh_token",
                    type: "flag"
                },
                "user_token": {
                    name: "user_token",
                    type: "other"
                },
                "urn:ietf:params:oauth:grant-type:saml2-bearer": {
                    name: "saml2-bearer",
                    type: "other"
                },
                "urn:ietf:params:oauth:grant-type:jwt-bearer": {
                    name: "jwt-bearer",
                    type: "other"
                }
            },
            groups: [
                'zones.read',
                'zones.write',
                'idps.read',
                'idps.write',
                'clients.admin',
                'clients.write',
                'clients.read',
                'clients.secret',
                'scim.write',
                'scim.read',
                'scim.create',
                'scim.userids',
                'scim.zones',
                'scim.invite',
                'password.write',
                'oauth.approval',
                'oauth.login', 
                'approvals.me', 
                'openid', 
                'groups.update',
                'uaa.user',
                'uaa.resource',
                'uaa.admin'
            ],
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
        }

        $scope.providers = {
            identity: null
        }
        
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
                if(angular.isUndefined(client.authorized_grant_types)){
                    client.authorized_grant_types = [];
                }
                if(angular.isUndefined(client.redirect_uri)){
                    client.redirect_uri = [];
                }
                if(angular.isUndefined(client.scope)){
                    client.scope = [];
                }
                if(angular.isUndefined(client.resource_ids)){
                    client.resource_ids = [];
                }
                if(angular.isUndefined(client.authorities)){
                    client.authorities = [];
                }
                if(angular.isUndefined(client.autoapprove)){
                    client.autoapprove = ['true'];
                }
                if(angular.isUndefined(client.allowedproviders) || 
                    client.allowedproviders === null){
                    client.allowedproviders = [];
                }
                if(angular.isUndefined(client.required_user_groups)){
                    client.required_user_groups = [];
                }
            });

            IdentityProvider.query({}, function (result, headers) {
                $scope.providers.identity = result;
            });
        };

        init();
        
}]);
