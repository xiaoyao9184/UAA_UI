'use strict';

angular.module('uaaUIApp')
    .service('GuessSearch', function (moment) {

        moment.suppressDeprecationWarnings = true;
        var configs = [];

        var conversion = function(data,context){
            for (var key in data) { 
                if(angular.isFunction(data[key])){
                    data[key] = data[key](context);
                }
            }
        };


        this.config = function(config) {
            configs = [];
            if(angular.isArray(config)){
                angular.forEach(config, function(config){
                    configs.push(config);
                });
            }else{
                configs.push(config);
            } 
        };
    
        this.guess = function(search, current) {
            var result = [];
            angular.forEach(configs, function(config){
                var data = null;
                var context = search;
                if(angular.isFunction(config.support)){
                    if(config.support(search,current)){
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
                }else if (config.support === 'url'){
                    try{
                        new URL(search);
                        data = angular.copy(config.data);
                    }catch(e){}
                }else if (config.support === 'email'){
                    if(angular.isString(search) &&
                        search.indexOf('@') !== -1){
                        data = angular.copy(config.data);
                    }
                }else if (config.support === true){
                    data = angular.copy(config.data);
                }
                
                if(data === null){
                    return;
                }

                if(angular.isFunction(data)){
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
        };

    });

