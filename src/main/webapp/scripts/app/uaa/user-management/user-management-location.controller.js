'use strict';

angular.module('uaaUIApp')
    .controller('UserManagementLocationController',
    function($scope, $filter, $q, $uibModalInstance, entity, Group, Member, MemberType) {
        $scope.user = entity;
        $scope.members = [];
        
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.selectItem = function(node, $event) {
            // disable Event bubbling
            if($event){
                $event.stopPropagation();
            }

            return reflashChildItem(node)
                .then(function(members){
                    if(members.length === 0){
                        node.nochild = true;
                    }else{
                        delete node.nochild;
                    }
                    return members;
                })
        };

        $scope.expandItem = function(node, $event) {
            // disable Event bubbling
            if($event){
                $event.stopPropagation();
            }

            if(node.nochild === true){
                return;
            }
            if(node.members.length > 0){
                node.show = !node.show;
            }else{
                $scope.selectItem(node)
                    .then(function(members){
                        if(members.length > 0){
                            node.show = !node.show;
                        }
                    });
            }
        };

        $scope.toggleItem = function(node, $event){
            // disable Event bubbling
            if($event){
                $event.stopPropagation();
            }
            if(node.type === 'DIRECT'){
                Member.remove({gid: node.id, id: $scope.user.id}, function(result){
                    if(isInDirect(node)){
                        node.type = 'INDIRECT';
                    }else{
                        node.type = 'NONE';
                    }
                    reflashParentType(node);
                });
            }else{
                Member.add({gid: node.id}, {
                    origin: "uaa",
                    type: "USER",
                    value: $scope.user.id
                }, function(result){
                    node.type = 'DIRECT';
                    reflashParentType(node);
                });
            }
        };

        var isInDirect = function(node){
            var findInUser = $filter('filter')(node.members, {'type':'!NONE'}, true);
            return findInUser.length > 0;
        };

        var reflashParentType = function(node){
            angular.forEach(node.parents,function(parent){
                //UnSure
                if(parent.type === 'INDIRECT' ||
                    parent.type === 'NONE'){
                    if(isInDirect(parent)){
                        parent.type = 'INDIRECT';
                    }else{
                        parent.type = 'NONE';
                    }
                    reflashParentType(parent);
                }
            });
        };

        var reflashChildItem = function(node) {
            var deferred = $q.defer();

            var mapping_node = function(members){
                var group_members = [];
                angular.forEach(members, function(member){
                    if(member.type === 'USER'){
                        return;
                    }
                    //Comparison change of members
                    var nodeMember;
                    var findOldMember = $filter('filter')(node.members, {'id':member.value}, true);
                    if(findOldMember.length > 0){
                        nodeMember = findOldMember[0];
                    }else{
                        nodeMember = {
                            id: member.value,
                            type: 'NONE',
                            members: [],
                            parents: [],
                            show: false,
                            nochild: false
                        };
                        node.members.push(nodeMember);
                        nodeMember.parents.push(node);
                    }
                    //reflash name
                    MemberType.getName(member)
                        .then(function(name){
                            nodeMember.name = name;
                        });
                    group_members.push(nodeMember);
                });
                return group_members;
            };

            Member.list({gid: node.id, returnEntities: true}).$promise
                .then(mapping_node)
                .then(function(members){
                    deferred.resolve(members);
                })
                .catch(function(res){
                    if(res.status === 404){
                        //when delete zone 
                        //the switching scopes member relationship will not be deleted
                        Member.list({gid: node.id, returnEntities: false}).$promise
                            .then(mapping_node)
                            .then(function(members){
                                deferred.resolve(members);
                            })
                    }else{
                        deferred.reject(res);
                    }
                })

            return deferred.promise;
        };

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

                var createNode = function(memberOrGroup){
                    var node;
                    if(memberOrGroup.display){
                        var group = memberOrGroup;
                        node = {
                            id: group.value,
                            name: group.display,
                            type: group.type,
                            members: [],
                            parents: [],
                            show: false,
                            nochild: true
                        };
                    }else{
                        var member = memberOrGroup;
                        node = {
                            id: member.value,
                            name: '',
                            type: 'NONE',
                            members: [],
                            parents: [],
                            show: false,
                            nochild: false
                        };

                        if(angular.isDefined(member.entity)){
                            node.name = member.entity.displayName;
                        }else{
                            MemberType.getName(member)
                                .then(function(name){
                                    node.name = name;
                                });
                        }
                    }
                    
                    nodes.push(node);
                    return node;
                };

                var findNode = function(member){
                    var findInRoot = $filter('filter')($scope.members, {'id':member.value}, true);
                    if(findInRoot.length > 0){
                        var index = $scope.members.indexOf(findInRoot[0]);
                        $scope.members.splice(index, 1);
                        return findInRoot[0];
                    }

                    var findInAll = $filter('filter')(nodes, {'id':member.value}, true);
                    if(findInAll.length > 0){
                        return findInAll[0];
                    }

                    return null;
                };

                var mappingNode = function(results){
                    angular.forEach(user.groups, function(group){
                        var node = findNode(group);
                        if(node === null){
                            node = createNode(group);
                            $scope.members.push(node);
                        }
                        
                        //members to child nodes
                        var members = results.shift();
                        angular.forEach(members, function(member){
                            if(member.type === 'GROUP'){
                                var node_child = findNode(member);
                                if(node_child === null){
                                    var findInUser = $filter('filter')(user.groups, {'value':member.value}, true);
                                    if(findInUser.length > 0){
                                        node_child = createNode(findInUser[0]);
                                    }else{
                                        node_child = createNode(member);
                                    }
                                }
                                node.members.push(node_child);
                                node_child.parents.push(node);
                            }
                        });

                        node.nochild = node.members.length === 0;
                        node.show = node.members.length !== 0;
                    });
                };

                var promises = [];
                angular.forEach(user.groups, function(group){
                    var promise = Member.list({gid: group.value, returnEntities: true}).$promise;
                    promises.push(promise);
                });
                $q.all(promises).then(mappingNode)
                    .catch(function(){
                        promises = [];
                        angular.forEach(user.groups, function(group){
                            var promise = Member.list({gid: group.value, returnEntities: false}).$promise;
                            promises.push(promise);
                        });
                        $q.all(promises).then(mappingNode);
                    });
            });
        };

        init();

    });
