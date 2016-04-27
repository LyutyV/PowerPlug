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
            title: "Weekly Wake Up1",
            text: 'Every Sunday On 8/30/2015 at 3:55 PM Keep awake for 1 hour...',
            weekDay: 'mon',
            start: 17.3
          },
          {
            type:"Restart",
            title: "Weekly Wake Up2",
            text: 'Every Sunday On 8/30/2015 at 3:55 PM Keep awake for 1 hour...',
            weekDay: 'thu',
            start: 18
          },
          {
            type:"Restart",
            title: "Weekly Wake Up3",
            text: 'Every Sunday On 8/30/2015 at 3:55 PM Keep awake for 1 hour...',
            weekDay: 'fri',
            start: 18
          }
        ];

        overviewHandler.vm.workTimeChange = function(workTimeList){
          console.log(workTimeList);
        }

        overviewHandler.vm.actionRemove = function(action){
          console.log(action);
        }

        overviewHandler.vm.actionEdit = function(action){
          var index = _.findIndex(overviewHandler.vm.savingPlan.actions,{actionKey:action});
          overviewHandler.vm.openActionDialog(overviewHandler.vm.savingPlan.actions[index],false);
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
        //==================Date Picker==================
        overviewHandler.vm.altInputFormats = ['M!/d!/yyyy'];
        overviewHandler.vm.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };
        //From Date Picker
        overviewHandler.vm.popupFromDate = { opened: false };
        overviewHandler.vm.openFromDate = function () {
            overviewHandler.vm.popupFromDate.opened = true;
        };
        //To Date Picker
        overviewHandler.vm.popupToDate = { opened: false };
        overviewHandler.vm.openToDate = function () {
            overviewHandler.vm.popupToDate.opened = true;
        };
        //==============End Date Picker================
        overviewHandler.vm.text = "";

        overviewHandler.vm.done = function (data2) {
            console.log(data2);
        };

        overviewHandler.vm.preview = function (data1) {
            console.log(data1);
        };
    }
}
