(function () {
    'use strict';
    angular
        .module('powerPlug').directive('performanceMetricsTab', function () {
            return {
                templateUrl: '../../../views/powerplan/settingsTabs/PerformanceMetrics.html',
                scope: {
                    jsonobject: '=',
                    worktype: '@'
                },
                link: function (scope, element, attrs) {
                   
                }
            }
        })
}());