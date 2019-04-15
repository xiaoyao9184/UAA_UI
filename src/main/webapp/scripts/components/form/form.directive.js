/* globals $ */
'use strict';

angular.module('uaaUIApp')
    .directive('showValidation', function() {
        var watchInvalidAndDirty = function($scope,$inputs,$watchers,$toggle){
            $inputs.each(function() {
                var $input = $(this);
                var watch = $scope.$watch(function() {
                    return $input.hasClass('ng-invalid') ;
                }, function(isInvalid) {
                    $toggle.toggleClass('has-error', isInvalid);
                });
                $watchers.push(watch);
            });
        };

        var warchFormInline = function(scope, element, watchers){
            var $formInline = element.find('div.form-inline');
            if($formInline.length > 0){
                $formInline.each(function() {
                    var $inline = $(this);
                    var $inputs = $inline.find('input[ng-model],textarea[ng-model],select[ng-model]');
                    
                    watchInvalidAndDirty(scope,$inputs,watchers,$inline);
                });
                return;
            }
            var $inputs = element.find('input[ng-model],textarea[ng-model],select[ng-model]');
            watchInvalidAndDirty(scope,$inputs,watchers,element);
        };

        var watchForm = function(scope, element, watchers){
            element.find('.form-group').each(function() {
                var $formGroup = $(this);
                var $inputs = $formGroup.find('input[ng-model],textarea[ng-model],select[ng-model]');

                if ($inputs.length > 0) {
                    watchInvalidAndDirty(scope,$inputs,watchers,$formGroup);
                }else{
                    var watcherInline = {
                        length: null,
                        inputs: []
                    };
                    watchers.push(watcherInline);
                    
                    watcherInline.length = scope.$watch(function() {
                        $inputs = $formGroup.find('input[ng-model],textarea[ng-model],select[ng-model]');
                        return $inputs.length;
                    }, function() {
                        //remove all watcher
                        watcherInline.inputs.forEach(function(watcher) {
                            watcher();
                        });
                        watcherInline.inputs = [];
                        //add all watcher
                        warchFormInline(scope, $formGroup, watcherInline.inputs, $formGroup)
                    });
                }
            });
        };

        return {
            restrict: 'A',
            require: 'form',
            link: function (scope, element) {
                var watchers = [];
                if(element.find('[ui-view]').length > 0){
                    scope.$watch(function() {
                        var formGroups = element.find('.form-group');
                        return formGroups.length;
                    }, function() {
                        //remove all watcher
                        watchers.forEach(function(watcher) {
                            if(angular.isFunction(watcher)){
                                watcher();
                            }else{
                                watcher.length();
                                watcher.inputs.forEach(function(watcher) {
                                    watcher();
                                });
                            }
                        });
                        watchers = [];
                        //add all watcher
                        watchForm(scope, element, watchers);
                    });
                } else {
                    watchForm(scope, element, watchers);
                }
            }
        };
    });