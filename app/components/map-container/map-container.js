"use strict";

angular.module("app.component.mapContainer", ["app.service.itinerary", "app.service.router"])
  .component("mapContainer", {
    templateUrl: "components/map-container/map-container.html",
    controller: ["Itinerary", "Router", function(Itinerary, Router) {
      var ctrl = this;

      ctrl.$onInit = function() {
        ctrl.isLoading = false;
        ctrl.noRouteFound = false;
        ctrl.noPlaces = false;
        ctrl.route = null;

        findAndShowRoute();
      };

      function findAndShowRoute() {
        var itineraryItems = Itinerary.getAllPlaces();
        var transportType = Itinerary.getMeansOfTransport();

        if (itineraryItems.length < 2) {
          ctrl.noPlaces = true;
          return;
        }
        ctrl.noRouteFound = false;
        ctrl.noPlaces = false;
        ctrl.isLoading = true;
        Router.findRoute(itineraryItems, transportType)
          .then(function(route) {
            ctrl.route = route;
          })
          .catch(function() {
            ctrl.noRouteFound = true;
          })
          .finally(function() {
            ctrl.isLoading = false;
          });
      }
    }]
  });
