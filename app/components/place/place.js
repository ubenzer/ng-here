"use strict";

angular.module("app.component.place", ["ngSanitize"])
  .component("place", {
    templateUrl: "components/place/place.html",
    bindings: {
      place: "<"
    }
  });
