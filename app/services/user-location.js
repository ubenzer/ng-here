"use strict";

angular.module("app.service.userLocation", [])
  .service("UserLocation", ["$window", "$q", function($window, $q) {
    var service = this;
    var lastLocation = null;

    service.getLastLocation = function() {
      return lastLocation;
    };

    service.getCurrentLocation = function() {
      if (!("geolocation" in $window.navigator)) {
        return $q.reject();
      }

      var deferred = $q.defer();

      $window.navigator.geolocation.getCurrentPosition(onPosition, onError);
      return deferred.promise;

      function onPosition(position) {
        lastLocation = {latitude: position.coords.latitude, longitude: position.coords.longitude};
        deferred.resolve(lastLocation);
      }

      function onError() {
        deferred.reject();
      }
    }
  }]);
