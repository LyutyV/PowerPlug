/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('SavingPlanEditorCtrl',
                     ['$state', '$stateParams', 'SavingPlansResource', SavingPlanEditorCtrl]);


    function SavingPlanEditorCtrl($state, $stateParams, SavingPlansResource) {
        var vm = this;
        var policyId = $stateParams.policyId
        SavingPlansResource.get({ policyId: policyId }, function (data) {
            vm.savingPlan = data;
            vm.savingPlan.validFrom = new Date(vm.savingPlan.validFrom);
            vm.savingPlan.validTo = new Date(vm.savingPlan.validTo);

            vm.savingPlan.savings.work.options.computerMetricsConverted = {};
            vm.savingPlan.savings.nonWork.options.computerMetricsConverted = {};
            angular.forEach(vm.savingPlan.savings.work.options.computerMetrics, function (value, key) {
                vm.savingPlan.savings.work.options.computerMetricsConverted[value.counter] = value;
            });

            angular.forEach(vm.savingPlan.savings.nonWork.options.computerMetrics, function (value, key) {
                vm.savingPlan.savings.nonWork.options.computerMetricsConverted[value.counter] = value;
            });

            vm.currentEventScripts = [];
            console.log(vm.savingPlan);
        }, function (error) {
            console.log(error)
            if (error.status === 401 || error.status === -1)
            {
                $state.go('login');
            }
        });

        vm.graphWorkDays = {};
        vm.graphWorkDays.attrs = {
            "caption": "Work Days",
            "numberprefix": "",
            "plotgradientcolor": "",
            "bgcolor": "FFFFFF",
            "showalternatehgridcolor": "0",
            "divlinecolor": "CCCCCC",
            "showvalues": "0",
            "showcanvasborder": "0",
            "canvasborderalpha": "0",
            "canvasbordercolor": "CCCCCC",
            "canvasborderthickness": "1",
            "yaxismaxvalue": "",
            "captionpadding": "30",
            "linethickness": "3",
            "yaxisvaluespadding": "15",
            "legendshadow": "0",
            "legendborderalpha": "0",
            "palettecolors": "#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78",
            "showborder": "0"
        };

        vm.graphWorkDays.categories = [
            {
                "category": [
                    {
                        "label": "Sun"
                    },
                    {
                        "label": "Mon"
                    },
                    {
                        "label": "Tue"
                    },
                    {
                        "label": "Wed"
                    },
                    {
                        "label": "Thu"
                    },
                    {
                        "label": "Fri"
                    },
                    {
                        "label": "Sat"
                    }                    
                ]
            }
        ];

        vm.graphWorkDays.dataset = [
            {
                "seriesname": "Down Time",
                "data": [
                    {
                        "value": "56"
                    },
                    {
                        "value": "78"
                    },
                    {
                        "value": "80"
                    },
                    {
                        "value": "67"
                    },
                    {
                        "value": "34"
                    },
                    {
                        "value": "67"
                    },
                    {
                        "value": "32"
                    }
                ]
            },
            {
                "seriesname": "Idle Time",
                "data": [
                    {
                        "value": "87"
                    },
                    {
                        "value": "23"
                    },
                    {
                        "value": "56"
                    },
                    {
                        "value": "76"
                    },
                    {
                        "value": "43"
                    },
                    {
                        "value": "45"
                    },
                    {
                        "value": "89"
                    }
                ]
            },
            {
                "seriesname": "Work Time",
                "data": [
                    {
                        "value": "56"
                    },
                    {
                        "value": "54"
                    },
                    {
                        "value": "78"
                    },
                    {
                        "value": "83"
                    },
                    {
                        "value": "36"
                    },
                    {
                        "value": "72"
                    },
                    {
                        "value": "45"
                    }
                ]
            }
        ];

        vm.graphNonWorkDays = {};
        vm.graphNonWorkDays.attrs = {
            "caption": "Non-Work Days",
            "numberprefix": "",
            "plotgradientcolor": "",
            "bgcolor": "FFFFFF",
            "showalternatehgridcolor": "0",
            "divlinecolor": "CCCCCC",
            "showvalues": "0",
            "showcanvasborder": "0",
            "canvasborderalpha": "0",
            "canvasbordercolor": "CCCCCC",
            "canvasborderthickness": "1",
            "yaxismaxvalue": "",
            "captionpadding": "30",
            "linethickness": "3",
            "yaxisvaluespadding": "15",
            "legendshadow": "0",
            "legendborderalpha": "0",
            "palettecolors": "#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78",
            "showborder": "0"
        };

        vm.graphNonWorkDays.categories = [
            {
                "category": [
                    {
                        "label": "Sun"
                    },
                    {
                        "label": "Mon"
                    },
                    {
                        "label": "Tue"
                    },
                    {
                        "label": "Wed"
                    },
                    {
                        "label": "Thu"
                    },
                    {
                        "label": "Fri"
                    },
                    {
                        "label": "Sat"
                    }
                ]
            }
        ];

        vm.graphNonWorkDays.dataset = [
            {
                "seriesname": "Down Time",
                "data": [
                    {
                        "value": "33"
                    },
                    {
                        "value": "76"
                    },
                    {
                        "value": "84"
                    },
                    {
                        "value": "87"
                    },
                    {
                        "value": "56"
                    },
                    {
                        "value": "32"
                    },
                    {
                        "value": "12"
                    }
                ]
            },
            {
                "seriesname": "Idle Time",
                "data": [
                    {
                        "value": "45"
                    },
                    {
                        "value": "78"
                    },
                    {
                        "value": "28"
                    },
                    {
                        "value": "65"
                    },
                    {
                        "value": "43"
                    },
                    {
                        "value": "45"
                    },
                    {
                        "value": "94"
                    }
                ]
            },
            {
                "seriesname": "Work Time",
                "data": [
                    {
                        "value": "56"
                    },
                    {
                        "value": "54"
                    },
                    {
                        "value": "78"
                    },
                    {
                        "value": "83"
                    },
                    {
                        "value": "36"
                    },
                    {
                        "value": "72"
                    },
                    {
                        "value": "45"
                    }
                ]
            }
        ];

        vm.saveChanges = function () {
            vm.savingPlan.$update();
        }

        vm.showEventScripts = function (eventType) {            
            vm.currentEventScripts = [];            
            if (vm.savingPlan.events) {                
                angular.forEach(vm.savingPlan.events, function (value, key) {
                    if (value.eventType === eventType) {
                        vm.currentEventScripts = value.scripts;
                    }                    
                });
            }
        };
    }
}());