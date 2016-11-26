"use strict";

angular.module("app.component.navigation", ["app.service.itinerary"])
  .component("navigation", {
    templateUrl: "components/navigation/navigation.html",
    controller: ["Itinerary", function(Itinerary) {
      var ctrl = this;

      ctrl.$onInit = function() {
        ctrl.getItinerarySize = Itinerary.getPlaceCount;
      }
    }]
  });
