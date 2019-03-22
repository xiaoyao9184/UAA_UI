'use strict';

angular.module('uaaUIApp')
    .service('GuessSearch', function (moment) {

        var configs = [];


        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var ARGUMENT_NAMES = /([^\s,]+)/g;
        function getParamNames(func) {
            var fnStr = func.toString().replace(STRIP_COMMENTS, '');
            var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
            if(result === null)
                result = [];
            return result;
        }

        var isFunctionParamContext = function(func){
            if(angular.isFunction(func)){
                var params = getParamNames(func);
                if(params.length === 1 && 
                    params[0] === 'context'){
                    return true;
                }
            }
            return false;
        }

        var conversion = function(data,context){
            for (var key in data) { 
                if(isFunctionParamContext(data[key])){
                    data[key] = data[key](context);
                }
            }
        }


        this.config = function(config) {
            configs = [];
            if(angular.isArray(config)){
                angular.forEach(config, function(config){
                    configs.push(config);
                });
            }else{
                configs.push(config);
            } 
        }
    
        this.guess = function(search) {
            var result = [];
            angular.forEach(configs, function(config){
                var data = null;
                var context = search;
                if(angular.isFunction(config.support)){
                    if(config.support(search)){
                        data = angular.copy(config.data);
                    }
                }else if (config.support === 'moment'){
                    if(!!search){
                        var date = moment(search);
                        if(date.isValid()){
                            data = angular.copy(config.data);
                            context = {
                                moment: date,
                                text: search
                            };
                        }
                    }
                }else if (config.support === 'string'){
                    if(angular.isString(search) &&
                        search !== ''){
                        data = angular.copy(config.data);
                    }
                }else if (config.support === true){
                    data = angular.copy(config.data);
                }
                
                if(data === null){
                    return;
                }

                if(isFunctionParamContext(data)){
                    data = data(context);
                }
                if(angular.isArray(data)){
                    var datas = data;
                    angular.forEach(datas, function(data){
                        conversion(data,context);
                        result.push(data);
                    });
                }else{
                    conversion(data,context);
                    result.push(data);
                }                
            });
            
            return result;
        }

    });

