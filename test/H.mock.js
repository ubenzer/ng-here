"use strict";

beforeAll(function() {
  var Platform = function() {};
  Platform.prototype.getPlacesService = angular.noop;
  Platform.prototype.getRoutingService = angular.noop;
  Platform.prototype.createDefaultLayers = function() {
    return {
      normal: {
        map: "##normalmap##"
      }
    }
  };

  var Search = function() {};
  Search.prototype.request = angular.noop;

  var Map = function() {};
  Map.prototype.addObjects = angular.noop;
  Map.prototype.setViewBounds = angular.noop;

  var Marker = function() {};
  var Behavior = function() {};
  var MapEvents = function() {};
  var Strip = function() {};
  var Polyline = function() {};
  Polyline.prototype.getBounds = angular.noop;

  window.H = {
    Map: Map,
    geo: {
      Strip: Strip
    },
    map: {
      Polyline: Polyline,
      Marker: Marker
    },
    mapevents: {
      Behavior: Behavior,
      MapEvents: MapEvents
    },
    places: {
      Search: Search
    },
    service: {
      Platform: Platform
    },
    ui: {
      UI: {
        createDefault: angular.noop
      }
    }
  };
});
