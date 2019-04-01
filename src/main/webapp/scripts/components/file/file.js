'use strict';

angular.module('file',[])

.factory('readFile', function ($window, $q) {
    var readFile = function (file) {
        var deferred = $q.defer(),  
            reader = new $window.FileReader();

        reader.onload = function (ev) {
            var content = ev.target.result;
            deferred.resolve(content);
        };

        reader.readAsText(file);
        return deferred.promise;
    };

    return readFile;
})

// does not capture input change event
.directive('fileHandler', function (readFile) {
    return {
        link: function (scope, element) {
            element.on('change', function (event) {
                var file = event.target.files[0];
                readFile(file).then(function (content) {
                    console.log(content);
                });
            });
        }
    };
})

.directive('fileBrowser', function () {
    return {
        require: "ngModel",
        template: '<input type="file" style="display: none;" />' +
            '<ng-transclude></ng-transclude>',
        transclude: true,
        link: function (scope, element, attrs, ngModel) {
            var fileInput = element.children('input');
            
            ngModel.$render = function() {
                // element.html(ngModel.$viewValue || '');
            };

            fileInput.on('change', function (event) {
                var file = event.target.files[0];
                // scope[ngModel.ngModel] = file;
                
                ngModel.$setViewValue(file);
                // readFile(file).then(function (content) {
                //     console.log(content);
                // });
                // disable Event bubbling
                // if(event){
                //     event.stopPropagation();
                // }
                // scope.f
            });
            
            element.on('click', function () {
                fileInput[0].click();
            });
        }
    };
});