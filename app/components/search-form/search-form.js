"use strict";

angular.module("app.component.searchForm", [])
  .component("searchForm", {
    templateUrl: "components/search-form/search-form.html",
    bindings: {
      onSubmit: "&?"
    },
    controller: [function() {
      var ctrl = this;
      ctrl.$onInit = function() {
        ctrl.keyword = "";
      };
      ctrl.onSearch = function() {
        ctrl.onSubmit({keyword: ctrl.keyword});
      }
    }]
  });
