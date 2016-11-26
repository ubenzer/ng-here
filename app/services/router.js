"use strict";

angular.module("app.service.router", ["app.service.herePlatform"])
  .service("Router", ["$q", "HerePlatform", function($q, HerePlatform) {
    var service = this;

    service.findRoute = function(placeObjects, transportation) {
      var deferred = $q.defer();

      var routingParameters = {
        mode: "fastest;" + transportation,
        representation: "display"
      };

      placeObjects.forEach(function(place, id) {
        routingParameters["waypoint" + id] = "geo!" + place.latitude + "," + place.longitude
      });

      HerePlatform.getRoutingService().calculateRoute(routingParameters, onResult, onError);

      return deferred.promise;

      function onResult(result) {
        if (!result.response) {
          deferred.reject();
        } else {
          deferred.resolve(result.response.route[0]);
        }
      }
      function onError() {
        deferred.reject();
      }
    }
  }]);
