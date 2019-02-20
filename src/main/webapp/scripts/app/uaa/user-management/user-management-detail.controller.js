'use strict';

angular.module('uaaUIApp')
    .controller('UserManagementDetailController', 
    function ($scope, $stateParams, User, UserPassword, TokenServerProvider, Setting, AlertService, Principal) {
        $scope.user = {};
        $scope.load = function (id) {
            Principal.identity()
                .then(function(userInfo){
                    $scope.isMe = (userInfo.user_id === id)
                })
                .catch(function(){
                    $scope.isMe = false
                })
            User.get({id: id}, function(result) {
                $scope.user = result;
            });
        };
        $scope.load($stateParams.id);

        $scope.changePassword = function() {
            //change use manager token
            if($scope.isMe || 
                (Principal.hasScope('password.write') || Principal.hasAuthority('password'))) {
                UserPassword.change({id: $scope.user.id}, {
                    "oldPassword" : $scope.secret.old_password,
                    "password" : $scope.secret.password
                }, function(result) {
                    AlertService.success(result.message);

                    if($scope.isMe){
                        TokenHolder.remove();
                        Principal.authenticate(undefined)
                        $state.go('home', null, { reload: true });
                    }
                }).$promise
                return
            }

            var setting = Setting.get();
            TokenServerProvider.password({
                clientId: setting.clientId,
                clientSecret: setting.clientSecret,
                username: $scope.user.userName,
                password: $scope.secret.old_password
            }).then(function(response){
                var token = response.data.access_token
                UserPassword.change({id: $scope.user.id}, {
                    "oldPassword" : $scope.secret.old_password,
                    "password" : $scope.secret.password,
                    "token" : token
                }, function(result) {
                    AlertService.success(result.message);
                }).$promise
            })
        };
    });
