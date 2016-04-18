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

<<<<<<< HEAD
        overviewHandler.vm.graph = [{
          name: 'Tokyo',
          color: "#bf2b29",
          data: [
            [0, 50],
            [0.1, 50],
            [0.2, 38],
            [1, 38],
            [1.5, 38],
            [1.6, 50],
            [1.7, 38],
            [2, 38],
            [3, 38],
            [4, 38],
            [4.4, 38],
            [4.5, 50],
            [4.6, 50],
            [4.7, 95],
            [5, 95],
            [5.1, 38],
            [6, 38],
            [6.8, 38],
            [6.9, 50],
            [7.1, 38],
            [8, 38],
            [9, 38],
            [10, 38],
            [11, 38]
          ]
        }, {
          name: 'ssssss',
          color: "#8ec536",
          data: [
            [0, 63],
            [0.1, 63],
            [0.2, 72],
            [1, 72],
            [1.6, 72],
            [1.7, 63],
            [1.8, 72],
            [2, 72],
            [3, 72],
            [4, 72],
            [4.5, 72],
            [4.6, 50],
            [4.7, 20],
            [4.8, 20],
            [4.9, 35],
            [5, 35],
            [6, 35],
            [7, 35],
            [8, 35],
            [8.1, 22],
            [8.2, 35],
            [9, 35],
            [10, 35],
            [10.1, 35],
            [10.2, 72],
            [11, 72]
          ]
        }, {
          name: 'ssssss',
          color: "#28aadc",
          data: [
            [0, 7],
            [1, 7],
            [2, 7],
            [3, 7],
            [4, 7],
            [5, 7],
            [5.25, 7],
            [5.45, 44],
            [6, 44],
            [6.7, 44],
            [6.8, 30],
            [7, 30],
            [7.1, 44],
            [8, 44],
            [9, 44],
            [9.8, 44],
            [10, 7],
            [11, 7]
          ]
        }];
=======
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
>>>>>>> Branch_c2fac78bae637cf168c6b8959dee3715d3194313

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
