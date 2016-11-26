"use strict";

angular.module("app.component.hereMap", ["app.service.herePlatform"])
  .directive("hereMap", ["HerePlatform", function(HerePlatform) {
    return {
      scope: {
        route: "<"
      },
      link: function($scope, $element) {
        var map = null;
        var behavior = null;
        var ui = null;

        initMap();
        drawRoute($scope.route);

        function initMap() {
          var defaultLayers = HerePlatform.createDefaultLayers();

          // Instantiate the map:
          map = new H.Map(
            $element[0],
            defaultLayers.normal.map
          );

          behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
          ui = H.ui.UI.createDefault(map, defaultLayers);
        }

        function drawRoute(route) {
          var routeShape = route.shape;
          var strip = new H.geo.Strip();

          routeShape.forEach(function(point) {
            var parts = point.split(",");
            strip.pushLatLngAlt(parts[0], parts[1]);
          });

          var routeLine = new H.map.Polyline(strip, {
            style: {
              strokeColor: "blue",
              lineWidth: 10
            }
          });

          var markers = route.waypoint.map(function(wp) {
            var mappedPosition = wp.mappedPosition;
            return new H.map.Marker({
              lat: mappedPosition.latitude,
              lng: mappedPosition.longitude
            });
          });

          map.addObjects([routeLine].concat(markers));
          map.setViewBounds(routeLine.getBounds());
        }
      }
    }
  }]);
