'use strict';

angular.module('uaaUIApp')
    .controller('ClientManagementController', function ($scope, $q, Client, ClientMeta, Base64) {
        $scope.apps = [];
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

        $scope.clients = [];
        $scope.search = '';
        $scope.pageTotal = 0
        $scope.pageNumber = 1;
        $scope.pageSize = 5;
        $scope.loadPage = function () {
            //attribute in https://github.com/cloudfoundry/uaa/blob/4.26.0/model/src/main/java/org/cloudfoundry/identity/uaa/resources/jdbc/SimpleSearchQueryConverter.java#L45-L98
            var filter = 
                'client_id co \'' + $scope.search + '\'' + 
                ' or web_server_redirect_uri co \'' + $scope.search + '\'' +
                ' or authorized_grant_types co \'' + $scope.search + '\'' +
                ' or scope co \'' + $scope.search + '\'';
            if($scope.search.length === 0){
                filter = null
            }
            var startIndex = ($scope.pageNumber - 1) * $scope.pageSize + 1
            Client.query({startIndex: startIndex, count: $scope.pageSize, filter: filter}, function (result) {
                $scope.clients = result.resources;
                $scope.pageTotal = result.totalResults;
            });
        };

        $scope.loadAllApp();
        $scope.loadPage();

        $scope.clear = function () {
            $scope.client = {};
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


        $scope.filters = [
            {
                name: "equals",
                operator: "eq"
            },
            {
                name: "contains",
                operator: "co"
            },
            {
                name: "starts",
                operator: "sw"
            },
            {
                name: "present",
                operator: "pr"
            },
            {
                name: "greater",
                operator: "gt"
            },
            {
                name: "greater equals",
                operator: "ge"
            },
            {
                name: "less",
                operator: "lt"
            },
            {
                name: "less equals",
                operator: "le"
            },
        ];

        $scope.search = []

        $scope.selectOne = function(item, model, search){
            console.log(item);
            console.log(model);
            console.log(search);
            console.log(arguments);
            
        }
        $scope.newOne = function(item, model, search){
            console.log(item);
            console.log(model);
            console.log(search);
            console.log(arguments);
            return item;
        }
        
    });
