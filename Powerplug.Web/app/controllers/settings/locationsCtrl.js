/// <reference

(function () {
    'use strict';
    angular
        .module('powerPlug')
        .controller('LocationsCtrl',
                     ['$state', '$document', '$mdDialog', '$mdMedia', '$scope', 'LocationsResource', LocationsCtrl]);


    function LocationsCtrl($state, $document, $mdDialog, $mdMedia, $scope, LocationsResource) {
        var vm = this;

        LocationsResource.query(function (data) {
            onSuccess(data);
        }, function (error) {
            onError(error);
        });

        function onError(err) {
            console.log(err);
            if (err.status === 401 || err.status === -1) {
                $state.go('login');
            }
        }

        function onSuccess(data) {
            vm.location = data;
        }

        vm.saveChanges = function () {
            ///dooo
            LocationsResource.saveAll(returnObj, function (data) {
                alert('Successfully Done!');
                onSuccess(data);
            }, function (err) {
                onError(err);
            });
        }

        vm.discardChanges = function () {
            LocationsResource.query(function (data) {
                onSuccess(data);
            }, function (error) {
                onError(error);
            });
        }        
    }
}());