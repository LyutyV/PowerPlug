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
                        if(typeof(scope.jsonobject) != 'undefined'){
                            scope.isCpu = scope.jsonobject.computerMetricsConverted.Cpu? true: false;
                            scope.cpuThreshold = scope.jsonobject.computerMetricsConverted.Cpu.threshold;
                            scope.isIo = scope.jsonobject.computerMetricsConverted.Io? true: false;
                            scope.ioThreshold = scope.jsonobject.computerMetricsConverted.Io.thresholdInKb;
                            scope.isNetwork = scope.jsonobject.computerMetricsConverted.Network? true: false;
                            scope.networkThreshold = scope.jsonobject.computerMetricsConverted.Network.thresholdInKb;
                        }
                        scope.$on('saveSettings', function (event, data) {
                            if (scope.isCpu) {
                                //scope.jsonobject.computerMetricsConverted.Cpu = scope.isCpu;
                                scope.jsonobject.computerMetricsConverted.Cpu.counter ="Cpu"
                                scope.jsonobject.computerMetricsConverted.Cpu.threshold = scope.cpuThreshold;
                                //scope.jsonobject.computerMetricsConverted.Cpu.thresholdInKb = scope.cpuThreshold;
                            }
                            if (scope.isIo) {
                                //scope.jsonobject.computerMetricsConverted.Io = scope.isIo;
                                scope.jsonobject.computerMetricsConverted.Io.counter = "Io";
                                scope.jsonobject.computerMetricsConverted.Io.thresholdInKb = scope.ioThreshold;
                                //scope.jsonobject.computerMetricsConverted.Io.thresholdInKb = scope.ioThreshold;

                            }
                            if (scope.isNetwork) {
                                //scope.jsonobject.computerMetricsConverted.Network = ;
                                scope.jsonobject.computerMetricsConverted.Network.thresholdInKb = scope.networkThreshold;
                            }
                        });
                }
            }
        })
}());