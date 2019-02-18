'use strict';

angular.module('uaaUIApp').controller('MemberManagementAddController',
    ['$scope', '$q', '$filter', '$uibModalInstance', 'paths', 'Group', 'User', 'Member', 'AlertService',
        function($scope, $q, $filter, $uibModalInstance, paths, Group, User, Member, AlertService) {
        
        $scope.paths = paths;

        $scope.actionItems = [];

        $scope.searchUserItems = [];
        $scope.searchGroupItems = [];
        $scope.searchMode = {
            user: true,
            group: true
        }
        $scope.searchText = '';
        $scope.pageTotal = 0;
        $scope.pageSize = 10;
        $scope.pageNumber = 1;


        $scope.changePath = function($index, $event) {
            // change paths
            $scope.paths = $scope.paths.slice(0,$index+1);
        }

        $scope.addAction = function(item) {
            var index = $scope.actionItems.indexOf(item);
            if(index == -1){
                $scope.actionItems.push(item);
            }else{
                AlertService.warning('Already added!');
            }
        };

        $scope.removeAction = function(index) {
            // var index = $scope.actionItems.indexOf(item);
            $scope.actionItems.splice(index, 1);
        };

        $scope.loadPage = function (fixedPage) {
            $scope.searchUserItems = [];
            $scope.searchGroupItems = [];
            var startIndex = ($scope.pageNumber - 1) * $scope.pageSize + 1;

            var promises = []
            if ($scope.searchMode.user) {
                var filter = "userName co '" + $scope.searchText + "'"
                promises.push(
                    User.query({startIndex: startIndex, count: $scope.pageSize, filter: filter})
                        .$promise);
            }
            if ($scope.searchMode.group) {
                var filter = "displayName co '" + $scope.searchText + "'"
                promises.push(
                    Group.query({startIndex: startIndex, count: $scope.pageSize, filter: filter})
                        .$promise);
            }

            $q.all(promises)
                .then(function(results){
                    var user_result = results[0];
                    var group_result = results[1];
                    if(!fixedPage){
                        $scope.pageTotal = Math.max(user_result.totalResults, group_result.totalResults)
                    }
                    angular.forEach(user_result.resources, function(user){
                        $scope.searchUserItems.push({
                            name: user.userName,
                            id: user.id,
                            type: "USER"
                        });          
                    });
                    angular.forEach(group_result.resources, function(group){
                        $scope.searchGroupItems.push({
                            name: group.displayName,
                            id: group.id,
                            type: "GROUP"
                        });          
                    });
                })
        };

        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
            $uibModalInstance.close(result);
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            var path = $scope.paths.slice(-1)[0];
            var promises = []
            angular.forEach($scope.actionItems, function(member){
                promises.push(
                    Member.add({gid: path.id}, {
                        // TODO get by api service
                        origin: "uaa",
                        type: member.type,
                        value: member.id
                    }, function(result){
                        var find = $filter('filter')($scope.actionItems, {'id':result.value}) 
                        if(find.length === 1){
                            var index = $scope.actionItems.indexOf(find[0]);
                            $scope.actionItems.splice(index, 1);
                        }
                    }).$promise);
            });
            $q.all(promises)
                .then(onSaveSuccess)
                .catch(onSaveError)
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

}]);
