angular
  .module('powerPlug')
  .directive('weekView', function($timeout,$window,$document) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        events:'=',
        workTime: '=',
        workTimeChange: '&'
      },
      templateUrl: 'app/directives/weekView/weekView.html',
      link: {
        pre: function(scope) {

          var timeToDec = function(time){
            return Number(Math.floor(time)) + Number((time - Math.floor(time))/0.6);
          }

          var decToTime = function(dec){
            return Number(Math.floor(dec)) + Number((dec - Math.floor(dec))*0.6);
          }

          scope.findWorkTimeLimits = function(){
            scope.workTimeLimit = {};
            for (var i in scope.workTime){
              scope.workTimeLimit[i] = {
                begin:25,
                end:-1
              }
              for (var j in scope.workTime[i]){

                if (scope.workTimeLimit[i].begin>scope.workTime[i][j].begin){
                  scope.workTimeLimit[i].begin = scope.workTime[i][j].begin;
                }

                if (scope.workTimeLimit[i].end<scope.workTime[i][j].end){
                  scope.workTimeLimit[i].end = scope.workTime[i][j].end;
                }
              }

              scope.workTimeLimit[i].view = (scope.workTimeLimit[i].begin<25 && scope.workTimeLimit[i].end>-1);

            }
          }

          //scope.findWorkTimeLimits();

          var workListChackMerge = function() {
            var flag = false;
            for (var i in scope.workTime) {
              for (var j in scope.workTime[i]) {
                for (var k in scope.workTime[i]) {
                  if (j != k) {
                    if (scope.workTime[i][j].begin < scope.workTime[i][k].begin && scope.workTime[i][j].end > scope.workTime[i][k].begin){
                      flag = true;
                      if (scope.workTime[i][k].end > scope.workTime[i][j].end) {
                        scope.workTime[i][j].end = scope.workTime[i][k].end;
                      }
                      _.pullAt(scope.workTime[i], k);
                    }
                    else if (scope.workTime[i][j].end == scope.workTime[i][k].begin) {
                      flag = true;
                      scope.workTime[i][j].end = scope.workTime[i][k].end;
                      _.pullAt(scope.workTime[i], k);
                    }
                  }
                }
              }
            }
            return flag;
          }

          var workListChangePrepare = function(flag){
            var temp = workListChackMerge();
            if (temp || flag){
              scope.workTimeChange({data: scope.workTime});
            }
            scope.findWorkTimePositions();
            scope.findWorkTimeLimits();
            viewEventSet();
          }

          var viewEventSet = function(){

            $timeout(function() {

                var dayList = ['sun','mon','tue','wed','thu','fri','sat'];

                $( ".work-time" ).resizable({
                  grid: 16,
                  maxWidth: $document.find('.day-wrape')[0].clientWidth-11,
                  minWidth: $document.find('.day-wrape')[0].clientWidth-11,
                  stop:function( event, ui ){
                    var elementHeight =$document.find('.day-coll .day')[0].clientHeight;
                    var height = $(ui.helper[0]).height();
                    var pos = $(ui.helper[0]).position();
                    pos.top = Number(pos.top.toFixed(0));
                    height = Number(height.toFixed(0)) + 2;

                    var temp = pos.top + height;
                    if (temp>elementHeight){
                      temp = elementHeight;
                    }

                    var prev = 0;
                    var post = 16;
                    while (!(prev<=temp && post>temp)) {
                      prev = post;
                      post += 16;
                    }

                    if ((temp - prev) > (post - temp)){
                      temp = post;
                    }
                    else{
                      temp = prev;
                    }

                    scope.workTime[$(ui.helper[0]).attr('day')][$(ui.helper[0]).attr('num')].end = decToTime(Number((temp/16)*scope.timeInterval.value));


                    $(ui.helper[0]).remove();

                    workListChangePrepare(true);
                  }
                });

                $( ".work-time" ).draggable({
                  handle: ".triangle",
                  grid: [ $document.find('.day-coll .day')[0].clientWidth, 16 ],
                  stop: function( event, ui ) {
                    var elementWidth =$document.find('.day-coll .day')[0].clientWidth;
                    var elementHeight =$document.find('.day-coll .day')[0].clientHeight;
                    var pos = $(ui.helper[0]).position();
                    var height = $(ui.helper[0]).height();


                    var posDisplacement = _.indexOf(dayList, $(ui.helper[0]).attr('day'));

                    if (posDisplacement){
                      posDisplacement = posDisplacement * elementWidth;
                    }
                    else{
                      posDisplacement = 0;
                    }

                    pos.left = Number(pos.left.toFixed(0)) + Number(posDisplacement);

                    if (pos.left < 0 || pos.left > (elementWidth * 7 -1) || pos.top < 0 || (pos.top + height) > elementHeight){
                      _.pullAt(scope.workTime[$(ui.helper[0]).attr('day')], $(ui.helper[0]).attr('num'));
                    }
                    else{

                      var prev = 0, post = elementWidth;
                      var dayNom = 0;
                      while (!(prev<=pos.left && post>pos.left)) {
                        prev = post;
                        post += elementWidth;
                        dayNom++;
                      }

                      prev = 0;
                      post = 16;
                      while (!(prev<=pos.top && post>pos.top)) {
                        prev = post;
                        post += 16;
                      }

                      if ((pos.top - prev) > (post - pos.top)){
                        pos.top = post;
                      }
                      else{
                        pos.top = prev;
                      }

                      var temp = scope.workTime[$(ui.helper[0]).attr('day')][$(ui.helper[0]).attr('num')];


                      var timeBegin = Number(((pos.top / 16) * scope.timeInterval.value).toFixed(2));

                      var timeEnd = decToTime(timeBegin + Number(timeToDec(temp.end).toFixed(2)) - Number(timeToDec(temp.begin).toFixed(2)));

                      timeBegin = decToTime(timeBegin);

                      _.pullAt(scope.workTime[$(ui.helper[0]).attr('day')], $(ui.helper[0]).attr('num'));

                      temp.begin = timeBegin;
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

          var resize = function() {
            viewEventSet();
            scope.$apply();
          }

          var addWorkTime = function(e) {
            if ($(e.target).attr('daypos')){

              var prev = 0;
              var post = 16;
              while (!(prev<=e.offsetY && post>e.offsetY)) {
                prev = post;
                post += 16;
              }

              var temp = Number((prev / 16).toFixed());

              scope.workTime[$(e.target).attr('daypos')].unshift({
                begin: decToTime(temp * scope.timeInterval.value),
                end: decToTime((temp + 1) * scope.timeInterval.value)
              });

              workListChangePrepare(true);
            }
          }

          angular.element($window).bind('resize', resize);
          $('.day-coll .day').bind('click', addWorkTime);

          scope.$on('$destroy', function () {
            angular.element($window).unbind('resize', resize);
            $('.day-coll .day').unbind('click', addWorkTime);
          });

          scope.findWorkTimePositions = function(){
            scope.workTimePos = {};
            for (var i in scope.workTime){
                scope.workTimePos[i] = [];
              for (var j in scope.workTime[i]){
                var temp = Math.floor(scope.workTime[i][j].begin);
                scope.workTimePos[i][j]={begin : Number(temp/scope.timeInterval.value)};
                scope.workTimePos[i][j].begin += Number(((scope.workTime[i][j].begin - temp)/0.6)/scope.timeInterval.value);

                temp = Math.floor(scope.workTime[i][j].end);
                scope.workTimePos[i][j].size = Number(Math.floor(temp)/scope.timeInterval.value);
                scope.workTimePos[i][j].size += Number(((scope.workTime[i][j].end - temp)/0.6)/scope.timeInterval.value);
                scope.workTimePos[i][j].size -= scope.workTimePos[i][j].begin;

                scope.workTimePos[i][j].size = (scope.workTimePos[i][j].size * 16).toFixed(0);
                scope.workTimePos[i][j].begin = (scope.workTimePos[i][j].begin * 16).toFixed(0);
              }
            }
            viewEventSet();
          }

          scope.findEventPositions = function(){
            scope.eventsPos = {};
            for (var i in scope.events){
              if (!scope.eventsPos[scope.events[i].day]){
                scope.eventsPos[scope.events[i].day] = [];
              }
              var temp = Math.floor(scope.events[i].time);
              scope.eventsPos[scope.events[i].day]={pos : Number(temp/scope.timeInterval.value)};
              scope.eventsPos[scope.events[i].day].pos += Number(((scope.events[i].time - temp)/0.6)/scope.timeInterval.value);

              scope.eventsPos[scope.events[i].day].pos = (scope.eventsPos[scope.events[i].day].pos * 16).toFixed(0);

            }
            viewEventSet();
          }
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
            var curTime = 0;
            scope.timeLine = [];

            while (curTime <= 24){
              scope.timeLine.push(Number(Math.floor(curTime)) + Number((((curTime - Math.floor(curTime)) * 0.6)).toFixed(2)));
              curTime += scope.timeInterval.value;
            }
            scope.findWorkTimePositions();

            viewEventSet();
          }

          scope.timeIntervalChange();


        },
        post: function() {

        }
      }
    };
  });
