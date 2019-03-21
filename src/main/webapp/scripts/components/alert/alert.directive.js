'use strict';

angular.module('uaaUIApp')
    .directive('jhAlert', function(AlertService) {
        return {
            restrict: 'E',
            template: '<div class="alerts" ng-cloak="">' +
                            '<div ng-repeat="alert in alerts" ng-class="[alert.position, {\'toast\': alert.toast}]">' +
                                '<div uib-alert ng-bind-html="alert.msg" ng-cloak="" ng-class="\'alert-{{alert.type}}\'" close="alert.close()">' +
                                    // '<pre>{{ alert.msg }}</pre>' +
                                    // '{{ alert.msg }}' + 
                                    // '<pre ng-bind-html="alert.msg"></pre>' + 
                                '</div>' +
                            '</div>' +
                      '</div>',
            controller: ['$scope',
                function($scope) {
                    $scope.alerts = AlertService.get();
                    $scope.$on('$destroy', function () {
                        $scope.alerts = [];
                    });
                }
            ]
        }
    })
    .directive('jhAlertError', function(AlertService, $rootScope) {
        return {
            restrict: 'E',
            template: '<div class="alerts" ng-cloak="">' +
                            '<div ng-repeat="alert in error_alerts" ng-class="[alert.position, {\'toast\': alert.toast}]">' +
                                '<div uib-alert ng-bind-html="alert.msg" ng-cloak="" ng-class="\'alert-{{alert.type}}\'" close="alert.close(error_alerts)">' + 
                                    // '<pre>{{ alert.msg }}</pre>' + 
                                    // '{{ alert.msg }}' + 
                                    // '<pre ng-bind-html="alert.msg"></pre>' + 
                                '</div>' +
                            '</div>' +
                      '</div>',
            controller: ['$scope',
                function($scope) {

                    $scope.error_alerts = [];

                    var cleanHttpErrorListener = $rootScope.$on('uaaUIApp.httpError', function (event, httpResponse) {
                        var i;
                        event.stopPropagation();
                        switch (httpResponse.status) {
                            // connection refused, server not reachable
                            case 0:
                                addErrorAlert("Server not reachable",'error.server.not.reachable');
                                break;

                            case 400:
                                var errorHeader = httpResponse.headers('X-uaaUIApp-error');
                                var entityKey = httpResponse.headers('X-uaaUIApp-params');
                                if (errorHeader) {
                                    var entityName = entityKey;
                                    addErrorAlert(errorHeader, errorHeader, {entityName: entityName});
                                } else if (httpResponse.data && httpResponse.data.fieldErrors) {
                                    for (i = 0; i < httpResponse.data.fieldErrors.length; i++) {
                                        var fieldError = httpResponse.data.fieldErrors[i];
                                        // convert 'something[14].other[4].id' to 'something[].other[].id' so translations can be written to it
                                        var convertedField = fieldError.field.replace(/\[\d*\]/g, "[]");
                                        var fieldName = convertedField.charAt(0).toUpperCase() + convertedField.slice(1);
                                        addErrorAlert('Field ' + fieldName + ' cannot be empty', 'error.' + fieldError.message, {fieldName: fieldName});
                                    }
                                } else if (httpResponse.data && httpResponse.data.message) {
                                    addErrorAlert(httpResponse.data.message, httpResponse.data.message, httpResponse.data);
                                } else if (httpResponse.data && httpResponse.data.error) {
                                    addErrorAlert(httpResponse.data.error_description, httpResponse.data.error, httpResponse.data);
                                } else {
                                    addErrorAlert(httpResponse.data);
                                }
                                break;

                            default:
                                if (httpResponse.data && httpResponse.data.message) {
                                    addErrorAlert(httpResponse.data.message);
                                } else if (httpResponse.data && httpResponse.data.error) {
                                    addErrorAlert(httpResponse.data.error_description);
                                } else {
                                    addErrorAlert(JSON.stringify(httpResponse));
                                }
                        }
                    });

                    $scope.$on('$destroy', function () {
                        if(cleanHttpErrorListener !== undefined && cleanHttpErrorListener !== null){
                            cleanHttpErrorListener();
                            $scope.error_alerts = [];
                        }
                    });

                    var addErrorAlert = function (message, key, data) {
                        $scope.error_alerts.push(
                            AlertService.add(
                                {
                                    type: "danger",
                                    msg: message,
                                    timeout: 5000,
                                    toast: AlertService.isToast(),
                                    scoped: true
                                },
                                $scope.error_alerts
                            )
                        );
                    }
                }
            ]
        }
    });
