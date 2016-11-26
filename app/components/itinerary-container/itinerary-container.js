"use strict";

angular.module("app.component.itineraryContainer", ["app.service.itinerary"])
  .component("itineraryContainer", {
    templateUrl: "components/itinerary-container/itinerary-container.html",
    controller: ["Itinerary", function(Itinerary) {
      var ctrl = this;

      ctrl.$onInit = function() {
        ctrl.itineraryItems = Itinerary.getAllPlaces();
        ctrl.transportType = Itinerary.getMeansOfTransport();
        ctrl.shareUrl = null;
      };

      ctrl.onTransportTypeUpdated = function() {
        Itinerary.setMeansOfTransport(ctrl.transportType);
      };

      ctrl.createShareUrl = function() {
        ctrl.shareUrl = Itinerary.exportToString();
      };

      ctrl.movePlaceUp = function(id) {
        Itinerary.movePlaceUp(id);
        ctrl.itineraryItems = Itinerary.getAllPlaces();
      };

      ctrl.movePlaceDown = function(id) {
        Itinerary.movePlaceDown(id);
        ctrl.itineraryItems = Itinerary.getAllPlaces();
      };

      ctrl.remove = function(id) {
        Itinerary.removePlace(id);
        ctrl.itineraryItems = Itinerary.getAllPlaces();
      };
    }]
  });
