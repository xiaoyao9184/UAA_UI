'use strict';

angular.module('uaaUIApp')
    .controller('UserManagementLocationController',
    function($scope, $filter, $q, $uibModalInstance, entity, Group, Member) {
        $scope.user = entity;
        $scope.roots = [];
        
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.expandItem = function(member, $event) {
            // disable Event bubbling
            if($event){
                $event.stopPropagation();
            }
            if(!member.members ||
                member.members.length === 0){
                member.nochild = true;
            }else{
                member.show = !member.show;
            }
        };
        $scope.selectItem = $scope.expandItem;

        var init = function() {
            var promise;
            if(angular.isUndefined($scope.user.$promise)){
                var deferred = $q.defer();
                deferred.resolve($scope.user);
                promise = deferred.promise;
            }else{
                promise = $scope.user.$promise;
            }
            promise.then(function(user){
                var nodes = [];

                var createNode = function(member){
                    var node = angular.copy(member);
                    node.id = node.value;
                    node.name = node.display;
                    nodes.push(node);
                    return node;
                };

                var findNode = function(member){
                    var findInRoot = $filter('filter')($scope.roots, {'value':member.value}, true);
                    if(findInRoot.length > 0){
                        var index = $scope.roots.indexOf(findInRoot[0]);
                        $scope.roots.splice(index, 1);
                        return findInRoot[0];
                    }

                    var findInAll = $filter('filter')(nodes, {'value':member.value}, true);
                    if(findInAll.length > 0){
                        return findInAll[0];
                    }

                    return null;
                };

                var promises = [];
                angular.forEach(user.groups, function(group){
                    var promise = Member.list({gid: group.value}).$promise;
                    promises.push(promise);
                });

                $q.all(promises).then(function(results){
                    angular.forEach(user.groups, function(group){
                        var node = findNode(group);
                        if(node === null){
                            node = createNode(group);
                            $scope.roots.push(node);
                        }else{
                            angular.merge(node,group);
                        }
                        
                        
                        // node.members = results.shift();
                        // node.child = [];
                        // angular.forEach(node.members, function(member){
                        //     if(member.type === 'GROUP'){
                        //         var node_child = findNode(member);
                        //         if(node_child === null){
                        //             var findInUser = $filter('filter')(user.groups, {'value':member.value}, true);
                        //             if(findInUser.length > 0){
                        //                 node_child = createNode(member);
                        //             }
                        //         }
                        //         if(node_child !== null){
                        //             node.child.push(node_child);
                        //         }
                        //     }
                        // });

                        var members = results.shift();
                        node.members = [];
                        angular.forEach(members, function(member){
                            if(member.type === 'GROUP'){
                                var node_child = findNode(member);
                                if(node_child === null){
                                    var findInUser = $filter('filter')(user.groups, {'value':member.value}, true);
                                    if(findInUser.length > 0){
                                        node_child = createNode(findInUser[0]);
                                    }else{
                                        node_child = createNode(member);
                                        node_child.type = 'NONE';
                                        node_child.name = '(unrelated)';
                                    }
                                }
                                node.members.push(node_child);
                            }
                        });
                        node.show = node.members.length !== 0;
                    });

                    var a = $scope.roots;
                });
            });
        };

        init();

    });
