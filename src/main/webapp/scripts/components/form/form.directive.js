/* globals $ */
'use strict';

angular.module('uaaUIApp')
    .directive('showValidation', function() {
        var watchInvalidAndDirty = function($scope,$inputs,$watchers,$toggle){
            $inputs.each(function() {
                var $input = $(this);
                var watch = $scope.$watch(function() {
                    return $input.hasClass('ng-invalid') && $input.hasClass('ng-dirty');
                }, function(isInvalid) {
                    $toggle.toggleClass('has-error', isInvalid);
                });
                $watchers.push(watch);
            });
        }

        return {
            restrict: 'A',
            require: 'form',
            link: function (scope, element) {
                element.find('.form-group').each(function() {
                    var $formGroup = $(this);
                    var $inputs = $formGroup.find('input[ng-model],textarea[ng-model],select[ng-model]');

                    if ($inputs.length > 0) {
                        var warchers = [];
                        watchInvalidAndDirty(scope,$inputs,warchers,$formGroup);
                    }else{
                        var warchers = [];
                        var $formInline;
                        scope.$watch(function() {
                            $inputs = $formGroup.find('input[ng-model],textarea[ng-model],select[ng-model]');
                            return $inputs.length;
                        }, function() {
                            //remove all warcher
                            warchers.forEach(function(warcher) {
                                warcher();
                            });
                            //add all warcher
                            $formInline = $formGroup.find('div.form-inline');
                            if($formInline.length > 0){
                                $formInline.each(function() {
                                    var $inline = $(this);
                                    $inputs = $inline.find('input[ng-model],textarea[ng-model],select[ng-model]');
                                    
                                    watchInvalidAndDirty(scope,$inputs,warchers,$inline);
                                });
                                return;
                            }
                            watchInvalidAndDirty(scope,$inputs,warchers,$formGroup);
                        });
                    }
                });
            }
        };
    });