'use strict';

angular.module('uaaUIApp')
    .controller('UserManagementDetailController', 
    function ($scope, $state, $stateParams, $location,
        User, UserPassword, UserStatus, UserVerify, UserVerifyLink,
        TokenServerProvider, Principal, Setting, AlertService) {
         
        if($state.current.name !== 'token-user'){
            $state.go('token-user')
        }
        
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

        $scope.unlockAccount = function() {
            UserStatus.change({id: $scope.user.id}, {
                "locked" : false
            }, function(result) {
                AlertService.success('UI: Unlock account success!');
            }).$promise
        };

        $scope.expirePassword = function() {
            UserStatus.change({id: $scope.user.id}, {
                "passwordChangeRequired" : true
            }, function(result) {
                AlertService.success('UI: Force user password to expire success!');
            }).$promise
        };


        $scope.verify = {
            redirect_uri: $location.absUrl().replace(/#\/.*/gi, ''),
            verify_link: ''
        }
        $scope.verifyUser = function() {
            UserVerify.verify({id: $scope.user.id}, function(result) {
                $scope.user = result;
                AlertService.success('UI: Verify user success!');
            }).$promise
        };
        $scope.verifyLink = function() {
            UserVerifyLink.verify({id: $scope.user.id,
                redirect_uri: $scope.verify.redirect_uri
            }, function(result) {
                $scope.verify.verify_link = result.verify_link;
                AlertService.success('UI: Verify link create success!');
            }).$promise
        };
    });
