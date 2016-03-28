(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('ComputerGroupsResource', ['$resource', 'appSettings', ComputerGroupsResource]);

    function ComputerGroupsResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/computer-groups');
    }
}());