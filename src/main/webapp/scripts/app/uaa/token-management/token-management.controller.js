'use strict';

angular.module('uaaUIApp')
    .controller('TokenManagementController', 
    function ($scope, $stateParams, $state, $filter,
        Token, Group,
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
                    angular.forEach(result, function(item){
                        item.scope = item.scope.replace(/\[|\]/g,"").split(", ");
                    });
                });
            }else if($scope.type === 'client'){
                Token.clientList({id: $scope.id}, function (result) {
                    $scope.tokens = result;
                    angular.forEach(result, function(item){
                        item.scope = item.scope.replace(/\[|\]/g,"").split(", ");
                    });
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
                    AlertService.success('<strong>UI: </strong>Revoke token success!');

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

        
        $scope.goGroupListOrDetail = function(displayName){
            var wild = false;
            var operator = 'eq';
            if(displayName.indexOf('*') !== -1){
                wild = true;
                operator = 'co';
                displayName = displayName.replace('*','');
            }

            Group.query({filter: 'displayname ' + operator + ' \'' + displayName + '\''}, function (result) {
                var find = $filter('filter')(result.resources, {'displayName':displayName}, !wild);
                if(find.length === 1){
                    $state.go("group-management-detail",{id: find[0].id});
                }else if(find.length > 1){
                    $state.go("group-management",{search: displayName});
                }else{
                    AlertService.warning('<strong>UI: </strong>' + displayName + ' is not Group!',{timeout:1000000});
                }
            });
        };
    });
