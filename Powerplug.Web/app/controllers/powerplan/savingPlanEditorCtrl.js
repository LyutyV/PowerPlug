/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('SavingPlanEditorCtrl',
                     ['$state', '$stateParams', '$scope','$mdDialog', '$mdMedia', 'SavingPlansResource', SavingPlanEditorCtrl]);


    function SavingPlanEditorCtrl($state, $stateParams, $scope, $mdDialog, $mdMedia, SavingPlansResource) {
        var vm = this;
        var policyId = $stateParams.policyId
        SavingPlansResource.get({ policyId: policyId }, function (data) {            
            vm.savingPlan = data;

            //Overview
            vm.savingPlan.validFrom = new Date(vm.savingPlan.validFrom);
            vm.savingPlan.validTo = new Date(vm.savingPlan.validTo);

            //Actions            
            var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];            
            angular.forEach(vm.savingPlan.actions, function (value, key) {
                value.actionKey = key;
                if (value.scheduleType === 'DayOfWeek' || value.scheduleType === 'DayOfMonth') {
                    var days;
                    if (value.scheduleType === 'DayOfWeek') {
                        days = value.daysOfWeek.toString(2);
                    }
                    else {
                        days = value.daysOfMonth.toString(2);
                    }
                    var numbers = [];
                    days = days.split("").reverse().join("");
                    for (var i = 0; i < days.length; i++) {
                        if (days[i] === '1') {
                            numbers.push(i);
                        }
                    }
                    value.daysConverted = numbers;
                }
                
                if (value.scheduleType === 'DayOfWeek') {
                    if (numbers.length < 7) {
                        value.scheduleText = 'Every ';
                        var daysList = [];
                        angular.forEach(numbers, function (valueDays, keyDays) {
                            daysList.push(weekDays[valueDays]);
                        });
                        value.scheduleText += daysList.join(', ');
                    }
                    else {
                        value.scheduleText = 'Every day';
                    }
                }
                else if (value.scheduleType === 'DayOfMonth') {
                    value.scheduleText = 'On ' + (Number(numbers[0]) + 1) + 'th of each month'
                }
                else if (value.scheduleType === 'SpecificDate') {
                    value.dateConverted = moment(value.specificDate).format('L');
                    value.scheduleText = 'On ' + value.dateConverted;
                }
                if (value.perform === 'Wake') {
                    value.timeConverted = moment(value.fromTime).format('LT');
                    value.scheduleText += ' at ' + value.timeConverted;
                }
                else if (value.perform === 'Restart') {
                    value.formTimeConverted = moment(value.fromTime).format('LT');
                    value.toTimeConverted = moment(value.toTime).format('LT');
                    value.scheduleText += ' between ' + value.formTimeConverted + ' and ' + value.toTimeConverted;
                }
            });

            //Saving
            if (vm.savingPlan.savings.work.options) {
                vm.savingPlan.savings.work.options.computerMetricsConverted = {};
                angular.forEach(vm.savingPlan.savings.work.options.computerMetrics, function (value, key) {
                    vm.savingPlan.savings.work.options.computerMetricsConverted[value.counter] = value;
                });
            }
            if (vm.savingPlan.savings.nonWork.options) {
                vm.savingPlan.savings.nonWork.options.computerMetricsConverted = {};
                angular.forEach(vm.savingPlan.savings.nonWork.options.computerMetrics, function (value, key) {
                    vm.savingPlan.savings.nonWork.options.computerMetricsConverted[value.counter] = value;
                });
            }

            ///testCalendar();
            //Work Hours
            var workHours = [];
            var time = 0;
            var active = false;
            var startTime;
            var endTime;
            var currentTime = moment('2012-01-01');
            angular.forEach(vm.savingPlan.workHours.workTimeMask.split(''), function (value, key) {
                if (value === '1') {
                    if (!active) {
                        active = true;
                        startTime = currentTime;
                    }
                }
                else {
                    if (active) {
                        active = false;
                        endTime = currentTime;
                        workHours.push({
                            start: startTime,
                            end: endTime
                        })
                    }
                }
                currentTime = moment(currentTime).add(30, 'minutes');
            });
            if (active) {
                endTime = currentTime;
                workHours.push({
                    start: startTime,
                    end: endTime
                })
            }

            var myEl = angular.element(document.querySelector('#calendar'));
            myEl.fullCalendar({
                height: 500,
                defaultDate: '2012-01-01',
                defaultView: 'agendaWeek',
                editable: true,
                events: workHours,
                allDaySlot: false,                
                header: {
                    center: '',
                    left: '',
                    right: ''
                }
            });


            //Events
            vm.currentEventScripts = [];
            console.log(vm.savingPlan);
        }, function (error) {
            console.log(error)
            if (error.status === 401 || error.status === -1)
            {
                $state.go('login');
            }
        });

        //==================================================PopUp=======================================================
        $scope.showAdvanced = function (ev, actionData) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                templateUrl: 'views/powerplan/action.dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                bindToController :true,
                fullscreen: useFullScreen,
                locals: { actionData: actionData },
                controller: DialogController,
            })
            .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
                console.log(dataModel);
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };
        function DialogController($scope, $mdDialog, actionData) {
            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };

            //modify object
            if (actionData.scheduleType == 'DayOfWeek' && actionData.daysConverted.length == 7)
            {
                actionData.scheduleType == 'EveryDay';
            }
            $scope.actionData = actionData;

            var _pr = 1;
            $scope.Days = {
                value:
                    function (newValue) {
                        console.log("NEW VALUE IS=====================================", newValue);

                        return arguments.length ? (_pr = newValue) : _pr;
                    }


                    
            };
            
        }
        //=================================================EndPopUp=====================================================


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

        //Html Elemnts Events
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