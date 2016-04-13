angular
  .module('powerPlug')
  .directive('charts', function($window, $timeout, $document) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        chartType: '=',
        graph: '='
      },
      templateUrl: 'app/directives/charts/charts.html',
      link: {
        pre: function(scope) {
          scope.highchartsNG = {
            title: {
              text: ''
            },
            options: {
              chart: {
                type: 'line'
              },
              legend: {
                enabled: false
              },
              credits: {
                enabled: false
              },
              exporting: {
                enabled: false
              },
              loading: false,

              plotOptions: {
                line: {
                  lineWidth: 3,
                  marker: {
                    enabled: false
                  }
                }
              },
              xAxis: {
                gridLineWidth: 1,
                tickWidth: 0,
                lineWidth: 0,
                minTickInterval: 0.1,
                tickInterval: 1
              },
              yAxis: {
                gridLineWidth: 0,
                title: {
                  enabled: false
                },
                minTickInterval: 1,
                tickInterval: 25,
                minRange: 100,
                max: 100
              }
            }
          };

          //scope.highchartsNG.options.chart.width = ($window.innerWidth-329)/3;

          if (scope.chartType == 'work') {

            scope.title = 'Work Days';
            scope.highchartsNG.options.chart.backgroundColor = "#fff";
            scope.highchartsNG.options.yAxis.alternateGridColor = '#f6f6f6';
          } else {
            scope.title = 'Non-Work Days';
            scope.highchartsNG.options.chart.backgroundColor = "#e6e6e6";
            scope.highchartsNG.options.yAxis.alternateGridColor = '#eeeeee';
          }

          scope.highchartsNG.series = scope.graph;
        },
        post: function(scope) {
          var resize = function() {
            scope.highchartsNG.size.width = document.getElementsByClassName('chart-wraper')[0].clientWidth - 30;
            scope.$apply();
          }

          angular.element($window).bind('resize', resize);

          scope.$on('$destroy', function () {
            angular.element($window).unbind('resize', resize);
          });

          $timeout(function() {
            scope.highchartsNG.size = {
              width: document.getElementsByClassName('chart-wraper')[0].clientWidth - 30,
              height: 235
            };
          }, 0);

        }
      }
    };
  });
