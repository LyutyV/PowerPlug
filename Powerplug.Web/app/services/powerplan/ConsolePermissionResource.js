(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('ConsolePermissionResource', ['$resource', 'appSettings', ConsolePermissionResource]);

    function ConsolePermissionResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/pc/scripts');
    }
}());