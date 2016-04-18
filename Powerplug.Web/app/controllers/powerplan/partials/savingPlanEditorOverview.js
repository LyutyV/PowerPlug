var overviewHandler = {
    vm: {},
    init: function (vm) {
        overviewHandler.vm = vm;
    },
    setOverviewItems: function () {
        overviewHandler.vm.savingPlan.validFrom = new Date(overviewHandler.vm.savingPlan.validFrom);
        overviewHandler.vm.savingPlan.validTo = new Date(overviewHandler.vm.savingPlan.validTo);
    },
    setOverviewGraphs: function () {
        overviewHandler.vm.graphWorkDays = {};
        overviewHandler.vm.graphWorkDays.attrs = {
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
        overviewHandler.vm.graphWorkDays.categories = [
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
        overviewHandler.vm.graphWorkDays.dataset = [
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

        overviewHandler.vm.events=[
          {
            type:"Wakeup",
            title: "Scheduled Wake Up",
            text: 'On 8/30/2015 at 3:55 PM Keep awake for 1 hour...',
            weekDay: 'sun',
            start: 17.3
          },
          {
            type:"Wakeup",
            title: "Weekly Wake Up",
            text: 'Every Sunday On 8/30/2015 at 3:55 PM Keep awake for 1 hour...',
            weekDay: 'mon',
            start: 17.3
          },
          {
            type:"Restart",
            title: "Weekly Wake Up",
            text: 'Every Sunday On 8/30/2015 at 3:55 PM Keep awake for 1 hour...',
            weekDay: 'thu',
            start: 18
          }
        ];

        overviewHandler.vm.workTimeChange = function(workTimeList){
          console.log(workTimeList);
        }

        varWorkDaysGraphArr = [];
        if (overviewHandler.vm.savingPlan.workDaysData) {
            angular.forEach(overviewHandler.vm.savingPlan.workDaysData, function (value, key) {
                var serieObj = {};
                serieObj.name = value.seriesName;
                serieObj.data = value.data;
                if (value.seriesName === 'Work Time') {
                    serieObj.color = "#8ec536";
                }
                else if (value.seriesName === 'Down Time') {
                    serieObj.color = "#bf2b29";
                }
                else if (value.seriesName === 'Idle Time') {
                    serieObj.color = "#28aadc";
                }
                varWorkDaysGraphArr.push(serieObj);
            });
        }

        overviewHandler.vm.workDaysGraph = varWorkDaysGraphArr;

        varNonWorkDaysGraphArr = [];
        if (overviewHandler.vm.savingPlan.nonWorkDaysData) {
            angular.forEach(overviewHandler.vm.savingPlan.nonWorkDaysData, function (value, key) {
                var serieObj = {};
                serieObj.name = value.seriesName;
                serieObj.data = value.data;
                if (value.seriesName === 'Work Time') {
                    serieObj.color = "#8ec536";
                }
                else if (value.seriesName === 'Down Time') {
                    serieObj.color = "#bf2b29";
                }
                else if (value.seriesName === 'Idle Time') {
                    serieObj.color = "#28aadc";
                }
                varNonWorkDaysGraphArr.push(serieObj);
            });
        }

        overviewHandler.vm.nonWorkDaysGraph = varNonWorkDaysGraphArr;

        overviewHandler.vm.text = "";

        overviewHandler.vm.done = function (data2) {
            console.log(data2);
        };

        overviewHandler.vm.preview = function (data1) {
            console.log(data1);
        };

        overviewHandler.vm.graphNonWorkDays = {};
        overviewHandler.vm.graphNonWorkDays.attrs = {
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
        overviewHandler.vm.graphNonWorkDays.categories = [
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
        overviewHandler.vm.graphNonWorkDays.dataset = [
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
    }
}
