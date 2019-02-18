'use strict';

angular.module('uaaUIApp')
    .controller('ClientManagementDetailController', function (
        $scope, $state, $stateParams, 
        AlertService, Client, ClientInfo, ClientSecret, TokenServerProvider, TokenHolder, Principal) {
        $scope.client = {};
        $scope.load = function (id) {
            Client.get({id: id}, function(result) {
                $scope.client = result;
            });

            ClientInfo.get(function(result) {
                $scope.client_info = result;
            });
        };
        $scope.load($stateParams.id);

        $scope.changeSecret = function () {
            TokenServerProvider.client({
                clientId: $scope.client.client_id,
                clientSecret: $scope.secret.old_secret,
            }).then(function(response){
                var token = response.data.access_token
                ClientSecret.change({id: $scope.client.client_id}, {
                    "clientId" : $scope.client.client_id,
                    "secret" : $scope.secret.secret,
                    "token" : token
                }, function(result) {
                    AlertService.success(result.message);

                    if(TokenHolder.getJwt().payload.client_id === $scope.client.client_id){
                        TokenHolder.remove();
                        Principal.authenticate(undefined)
                        $state.go('home', null, { reload: true });
                    }
                }).$promise
            })
        };
    });
