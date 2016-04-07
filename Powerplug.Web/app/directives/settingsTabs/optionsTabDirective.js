(function () {
    'use strict';
    angular
        .module('powerPlug').directive('optionsTab', function () {
            return {
                templateUrl: '../../../views/powerplan/settingsTabs/options.html',     
                scope: {
                    jsonobject: '='
                },
                link: function (scope, element, attrs) {
                }
                //controller: function () {

                //},
               
            }
        })
}());