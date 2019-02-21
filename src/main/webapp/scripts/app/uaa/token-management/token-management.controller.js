'use strict';

angular.module('uaaUIApp')
    .controller('TokenManagementController', 
    function ($scope, $stateParams, $location,
        Token,
        TokenHolder, ZoneHolder, Principal, AlertService) {
        
        $scope.init = function (id,type) {
            $scope.id = id;
            $scope.type = type;
            if(type === 'user'){
                Principal.identity()
                    .then(function(userInfo){
                        $scope.isMe = (userInfo.user_id === id)
                    })
                    .catch(function(){
                        $scope.isMe = false
                    })
            }else if(type === 'client'){
                $scope.isMe = TokenHolder.getJwt().payload.client_id === id;
            }
            $scope.loadToken();

            ZoneHolder.current()
                .then(function(zone){
                    $scope.zoneId = zone.id;
                    $scope.tokenPolicy = zone.config.tokenPolicy
                })
        };

        $scope.tokens = [];
        $scope.loadToken = function () {
            if($scope.type === 'user'){
                Token.userList({id: $scope.id}, function (result) {
                    $scope.tokens = result;
                });
            }else if($scope.type === 'client'){
                Token.clientList({id: $scope.id}, function (result) {
                    $scope.tokens = result;
                });
            }
        };
        $scope.revokeToken = function (id) {
            if(!id){
                if(type === 'user'){
                    Token.userRevoke({id: $scope.id}, function (result) {
                        $scope.tokens = result;
                    });
                }else if(type === 'client'){
                    Token.clientRevoke({id: $scope.id}, function (result) {
                        $scope.tokens = result;
                    });
                }
            }else{
                Token.revoke({id: id}, function () {
                    AlertService.success('UI: Revoke token success!');

                    // token will not expire immediately
                    if($scope.isMe){
                        TokenHolder.remove();
                        Principal.authenticate(undefined)
                        $state.go('home', null, { reload: true });
                        return
                    }
                    $scope.loadToken()
                });
            }
        };

        $scope.init($stateParams.id, $stateParams.type);
    });
