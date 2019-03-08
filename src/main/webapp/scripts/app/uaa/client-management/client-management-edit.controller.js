'use strict';

angular.module('uaaUIApp').controller('ClientManagementEditController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'mode', 'Client', 'IdentityProvider',
        function($scope, $stateParams, $uibModalInstance, entity, mode, Client, IdentityProvider) {

        
        $scope.client = entity;
        $scope.mode = mode;

        if(mode === 'edit'){
            entity.$promise
                .then(function(client){
                    if(typeof client.redirect_uri === 'undefined'){
                        client.redirect_uri = []
                    }
                    if(angular.isUndefined(client.allowedproviders)){
                        client.allowedproviders = []
                    }
                });
        }
        
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


        $scope.default = {
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
            }
        }

        $scope.providers = {
            identity: null
        }
        IdentityProvider.query({}, function (result, headers) {
            $scope.providers.identity = result;
        });
        
        $scope.addItem = function(listOrMap, item) {
            if(angular.isUndefined(listOrMap)){
                return;
            }
            if(angular.isArray(listOrMap) &&
                angular.isArray(item)){
                for (var i=0; i<item.length; i++){
                    listOrMap.push(item[i]);
                }
            }else if(angular.isArray(listOrMap)){
                listOrMap.push(item);
            }else{
                listOrMap[item.key] = item.value
            }
        }

        $scope.deleItem = function(listOrMap, index) {
            if(angular.isUndefined(listOrMap)){
                return;
            }
            if(angular.isArray(listOrMap)){
                listOrMap.splice(index,1);
            }else{
                var key = index;
                delete listOrMap[key];
            }
        };

        $scope.hasItem = function(listOrMap, item) {
            if(angular.isUndefined(listOrMap)){
                return;
            }
            if(angular.isArray(listOrMap)){
                var index = listOrMap.indexOf(item);
                return index !== -1
            }else{
                return item in listOrMap;
            }
        };

        $scope.toggleItem = function(listOrMap, item) {
            if(angular.isUndefined(listOrMap)){
                return;
            }
            if(angular.isArray(listOrMap)){
                if($scope.hasItem(listOrMap,item)){
                    var index = listOrMap.indexOf(item);
                    listOrMap.splice(index,1);
                    return
                }
                listOrMap.push(item);
            }else{
                if($scope.hasItem(listOrMap,item)){
                    $scope.deleItem(listOrMap,item);
                    return
                }
                $scope.addItem(listOrMap,item);
            }
        };

}]);
