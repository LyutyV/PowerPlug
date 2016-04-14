(function(){
  'use strict';

  angular
  .module("powerPlug")
  .directive("customRadioButtonTypeOne", function(){
    return {
      restrict: "E",
      template: "<div><input type='radio' id='{{id}}' name='{{name}}' /><label for={{id}}><span><span></span></span>{{text}}</label></div>",
      scope: {
        id: "=",
        name: "=",
        text: "="
      }
    };
  });
})();
