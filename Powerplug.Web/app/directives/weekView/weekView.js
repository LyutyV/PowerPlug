angular
  .module('powerPlug')
  .directive('weekView', function($timeout,$window) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        events:'=',
        workTimeList: '=',
        workTimeChange: '&',
        eventsChange:'&',
        eventEdit:'&'
      },
      templateUrl: 'app/directives/weekView/weekView.html',
      link: {
        pre: function(scope,element) {
          if (!element.mCustomScrollbar){
            element.__proto__.mCustomScrollbar = $.mCustomScrollbar;
          }
        },
        post: function(scope,element) {
          var dayList = ['sun','mon','tue','wed','thu','fri','sat'];
          var datyViewlLmit = {
            begin: 0,
            end:24
          }

          var fromListToWeekWorkTime= function(callback){
            scope.workTime = {
              'sun':[],
              'mon':[],
              'tue':[],
              'wed':[],
              'thu':[],
              'fri':[],
              'sat':[]};

              console.log(scope.workTimeList);

            for (var i in scope.workTimeList){
              var dateStart = new Date(scope.workTimeList[i].start._d);
              var dayNum = dateStart.getDay();
              if (dayList[dayNum]) {
                var dateEnd = new Date(scope.workTimeList[i].end._d);

                var workTime = {
                  start: Number(dateStart.getHours() + '.' + dateStart.getMinutes()),
                  end:Number(dateEnd.getHours() + '.' + dateEnd.getMinutes())
                }

                scope.workTime[dayList[dayNum]].unshift(workTime);
              }
            }
            callback && callback();
          };

          var fromWeekToListWorkTime= function(callback){
            callback && callback(scope.workTimeList);
          };

          var fromListToWeekEvents = function(callback){
            scope.eventsTime = {
              'sun':[],
              'mon':[],
              'tue':[],
              'wed':[],
              'thu':[],
              'fri':[],
              'sat':[]
            };

            console.log(scope.events);

            for (var i in scope.events){
              if (scope.events[i].scheduleType ==  "DayOfWeek") {
                for (var j in scope.events[i].daysConverted){
                  var data = new Date(scope.events[i].fromTime);
                  scope.eventsTime[dayList[scope.events[i].daysConverted[j]]].unshift({
                    actionKey : scope.events[i].actionKey,
                    start: Number(data.getHours().toString() + '.' + data.getMinutes().toString()),
                    text: scope.events[i].scheduleText,
                    title: '',
                    type: scope.events[i].perform,
                  });
                }
              }
            }
            console.log(scope.eventsTime);
            callback && callback();
          }

          var fromWeekToListEvents = function (callback) {
            var eventsList = [];
            for (var i in scope.eventsTime) {
              for (var j in scope.eventsTime[i]) {
                eventsList.push(scope.eventsTime[i][j]);
              }
            }
            callback && callback(eventsList);
          }

          var timeToDec = function(time){
            return Number(Math.floor(time)) + Number((time - Math.floor(time))/0.6);
          }

          var decToTime = function(dec){
            return Number(Math.floor(dec)) + Number((dec - Math.floor(dec))*0.6);
          }

          var workListChackMerge = function() {
            var flag = false;
            var rep = false;

            for (var i in scope.workTime) {
              do{
                var length1 = scope.workTime[i].length
                rep = false;

                for (var j = 0; j<length1; j++) {
                  for (var k = Number(j)+1; k<length1; k++) {
                    if (k==j||!scope.workTime[i][j]||!scope.workTime[i][k]){
                      continue;
                    }
                      if (scope.workTime[i][j].start <= scope.workTime[i][k].start && scope.workTime[i][j].end >= scope.workTime[i][k].start){
                        flag = rep = true;
                        if (scope.workTime[i][k].end > scope.workTime[i][j].end) {
                          scope.workTime[i][j].end = scope.workTime[i][k].end;
                        }
                        scope.workTime[i][k]=null;
                      }
                      else if (scope.workTime[i][k].start <= scope.workTime[i][j].start && scope.workTime[i][k].end >= scope.workTime[i][j].start){
                        flag = rep = true;
                        if (scope.workTime[i][j].end > scope.workTime[i][k].end) {
                          scope.workTime[i][k].end = scope.workTime[i][j].end;
                        }
                        scope.workTime[i][j]=null;
                      }
                    }
                }
              }while(rep);
              var temp = [];
              for (var k in scope.workTime[i]){
                if (scope.workTime[i][k]){
                  temp.unshift(scope.workTime[i][k]);
                }
              }
              scope.workTime[i] = temp;
            }
            return flag;
          }

          var workListChangePrepare = function(flag){
            var temp = workListChackMerge();
            if (temp || flag){
              fromWeekToListWorkTime(function(workTimeList){
                scope.workTimeChange({data: workTimeList});
              });
            }
            findWorkTimeLimits();
            findWorkTimePositions();
          }

          var workListViewEventSet = function(){

            $timeout(function() {

                scope.$apply();
                $( ".work-time" ).resizable({
                  grid: 16,
                  maxWidth: $(document).find('.day-wrape')[0].clientWidth-11,
                  minWidth: $(document).find('.day-wrape')[0].clientWidth-11,
                  stop:function( event, ui ){

                    $( ".work-time" ).draggable( "destroy" );
                    var elementHeight =$(document).find('.day-coll .day')[0].clientHeight;
                    var height = $(ui.helper[0]).height();
                    var pos = $(ui.helper[0]).position();
                    pos.top = Number(pos.top.toFixed(0)) ;
                    height = Number(height.toFixed(0)) + 2;

                    var temp = pos.top + height;
                    if (temp>elementHeight){
                      temp = elementHeight;
                    }

                    temp = Number((temp / 16).toFixed(0));
                    temp +=  (decToTime(datyViewlLmit.begin ) /scope.timeInterval.value);

                    scope.workTime[$(ui.helper[0]).attr('day')][$(ui.helper[0]).attr('num')].end = decToTime(Number(temp*scope.timeInterval.value));

                    $(ui.helper[0]).remove();
                    workListChangePrepare(true);
                  }
                });

                $( ".work-time" ).draggable({
                  handle: ".triangle",
                  grid: [ $(document).find('.day-coll .day')[0].clientWidth, 16 ],
                  stop: function( event, ui ) {
                    var elementWidth =$(document).find('.day-coll .day')[0].clientWidth;
                    var elementHeight =$(document).find('.day-coll .day')[0].clientHeight;
                    var pos = $(ui.helper[0]).position();
                    var height = $(ui.helper[0]).height();


                    var posDisplacement = _.indexOf(dayList, $(ui.helper[0]).attr('day'));
                    posDisplacement = (posDisplacement)?(posDisplacement * elementWidth):0;

                    pos.left = Number(pos.left.toFixed(0)) + Number(posDisplacement);

                    if (pos.left < 0 || pos.left > (elementWidth * 7 -1) || pos.top < 0 || (pos.top + height) > elementHeight){
                      _.pullAt(scope.workTime[$(ui.helper[0]).attr('day')], $(ui.helper[0]).attr('num'));
                    }
                    else{
                      var dayNom = (pos.left / elementWidth);
                      dayNom = ((dayNom - Number(dayNom.toFixed(0))) > 0)? (Number(dayNom.toFixed(0)) + 1):Number(dayNom.toFixed(0))


                      pos.top = Number((pos.top / 16).toFixed(0));
                      pos.top +=  (decToTime(datyViewlLmit.begin ) /scope.timeInterval.value);

                      var temp = scope.workTime[$(ui.helper[0]).attr('day')][$(ui.helper[0]).attr('num')];

                      var timeBegin = Number(((pos.top) * scope.timeInterval.value).toFixed(2));
                      var timeEnd = decToTime(timeBegin + Number(timeToDec(temp.end).toFixed(2)) - Number(timeToDec(temp.start).toFixed(2)));
                      timeBegin = decToTime(timeBegin);

                      _.pullAt(scope.workTime[$(ui.helper[0]).attr('day')], $(ui.helper[0]).attr('num'));

                      temp.start = timeBegin;
                      temp.end = timeEnd;
                      scope.workTime[dayList[dayNom]].push(temp);
                    }

                    $(ui.helper[0]).remove();
                    workListChangePrepare(true);
                  }
                });

                $( ".work-time, .triangle" ).disableSelection();
            }, 0);
          }

          var findWorkTimeLimits = function(){
            scope.workTimeLimit = {};
            for (var i in scope.workTime){
              scope.workTimeLimit[i] = {
                begin:25,
                end:-1
              }
              for (var j in scope.workTime[i]){

                if (scope.workTimeLimit[i].begin>scope.workTime[i][j].start){
                  scope.workTimeLimit[i].begin = scope.workTime[i][j].start;
                }

                if (scope.workTimeLimit[i].end<scope.workTime[i][j].end){
                  scope.workTimeLimit[i].end = scope.workTime[i][j].end;
                }
              }
              scope.workTimeLimit[i].begin = scope.workTimeLimit[i].begin.toFixed(2);
              scope.workTimeLimit[i].end = scope.workTimeLimit[i].end.toFixed(2);
              scope.workTimeLimit[i].view = (scope.workTimeLimit[i].begin<25 && scope.workTimeLimit[i].end>-1);

            }
          }

          var findWorkTimePositions = function(){
            scope.workTimePos = {};
            for (var i in scope.workTime){
                scope.workTimePos[i] = [];
              for (var j in scope.workTime[i]){
                scope.workTimePos[i][j]={begin : Number((timeToDec(scope.workTime[i][j].start - datyViewlLmit.begin)/ scope.timeInterval.value).toFixed()) * 16};
                scope.workTimePos[i][j].size = Number((timeToDec(scope.workTime[i][j].end - datyViewlLmit.begin)/ scope.timeInterval.value).toFixed()) * 16;
                scope.workTimePos[i][j].size -= scope.workTimePos[i][j].begin;
              }
            }
            workListViewEventSet();
          }

          var addWorkTime = function(e) {
            if ($(e.target).attr('daypos')){

              var temp = Math.floor((e.offsetY / 16));
              temp +=  (decToTime(datyViewlLmit.begin ) /scope.timeInterval.value);

              scope.workTime[$(e.target).attr('daypos')].unshift({
                start: decToTime(temp * scope.timeInterval.value),
                end: decToTime((temp + 1) * scope.timeInterval.value)
              });

              workListChangePrepare(true);
            }
          }

          var resize = function(){
            workListViewEventSet();
            viewEventSet();
          }

          angular.element($window).bind('resize', resize);
          $('.day-coll .day').bind('click', addWorkTime);

          scope.$on('$destroy', function () {
            angular.element($window).unbind('resize', resize);
            $('.day-coll .day').unbind('click', addWorkTime);
          });

          scope.config = {
            autoHideScrollbar: false,
            theme: 'light',
            advanced:{
              updateOnContentResize: true
            },
            setHeight: 375,
            scrollInertia: 0,
            scrollButtons:{
              enable:false
            }
          };

          scope.timeIntervalList = [
            /*{
              label: '15 min',
              value: 0.25
            },*/
            {
              label: '30 min',
              value: 0.5
            },
            {
              label: '1 hour',
              value: 1
            }/*,
            {
              label: '2 hours',
              value: 2
            }*/
          ];

          scope.timeInterval = scope.timeIntervalList[0];

          scope.timeIntervalChange = function(){
            timeLineBuild();
            findWorkTimePositions();
            findEventPositions();
          }

          var timeLineSuccess = false;

          var timeLineBuild = function(){
            var curTime = datyViewlLmit.begin;
            scope.timeLine = [];

            while (curTime <= datyViewlLmit.end){
              scope.timeLine.push(Number(Math.floor(curTime)) + Number((((curTime - Math.floor(curTime)) * 0.6)).toFixed(2)));
              curTime += scope.timeInterval.value;
            }
            timeLineSuccess = true;
          }

          var initWorkTime = function(){
            if (scope.workTimeList){
              fromListToWeekWorkTime(function(){
                if (!timeLineSuccess){
                  timeLineBuild();
                }
                workListChangePrepare(false);
              });
            }
          }

          scope.$watch('workTimeList', initWorkTime);

          var eventListChangePrepare = function(flag) {
            findEventPositions();
            if (flag) {
              fromWeekToListEvents(function(eventsList){
                scope.eventsChange({data: eventsList});
              });
            }
          }

          var findEventPositions = function(){
            scope.eventsTimePos = {
              'sun':[],
              'mon':[],
              'tue':[],
              'wed':[],
              'thu':[],
              'fri':[],
              'sat':[]};
            for (var i in scope.eventsTime) {
              for (var j in scope.eventsTime[i]) {
                scope.eventsTimePos[i][j] = _.clone(scope.eventsTime[i][j]);
                scope.eventsTimePos[i][j].pos = Math.floor(timeToDec(scope.eventsTime[i][j].start - datyViewlLmit.begin)/ scope.timeInterval.value * 16 + 2 );
                scope.eventsTimePos[i][j].viewPopup = false;
              }
            }

            viewEventSet();
          }

          var viewEventSet = function () {
           /* $timeout(function() {

                scope.$apply();
                $( ".event-time" ).draggable({
                  handle: ".line",
                  grid: [ $(document).find('.day-coll .day')[0].clientWidth, 16 ],
                  stop: function( event, ui ) {
                    $( ".event-time" ).draggable( "destroy" );

                    var elementWidth =$(document).find('.day-coll .day')[0].clientWidth;
                    var elementHeight =$(document).find('.day-coll .day')[0].clientHeight;
                    var pos = $(ui.helper[0]).position();
                    var height = $(ui.helper[0]).height();


                    var posDisplacement = _.indexOf(dayList, $(ui.helper[0]).attr('day'));
                    posDisplacement = (posDisplacement)?(posDisplacement * elementWidth):0;

                    pos.left = Number(pos.left.toFixed(0)) + Number(posDisplacement);

                    if (pos.left < 0 || pos.left > (elementWidth * 7 -1) || pos.top < 0 || (pos.top + height) > elementHeight){
                      _.pullAt(scope.eventsTime[$(ui.helper[0]).attr('day')], $(ui.helper[0]).attr('num'));
                    }
                    else{
                      var dayNom = (pos.left / elementWidth);
                      dayNom = ((dayNom - Number(dayNom.toFixed(0))) > 0)? (Number(dayNom.toFixed(0)) + 1):Number(dayNom.toFixed(0))

                      pos.top = Number((pos.top / 16).toFixed(0));
                      pos.top +=  (decToTime(datyViewlLmit.begin ) /scope.timeInterval.value);

                      var temp = scope.eventsTime[$(ui.helper[0]).attr('day')][$(ui.helper[0]).attr('num')];

                      var timeBegin = Number(((pos.top) * scope.timeInterval.value).toFixed(2));
                      timeBegin = decToTime(timeBegin);

                      _.pullAt(scope.eventsTime[$(ui.helper[0]).attr('day')], $(ui.helper[0]).attr('num'));


                      temp.start = timeBegin;
                      scope.eventsTime[dayList[dayNom]].push(temp);
                    }

                    $(ui.helper[0]).remove();
                    eventListChangePrepare(true);
                  }
                });

                $( ".event-time" ).disableSelection();
            }, 0);*/
          }

          var initEvents = function(){
            if (scope.events){
              fromListToWeekEvents(function(){
                if (!timeLineSuccess){
                  timeLineBuild();
                }
                eventListChangePrepare(false);
              });
            }
          }

          scope.popoverViewChange = function(day, number) {
            scope.eventsTimePos[day][number].viewPopup = !scope.eventsTimePos[day][number].viewPopup;
          }

          scope.removeEvent = function(day, number) {
            _.pullAt(scope.eventsTime[day], number);
            eventListChangePrepare(true);
          }

          scope.editEvent = function(day, number) {
            scope.eventEdit({data:scope.eventsTime[day][number] });
          }

          scope.$watch('events', initEvents);
        }
      }
    };
  });
