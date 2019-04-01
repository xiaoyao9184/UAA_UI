'use strict';

angular.module('uaaUIApp')
    .controller('UserManagementDetailController', 
    function ($scope, $state, $stateParams, $location, clipboard,
        User, UserPassword, UserStatus, UserVerify, UserVerifyLink, UserMFARegistration, Password, Email,
        TokenServerProvider, TokenHolder, Principal, Setting, AlertService) {
         
        if($state.current.name !== 'token-user'){
            $state.go('token-user');
        }
        var setting = Setting.get();
        
        $scope.user = {};
        $scope.load = function (id) {
            Principal.identity()
                .then(function(userInfo){
                    $scope.isMe = (userInfo.user_id === id);
                })
                .catch(function(){
                    $scope.isMe = false;
                });
            User.get({id: id}, function(result) {
                $scope.user = result;
            });
        };
        $scope.load($stateParams.id);


        $scope.copyText = clipboard.copyText;

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
                        Principal.authenticate(undefined);
                        $state.go('home', null, { reload: true });
                    }
                }).$promise;
                return;
            }

            TokenServerProvider.password({
                clientId: setting.clientId,
                clientSecret: setting.clientSecret,
                username: $scope.user.userName,
                password: $scope.secret.old_password
            }).then(function(response){
                var token = response.data.access_token;
                UserPassword.change({id: $scope.user.id}, {
                    "oldPassword" : $scope.secret.old_password,
                    "password" : $scope.secret.password,
                    "token" : token
                }, function(result) {
                    AlertService.success(result.message);
                }).$promise;
            });
        };

        $scope.reset = {
            password: '',
            code: ''
        };
        $scope.resetPassword = function(useCodeFlow) {
            Password.reset({
                client_id: setting.clientId,
                redirect_uri: $location.absUrl().replace(/#\/.*/gi, '')
            },$scope.user.userName,function(result) {
                if(useCodeFlow){
                    Password.change({},{
                        code: result.code,
                        new_password: $scope.reset.password
                    },function(result) {
                        AlertService.success('<strong>UI: </strong>reset password success!');
                        //TODO
                        var r = result;
                    });
                }else{
                    //use code in other system
                    $scope.reset.code = result.code;
                }
            });
        };

        $scope.email = {
            email: '',
            code: ''
        };
        $scope.changeEmail = function(useCodeFlow) {
            Email.verification({},{
                userId: $scope.user.id,
                email: $scope.email.email,
                client_id: setting.clientId
            },function(result) {
                //TODO https://github.com/cloudfoundry/uaa/issues/951
                AlertService.warning('<strong>UI: </strong>bug ' + 
                    '<a target="_blank" href="https://github.com/cloudfoundry/uaa/issues/951">issues/951</a>' +
                    '!');
                if(useCodeFlow){
                    Email.change({},result.code,function(result) {
                        AlertService.success('<strong>UI: </strong>change email success!');
                        //TODO
                        var r = result;
                    });
                }else{
                    //use code in other system
                    $scope.email.code = result.code;
                }
            });
        };
        
        $scope.deleteMFA = function(){
            UserMFARegistration.delete({id: $scope.user.id},function() {
                AlertService.success('<strong>UI: </strong>delete mfa success!');
            });
        };

        $scope.unlockAccount = function() {
            UserStatus.change({id: $scope.user.id}, {
                "locked" : false
            }, function(result) {
                AlertService.success('<strong>UI: </strong>Unlock account success!');
            }).$promise;
        };

        $scope.expirePassword = function() {
            UserStatus.change({id: $scope.user.id}, {
                "passwordChangeRequired" : true
            }, function(result) {
                AlertService.success('<strong>UI: </strong>Force user password to expire success!');
            }).$promise;
        };


        $scope.verify = {
            redirect_uri: $location.absUrl().replace(/#\/.*/gi, ''),
            verify_link: ''
        };
        $scope.verifyUser = function() {
            UserVerify.verify({id: $scope.user.id}, function(result) {
                $scope.user = result;
                AlertService.success('<strong>UI: </strong>Verify user success!');
            }).$promise;
        };
        $scope.verifyLink = function() {
            UserVerifyLink.verify({id: $scope.user.id,
                redirect_uri: $scope.verify.redirect_uri
            }, function(result) {
                $scope.verify.verify_link = result.verify_link;
                AlertService.success('<strong>UI: </strong>Verify link create success!');
            }).$promise;
        };
    });
