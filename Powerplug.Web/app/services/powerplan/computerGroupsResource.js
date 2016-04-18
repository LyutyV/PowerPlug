(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('ComputerGroupsResource', ['$resource', 'appSettings', ComputerGroupsResource]);

    function ComputerGroupsResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/pc/computer-groups');
    }
}());