(function () {
    'use strict';
    angular
        .module('common.services')
        .factory('LocationsResource', ['$resource', 'appSettings', LocationsResource]);

    function LocationsResource($resource, appSettings) {
        return $resource(appSettings.serverPath + 'api/pc/scripts');
    }
}());