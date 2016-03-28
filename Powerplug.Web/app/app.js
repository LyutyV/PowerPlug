﻿(function () {
    'use strict';

    angular
        .module('powerPlug', ['ngCookies', 'ngMaterial', 'ui.router', 'common.services'])
        .config(configRoute)
        .config(configExceptionHandler)
        .config(configDatePicker)
        .run(run);

    configDatePicker.$inject = ['$mdDateLocaleProvider'];
    function configDatePicker($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function (date) {
            return moment(date).format('YYYY-MM-DD');
        };
    }

    configExceptionHandler.$inject = ['$provide'];
    function configExceptionHandler($provide) {
        $provide.decorator("$exceptionHandler",
            ["$delegate",
                function ($delegate) {
                    return function (exception, cause) {
                        exception.message = "Error occured \n Message:" + exception.message;
                        $delegate(exception, cause);
                        alert(exception.message);
                    };
                }
            ]);
    }

    configRoute.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
    function configRoute($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise("/login");

        $stateProvider
            .state('login', {
                url: "/login",
                controller: 'LoginCtrl',
                templateUrl: 'views/login/login.html',
                controllerAs: 'vm'
            })
            .state('dashboard', {
                url: "/dashboard",
                views: {
                    '': {
                        templateUrl: 'views/dashboard/dashboard.html',
                        controller: 'DashboardCtrl',
                        controllerAs: 'vm'
                    },
                    'v1@dashboard': {
                        templateUrl: 'views/dashboard/dashboardView1.html',
                        controller: 'DashboardView1Ctrl',
                        controllerAs: 'vm'
                    },
                    'v2@dashboard': {
                        templateUrl: 'views/dashboard/dashboardView2.html',
                        controller: 'DashboardView2Ctrl',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('savingPlans', {
                url: "/savingPlans",
                controller: 'SavingPlansCtrl',
                templateUrl: 'views/powerplan/savingPlans.html',
                controllerAs: 'vm'
            })
            .state('savingPlanEditor', {
                url: "/savingPlanEditor/:policyId",
                controller: 'SavingPlanEditorCtrl',
                templateUrl: 'views/powerplan/savingPlanEditor.html',
                controllerAs: 'vm'
            })
            .state('computerGroups', {
                url: "/",
                controller: 'ComputerGroupsCtrl',
                templateUrl: 'views/powerplan/computerGroups.html',
                controllerAs: 'vm'
            });

    }

    run.$inject = ['$rootScope', '$location', '$cookies', '$http', '$state'];
    function run($rootScope, $location, $cookies, $http, $state) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + $rootScope.globals.currentUser.token; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $state.go('login');
            }
        });

        $rootScope.menuActive = function (url) {            
            return $location.path() === url;           
        }

        $rootScope.innerTemplate = function () {
            return $location.path() !== '/login';
        }
    }
}());