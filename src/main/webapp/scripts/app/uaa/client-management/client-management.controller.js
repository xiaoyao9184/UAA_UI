'use strict';

angular.module('uaaUIApp')
    .controller('ClientManagementController', function ($scope, $q, Client, ClientMeta, Base64, ParseLinks) {
        $scope.apps = [];

        $scope.clients = [];
        $scope.pageClients = [];
        $scope.pageTotal = 0
        $scope.pageNumber = 1;
        $scope.pageSize = 5;



        $scope.loadAllApp = function () {
            return ClientMeta.query().$promise
                .then(function(result){
                    $scope.apps = result;
                    angular.forEach(result, function(app){
                        var content = Base64.decode(app.appIcon)
                        if(/data:.*\/.*;base64,/g.test(content)){
                            app.appIconUrl = content;
                        }else{
                            app.appIconUrl = "data:image/png;base64," + app.appIcon
                        }
                    })
                });
        }

        $scope.loadAll = function () {
            return Client.query().$promise
                .then(function(result){
                    $scope.clients = result.resources;
                    $scope.pageTotal = result.totalResults;
                });
        }
        $scope.loadPage = function () {            
            if($scope.pageTotal !== 0){
                var startIndex = ($scope.pageNumber - 1) * $scope.pageSize;
                $scope.pageClients = $scope.clients.slice(startIndex, startIndex + $scope.pageSize);
                return
            }
        };

        $scope.loadAllApp();

        $scope.loadAll()
            .then(function(){
                $scope.loadPage()
            });

        $scope.clear = function () {
            $scope.client = {
                id: null, name: null
            };
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });
