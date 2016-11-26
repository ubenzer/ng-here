"use strict";

angular.module("app.component.searchResult", ["app.service.itinerary"])
  .component("searchResult", {
    templateUrl: "components/search-result/search-result.html",
    bindings: {
      place: "<"
    },
    controller: ["Itinerary", function(Itinerary) {
      var ctrl = this;

      ctrl.$onInit = function() {
        ctrl.inItinerary = Itinerary.hasPlace(this.place.id);
      };

      ctrl.addToItinerary = function() {
        Itinerary.addPlace(ctrl.place);
        ctrl.inItinerary = true;
      };

      ctrl.removeFromItinerary = function() {
        Itinerary.removePlace(ctrl.place.id);
        ctrl.inItinerary = false;
      };
    }]
  });
