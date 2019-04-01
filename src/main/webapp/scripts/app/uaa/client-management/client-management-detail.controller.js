'use strict';

angular.module('uaaUIApp')
    .controller('ClientManagementDetailController', function (
        $scope, $state, $stateParams, 
        Client, ClientSecret, 
        TokenServerProvider, TokenHolder, Principal, AlertService) {
        
        if($state.current.name !== 'token-client'){
            $state.go('token-client');
        }
        
        $scope.client = {};
        $scope.load = function (id) {
            $scope.isMe = TokenHolder.getJwt().payload.client_id === id;
            Client.get({id: id}, function(result) {
                $scope.client = result;
            });
        };
        $scope.load($stateParams.id);

        $scope.changeSecret = function () {
            //Only a client can change client secret
            //So not change use manager token
            TokenServerProvider.client({
                clientId: $scope.client.client_id,
                clientSecret: $scope.secret.old_secret,
            }).then(function(response){
                var token = response.data.access_token;
                ClientSecret.change({id: $scope.client.client_id}, {
                    "clientId" : $scope.client.client_id,
                    "secret" : $scope.secret.secret,
                    "token" : token
                }, function(result) {
                    AlertService.success(result.message);

                    if($scope.isMe){
                        TokenHolder.remove();
                        Principal.authenticate(undefined);
                        $state.go('home', null, { reload: true });
                    }
                }).$promise;
            });
        };
    });
