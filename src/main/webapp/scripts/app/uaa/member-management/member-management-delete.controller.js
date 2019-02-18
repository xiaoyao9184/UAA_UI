'use strict';

angular.module('uaaUIApp').controller('MemberManagementDeleteController',
    ['$scope', '$q', '$filter', '$uibModalInstance', 'paths', 'MemberType', 'Member', 'AlertService',
        function($scope, $q, $filter, $uibModalInstance, paths, MemberType, Member, AlertService) {
        
        $scope.paths = paths;
        
        $scope.actionItems = [];

        $scope.members = [];

        $scope.changePath = function($index, $event) {
            if($index+1 === $scope.paths.length){
                return
            }else if($index+1 > $scope.paths.length){
                $index = $scope.paths.length -1
            }

            // change paths
            $scope.paths = $scope.paths.slice(0,$index+1);

            // reflash
            var path = $scope.paths[$index];
            return Member.list({gid: path.id}, function (result) {
                result.forEach(element => {
                    element.id = element.value
                    MemberType.getName(element)
                        .then(function(name){
                            element.name = name
                        })
                });
                $scope.members = result;
            }).$promise;
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
            // var index = $scope.addItems.indexOf(item);
            $scope.actionItems.splice(index, 1);
        };

        var onSaveSuccess = function (result) {
            $scope.isSaving = false;
            $uibModalInstance.close(result);
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.changePath($scope.paths.length);

        $scope.save = function () {
            $scope.isSaving = true;
            var path = $scope.paths.slice(-1)[0];
            var promises = []
            angular.forEach($scope.actionItems, function(member){
                promises.push(
                    Member.remove({gid: path.id, id: member.id}, function(result){
                        var find = $filter('filter')($scope.actionItems, {'id':result.value}) 
                        if(find != null && find.length === 1){
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
