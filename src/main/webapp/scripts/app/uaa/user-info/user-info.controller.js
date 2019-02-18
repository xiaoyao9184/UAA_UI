'use strict';

angular.module('uaaUIApp')
    .controller('UserInfoController', 
        function ($scope, UserInfo, UserPassword, AlertService) {

        UserInfo.get().$promise
            .then(function (info) {
                $scope.userInfo = info;
            });

        $scope.password = {}
        
        $scope.changePassword = function(){
            UserPassword.change({id: $scope.userInfo.user_id},$scope.password).$promise
                .then(function(result){
                    AlertService.success(result.message);
                    $scope.password.oldPassword = $scope.password.password
                    $scope.password.password = ''
                })
        }
    });
