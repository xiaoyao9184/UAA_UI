'use strict';

angular.module('uaaUIApp')
    .controller('ClientManagementController', function ($scope, $q, Client, ClientMeta, Base64, ParseLinks) {
        $scope.apps = [];

        $scope.clients = [];
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

        $scope.loadPage = function () {
            var startIndex = ($scope.pageNumber - 1) * $scope.pageSize + 1
            Client.query({startIndex: startIndex, count: $scope.pageSize}, function (result) {
                $scope.clients = result.resources;
                $scope.pageTotal = result.totalResults;
            });
        };

        $scope.loadAllApp();
        $scope.loadPage();

        $scope.clear = function () {
            $scope.client = {
                id: null, name: null
            };
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };


        $scope.grants = {
            "client_credentials": {
                name: "client_credentials"
            },
            "implicit": {
                name: "implicit"
            },
            "password": {
                name: "password"
            },
            "authorization_code": {
                name: "authorization_code"
            },
            "refresh_token": {
                name: "refresh_token"
            },
            "user_token": {
                name: "user_token"
            },
            "urn:ietf:params:oauth:grant-type:saml2-bearer": {
                name: "saml2-bearer"
            },
            "urn:ietf:params:oauth:grant-type:jwt-bearer": {
                name: "jwt-bearer"
            },
        }
    });
