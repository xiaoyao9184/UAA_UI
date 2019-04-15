'use strict';

angular.module('uaaUIApp')
    .factory('Search', function apiService($filter, GuessSearch) {

        var _load;
        var _selected;
        var _filters;
        var _anys;

        var getAfterMomentName = function(context){
            return 'After ' + context.moment.fromNow();
        };

        var getBeforeMomentName = function(context){
            return 'Before ' + context.moment.fromNow();
        };

        var getISOMoment = function(context){
            return context.moment.toISOString();
        };
        
        var getTextMoment = function(context){
            return context.text;
        };
        
        var getText = function(context){
            return context;
        };

        var getAscSortName = function(context){
            return 'Sort ' + context + ' Asc';
        };

        var getDescSortName = function(context){
            return 'Sort ' + context + ' Desc';
        };

        return {
            // attribute {
            //     name,field,moment,order,any
            // }
            init: function(load, selected, attributes, configs) {
                _load = load;
                _selected = selected;
                _anys = $filter('filter')(attributes, {'any':true}, true);
                var _moments = $filter('filter')(attributes, {'moment':'!!'});
                var _urls = $filter('filter')(attributes, {'url':true}, true);
                var _emails = $filter('filter')(attributes, {'email':true}, true);
                var _enums = $filter('filter')(attributes, function(value, index, array){
                    return angular.isArray(value.enum);
                }, true);
                var _sorts = $filter('filter')(attributes, {'sort':true}, true);


                var _configs = [];
                //all
                _configs.push({
                    support: 'string',
                    data: {
                        group: 'Search',
                        icon: 'glyphicon-search',
                        name: function(context){
                            return 'ANY:' + context;
                        },
                        field: "ANY",
                        operator: "co",
                        value: function(context){
                            return context;
                        }
                    }
                });

                //moment
                if(_moments.length > 0){
                    var _moment_datas = [];
                    angular.forEach(_moments,function(attribute){
                        var after = {
                            group: attribute.name,
                            icon: "glyphicon-time",
                            name: getAfterMomentName,
                            tags: getTextMoment,
                            field: attribute.field,
                            operator: 'ge',
                            value: getISOMoment
                        };
                        _moment_datas.push(after);

                        var before = {
                            group: attribute.name,
                            icon: "glyphicon-time",
                            name: getBeforeMomentName,
                            tags: getTextMoment,
                            field: attribute.field,
                            operator: 'le',
                            value: getISOMoment
                        };
                        _moment_datas.push(before);
                        if(angular.isDefined(attribute.value)){
                            after.value = attribute.value;
                            before.value = attribute.value;
                        }
                    });
                    _configs.push({
                        support: 'moment',
                        data: _moment_datas
                    });
                }

                //url
                if(_urls.length > 0){
                    var _url_datas = [];
                    angular.forEach(_urls,function(attribute){
                        var item = {
                            group: attribute.name,
                            icon: "glyphicon-retweet",
                            name: getText,
                            tags: getText,
                            field: attribute.field,
                            operator: 'ge',
                            value: getText
                        };
                        _url_datas.push(item);
                    });
                    _configs.push({
                        support: 'url',
                        data: _url_datas
                    });
                }

                //_emails
                if(_emails.length > 0){
                    var _email_datas = [];
                    angular.forEach(_emails,function(attribute){
                        var item = {
                            group: attribute.name,
                            icon: "glyphicon-envelope",
                            name: getText,
                            tags: getText,
                            field: attribute.field,
                            operator: 'co',
                            value: getText
                        };
                        _email_datas.push(item);
                    });
                    _configs.push({
                        support: 'email',
                        data: _email_datas
                    });
                }

                //enum
                if(_enums.length > 0){
                    var _enum_datas = [];
                    angular.forEach(_enums,function(attribute){
                        var a = {
                            group: attribute.name,
                            field: attribute.field,
                        };
                        angular.forEach(attribute.enum, function(e){
                            var data = angular.merge({},a,e);
                            _enum_datas.push(data);
                        });
                        
                        // angular.merge(_enum_datas,attribute.enum);
                    });
                    _configs.push({
                        support: true,
                        data: _enum_datas
                    });
                }

                //
                if(angular.isDefined(configs)){
                    _configs.concat(configs);
                }
                
                //sort 
                if(_sorts.length > 0){
                    var _sort_datas = [];
                    angular.forEach(_sorts,function(attribute){
                        var ascending = {
                            group: attribute.name,
                            icon: "glyphicon-sort-by-attributes",
                            name: getAscSortName(attribute.name),
                            field: attribute.field,
                            operator: 'ORDER',
                            value: 'ascending'
                        };
                        _sort_datas.push(ascending);

                        var descending = {
                            group: attribute.name,
                            icon: "glyphicon-sort-by-attributes-alt",
                            name: getDescSortName(attribute.name),
                            field: attribute.field,
                            operator: 'ORDER',
                            value: 'descending'
                        };
                        _sort_datas.push(descending);
                    });
                    _configs.push({
                        support: function(search,selected){
                            if(angular.isDefined(selected)){
                                var already_sort = $filter('filter')(selected, {'operator':'ORDER'}, true);
                                return (already_sort.length === 0);
                            }
                            return true;
                        },
                        data: _sort_datas
                    });
                }
                
                //other
                _configs.push({
                    support: true,
                    data: [{
                        group: 'Advanced',
                        icon: 'glyphicon-random',
                        tags: 'exact and',
                        name: 'EXACT',
                        field: "EXACT",
                        operator: "",
                        value: "with 'AND' operator"
                    }]
                });

                GuessSearch.config(_configs);

                _filters = GuessSearch.guess();
                return _filters;
            },
            tagging: function (text) {
                var filters = GuessSearch.guess(text,_selected.value);
                _filters.length = 0;
                angular.merge(_filters,filters);
                return {
                    group: 'Search',
                    icon: 'glyphicon-search',
                    name: 'ANY:' + text,
                    field: "ANY",
                    operator: "co",
                    value: text
                };
            },
            filtering: function(selected){
                var filters = [];
                var find = $filter('filter')(selected, {'field':'EXACT'}, true);
                var and = (find.length > 0);
    
                angular.forEach(selected,function(select){
                    var filter = '';
                    if(select.field === 'EXACT' || 
                        select.operator === 'ORDER'){
                        return;
                    }else if(select.field === 'ANY'){
                        var ps = [];
                        angular.forEach(_anys, function(attribute){
                            var p = attribute.field + ' co \'' + select.value + '\'';
                            ps.push(p);
                        });

                        filter = 
                            (and ? '(' : '') +
                            ps.join(' or ') + 
                            (and ? ')' : '');
                    }else{
                        filter = 
                            select.field + ' ' +
                            select.operator + ' ' + 
                            (angular.isString(select.value) ? '\'' + select.value + '\'' :  select.value);
                    }
                    filters.push(filter);
                });
    
                var filter = filters.join(and ? ' and ' : ' or ');
                
                var sortBy = null;
                var sortOrder = null;
                var orders = $filter('filter')(selected, {'operator':'ORDER'}, true);
                if(orders.length > 0){
                    sortBy = orders[0].field;
                    sortOrder = orders[0].value;
                }
    
    
                _load(filter,sortBy,sortOrder);
                this.tagging();
            },
            refreshing: function(){
                this.filtering(_selected.value);
            },
            searching: function(text){
                if(!!text){
                    _selected.value = [{
                        group: 'Search',
                        icon: 'glyphicon-search',
                        name: 'ANY:' + text,
                        field: "ANY",
                        operator: "co",
                        value: text
                    }];
                }
                this.refreshing();
            },
            usingText: getText
        };
    });
