var overviewHandler = {
    vm: {},
    init: function (vm) {
        overviewHandler.vm = vm;
    },
    setOverviewItems: function () {
        overviewHandler.vm.savingPlan.validFrom = new Date(overviewHandler.vm.savingPlan.validFrom);
        overviewHandler.vm.savingPlan.validTo = new Date(overviewHandler.vm.savingPlan.validTo);
        overviewHandler.vm.workDaysGraph = [];
    },
    setOverviewGraphs: function () {
        overviewHandler.vm.events = [
          {
              type: "clock",
              title: "Scheduled Wake Up",
              text: 'On 8/30/2015 at 3:55 PM Keep awake for 1 hour...'
          },
          {
              type: "clock",
              title: "Weekly Wake Up",
              text: 'Every Sunday On 8/30/2015 at 3:55 PM Keep awake for 1 hour...'
          }
        ];
        overviewHandler.vm.workTime = {
            sun: [
              {
                  begin: 8.30,
                  end: 17.30
              },
              {
                  begin: 18,
                  end: 18.30
              }
            ],
            mon: [
              {
                  begin: 9,
                  end: 18
              }
            ],
            tue: [
              {
                  begin: 9,
                  end: 18
              }
            ],
            wed: [
              {
                  begin: 9,
                  end: 18
              }
            ],
            thu: [],
            fri: [],
            sat: []
        };

        overviewHandler.vm.workTimeChange = function (workTimeList) {
            console.log(workTimeList);
        }

        varWorkDaysGraphArr = [];
        //if (overviewHandler.vm.savingPlan.workDaysData) {
        //    angular.forEach(overviewHandler.vm.savingPlan.workDaysData, function (value, key) {
        //        var serieObj = {};
        //        serieObj.name = value.seriesName;
        //        serieObj.data = value.data;
        //        if (value.seriesName === 'Work Time') {
        //            serieObj.color = "#8ec536";
        //        }
        //        else if (value.seriesName === 'Down Time') {
        //            serieObj.color = "#bf2b29";
        //        }
        //        else if (value.seriesName === 'Idle Time') {
        //            serieObj.color = "#28aadc";
        //        }
        //        varWorkDaysGraphArr.push(serieObj);
        //    });
        //}

        overviewHandler.vm.workDaysGraph = varWorkDaysGraphArr;

        varNonWorkDaysGraphArr = [];
        //if (overviewHandler.vm.savingPlan.nonWorkDaysData) {
        //    angular.forEach(overviewHandler.vm.savingPlan.nonWorkDaysData, function (value, key) {
        //        var serieObj = {};
        //        serieObj.name = value.seriesName;
        //        serieObj.data = value.data;
        //        if (value.seriesName === 'Work Time') {
        //            serieObj.color = "#8ec536";
        //        }
        //        else if (value.seriesName === 'Down Time') {
        //            serieObj.color = "#bf2b29";
        //        }
        //        else if (value.seriesName === 'Idle Time') {
        //            serieObj.color = "#28aadc";
        //        }
        //        varNonWorkDaysGraphArr.push(serieObj);
        //    });
        //}

        overviewHandler.vm.nonWorkDaysGraph = varNonWorkDaysGraphArr;

    }
}
