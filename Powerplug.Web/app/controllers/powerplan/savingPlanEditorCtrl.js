(function () {
    'use strict';
    angular
        .module('powerPlug')
        .directive('convertToNumber', function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attrs, ngModel) {
                    ngModel.$parsers.push(function(val) {
                        return val ? parseInt(val, 10) : null;
                    }); 
                    ngModel.$formatters.push(function(val) {
                        return val ? '' + val : null;
                    });
                }
            };
        })
        .controller('SavingPlanEditorCtrl',
                     ['$state', '$stateParams', '$scope', '$animate', '$document', '$mdDialog', '$mdMedia', 'SavingPlansResource', 'ComputersResource', 'ScriptsResource', SavingPlanEditorCtrl]);

    function SavingPlanEditorCtrl($state, $stateParams, $scope, $animate, $document, $mdDialog, $mdMedia, SavingPlansResource, ComputersResource, ScriptsResource) {
        var vm = this;
        var policyId = $stateParams.policyId
        SavingPlansResource.get({ policyId: policyId }, function (data) {
            onSuccess(data);            
        }, function (err) {
            onError(err);
        });

        function onError(err) {
            console.log(err)
            if (err.status === 401 || err.status === -1) {
                $state.go('login');
            }
        }

        function onSuccess(data) {
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
                    vm.savingPlan.savings.work.options.computerMetricsConverted[value.counter].thresholdInKb = vm.savingPlan.savings.work.options.computerMetricsConverted[value.counter].threshold / 1024;
                });
                angular.forEach(vm.savingPlan.savings.work.options.appMetrics, function (value, key) {
                    value.appKey = key;                    
                });

                angular.forEach(vm.savingPlan.savings.work.options.computersNotRun, function (value, key) {
                    value.computerKey = key;
                });
            }
            if (vm.savingPlan.savings.nonWork.options) {
                vm.savingPlan.savings.nonWork.options.computerMetricsConverted = {};
                angular.forEach(vm.savingPlan.savings.nonWork.options.computerMetrics, function (value, key) {               
                    vm.savingPlan.savings.nonWork.options.computerMetricsConverted[value.counter] = value;
                    vm.savingPlan.savings.nonWork.options.computerMetricsConverted[value.counter].thresholdInKb = vm.savingPlan.savings.nonWork.options.computerMetricsConverted[value.counter].threshold / 1024;

                });
                angular.forEach(vm.savingPlan.savings.nonWork.options.appMetrics, function (value, key) {
                    value.appKey = key;                    
                });
                angular.forEach(vm.savingPlan.savings.nonWork.options.computersNotRun, function (value, key) {
                    value.computerKey = key;
                });
            }

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
        }

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
                 console.log(actionData);
            }, function () {
                console.log(actionData);
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };
        function DialogController($scope, $mdDialog, actionData) {
            //Private
            var weekDays = actionData.weekDays;
            var SetDayModel = function (newValue) {
                var dayInBit = newValue;
                weekDays = (dayInBit > 0) ? (weekDays | dayInBit) : (weekDays & dayInBit);
                console.log(weekDays)
                return getDayModel(dayInBit);
            }
            var getDayModel = function (dayInBit) {
                if ((dayInBit & weekDays) == dayInBit) {
                    return dayInBit
                } else return ~dayInBit
            }
            function GetSetDays(newValue) {
                if (arguments.length) {
                    return SetDayModel(newValue, this.dayInBit);
                } else return getDayModel(this.dayInBit)
            }
            //Scope bind
            $scope.daysOfMonth   = actionData.daysOfMonth;
            $scope.KeepMonitorOn = actionData.options.KeepMonitorOn;
            $scope.keepAlive     = actionData.options.keepAlive;
            $scope.specificDate = (typeof actionData.specificDate != 'undefined') ? new Date(actionData.specificDate)    : new Date();
            $scope.timeChosen   = (typeof actionData.fromTime != 'undefined')     ? moment(actionData.fromTime).toDate() : 0;

            $scope.hide = function () { $mdDialog.hide(); };
            $scope.cancel = function () { $mdDialog.cancel()};
            $scope.Add = function () {
                //add data to json
                actionData.scheduleType = $scope.scheduleType;
                switch (actionData.scheduleType) {
                    case 'EveryDay':
                        actionData.scheduleType = 'DayOfWeek';
                        actionData.weekDays = 127;
                        break;
                    case 'DayOfWeek':
                        actionData.weekDays = weekDays;
                        break;
                    case 'DayOfMonth':
                        actionData.daysOfMonth = $scope.daysOfMonth;
                        break;
                    case 'SpecificDate':
                        actionData.specificDate = $scope.specificDate;
                        break;
                }
                actionData.options.KeepMonitorOn = $scope.KeepMonitorOn;
                actionData.options.keepAlive = $scope.keepAlive;
                actionData.fromTime = $scope.timeChosen
                //Hide dialog
                $mdDialog.hide();
            };
            //modify scheduleType if need
            if (actionData.scheduleType == 'DayOfWeek' && actionData.daysConverted.length == 7) {
                actionData.scheduleType == 'EveryDay';
            }
            $scope.scheduleType = actionData.scheduleType;
            $scope.Sunday = {
                dayInBit: 1,
                Value: GetSetDays,
            }
            $scope.Monday = {
                dayInBit: 2,
                Value: GetSetDays,
            }
            $scope.Tuesday = {
                dayInBit: 4,
                Value: GetSetDays,
            }
            $scope.Wednesday = {
                dayInBit : 8,
                Value: GetSetDays
            }
            $scope.Thursday = {
                dayInBit: 16,
                Value: GetSetDays
            }
            $scope.Friday = {
                dayInBit: 32,
                Value: GetSetDays
            }
            $scope.Saturday = {
                dayInBit: 64,
                Value: GetSetDays
            }
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

        //Html Elements Events
        function setComputerMetrics(id, type, multiplyNumber) {
            var chkElement = $document[0].querySelector('#' + type + id);
            var txtElement = $document[0].querySelector('#' + type + id + 'Text');
            var isElementFound = false;
            if (!vm.savingPlan.savings[type].options.computerMetrics) {
                vm.savingPlan.savings[type].options.computerMetrics = [];
            }

            if (chkElement.checked) {
                angular.forEach(vm.savingPlan.savings[type].options.computerMetrics, function (value, key) {
                    if (value.counter === id) {
                        isElementFound = true;
                        value.threshold = Number(txtElement.value) * multiplyNumber;
                    }
                });

                if (!isElementFound) {
                    if (!vm.savingPlan.savings[type].options.computerMetrics) {
                        vm.savingPlan.savings[type].options.computerMetrics = [];
                    }
                    vm.savingPlan.savings[type].options.computerMetrics.push({ counter: id, threshold: (Number(txtElement.value) * multiplyNumber) });
                }
            }
            else {
                angular.forEach(vm.savingPlan.savings[type].options.computerMetrics, function (value, key) {
                    if (value.counter === id) {
                        vm.savingPlan.savings[type].options.computerMetrics.splice(key, 1);
                        vm.savingPlan.savings[type].options.computerMetricsConverted.splice(value.counter, 1);
                    }
                });
            }
        }

        vm.saveChanges = function () {
            if (vm.savingPlan.savings.work.options && vm.savingPlan.savings.work.options.computerMetricsConverted) {
                setComputerMetrics('Cpu', 'work', 1);
                setComputerMetrics('Io', 'work', 1024);
                setComputerMetrics('Network', 'work', 1024);
            }
            if (vm.savingPlan.savings.nonWork.options && vm.savingPlan.savings.nonWork.options.computerMetricsConverted) {
                setComputerMetrics('Cpu', 'nonWork', 1);
                setComputerMetrics('Io', 'nonWork', 1024);
                setComputerMetrics('Network', 'nonWork', 1024);
            }

            vm.savingPlan.$update(function (data) {
                onSuccess(data);            
            }, function (err) {
                onError(err);
            });
        }

        vm.showEventScripts = function (eventType) {            
            vm.currentEventScripts = [];            
            if (vm.savingPlan.events) {                
                angular.forEach(vm.savingPlan.events, function (value, key) {
                    if (value.eventType === eventType) {
                        vm.currentEventScripts = value.scripts;
                        vm.currentEvent = value.eventType;
                    }                    
                });
            }
        };

        vm.removeEventScript = function (scriptId) {
            angular.forEach(vm.savingPlan.events, function (value, key) {
                if (vm.currentEvent === value.eventType) {
                    angular.forEach(vm.savingPlan.events[key].scripts, function (valueScript, keyScript) {
                        if (scriptId === valueScript.scriptId) {
                            vm.savingPlan.events[key].scripts.splice(keyScript, 1);
                        }
                    });                    
                }
            });
        };

        vm.removeSavingComputer = function (computerId, type) {
            angular.forEach(vm.savingPlan.savings[type].options.computersNotRun, function (value, key) {
                if (computerId === value.computerKey) {
                    vm.savingPlan.savings[type].options.computersNotRun.splice(key, 1);
                }
            });
        };

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        vm.addEventScripts = function (ev) {
            $mdDialog.show({
                templateUrl: 'views/powerplan/dialogs/addScipt.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                bindToController: true,
                fullscreen: useFullScreen,
                locals: {},
                controller: DialogController,
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });

            function DialogController($scope, $mdDialog, $document) {
                ScriptsResource.query(function (data) {
                    $scope.eventScripts = data;
                }, function (err) {
                    onError(err);
                });

                $scope.addEventScripts = function () {
                    angular.forEach(vm.savingPlan.events, function (valueEvent, keyEvent) {
                        if (vm.currentEvent === valueEvent.eventType) {
                            angular.forEach(angular.element('.script-selection:checked'), function (value, key) {
                                var newScriptId = Number(value.getAttribute('data-id'));
                                var newScriptName = value.getAttribute('data-name');
                                var newScriptGUID = value.getAttribute('data-guid');
                                var isExist = false;

                                angular.forEach(vm.savingPlan.events[keyEvent].scripts, function (valueContainer, keyContainer) {
                                    if (valueContainer.scriptId === newScriptId) {
                                        isExist = true;
                                    }
                                });

                                if (!isExist) {
                                    vm.savingPlan.events[keyEvent].scripts.push({ context : 'System', scriptGUID : newScriptGUID, scriptName : newScriptName, scriptId : newScriptId});
                                }
                            });
                        }
                    });

                    $mdDialog.hide();
                };

                $scope.closeEventScripts = function () {
                    $mdDialog.cancel();
                };
            }
        };

        vm.addSavingComputer = function (ev, computerId, type) { 
            $mdDialog.show({
                templateUrl: 'views/powerplan/dialogs/computerCondition.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                bindToController: true,
                fullscreen: useFullScreen,
                locals: {},
                controller: DialogController,
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });

            function DialogController($scope, $mdDialog, $document) {
                ComputersResource.query(function (data) {                    
                    $scope.savingComputerList = data;
                }, function (err) {
                    onError(err);
                });
                
                $scope.addSavingComputers = function () {
                    angular.forEach(angular.element('.computer-selection:checked'), function (value, key) {
                        var newComputerName = value.getAttribute('data-name');
                        var isExist = false;
                        if (vm.savingPlan.savings[type].options && vm.savingPlan.savings[type].options.computersNotRun) {
                            angular.forEach(vm.savingPlan.savings[type].options.computersNotRun, function (valueContainer, keyContainer) {
                                if (valueContainer.name === newComputerName) {
                                    isExist = true;
                                }
                            });
                        }

                        if (!isExist) {
                            if (!vm.savingPlan.savings[type].options) {
                                vm.savingPlan.savings[type].options = {};
                            }

                            if (!vm.savingPlan.savings[type].options.computersNotRun) {
                                vm.savingPlan.savings[type].options.computersNotRun = [];
                            }
                            vm.savingPlan.savings[type].options.computersNotRun.push({ computerKey: vm.savingPlan.savings[type].options.computersNotRun.length, name: newComputerName });
                        }
                    });
                    
                    $mdDialog.hide();
                };

                $scope.closeSavingComputers = function () {
                    $mdDialog.cancel();
                };
            }
        };
    }
}());