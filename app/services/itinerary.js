"use strict";

angular.module("app.service.itinerary", [])
  .service("Itinerary", ["$window", "$log", function($window, $log) {
    var placeList = [];
    var meansOfTransport = "car";

    this.exportToString = function() {
      // it might be better to go through a url minification service
      var payload = encodeURIComponent(JSON.stringify({p: placeList, m: meansOfTransport}));
      return $window.location.origin + $window.location.pathname + "#!/import/" + payload;
    };

    this.loadFromString = function(str) {
      try {
        var json = JSON.parse(str);
        placeList = json.p;
        meansOfTransport = json.m;
        // users can feed weird data into itinerary unless we have more strict check
      } catch (e) {
        $log.warn("Unable to load from string", e);
      }
    };

    this.getAllPlaces = function() {
      return angular.copy(placeList);
    };

    this.getPlaceCount = function() {
      return placeList.length;
    };

    this.movePlaceUp = function(id) {
      var index = getIndexOf(id);
      if (index < 1) { return; }

      moveItineraryItem(index, index - 1);
    };

    this.movePlaceDown = function(id) {
      var index = getIndexOf(id);
      if (index < 0 || index > placeList.length - 2) { return; }

      moveItineraryItem(index, index + 1);
    };

    this.removePlace = function(id) {
      var index = getIndexOf(id);
      if (index < 0) { return; }
      placeList.splice(index, 1);
    };

    this.addPlace = function(placeObj) {
      var index = getIndexOf(placeObj.id);
      if (index >= 0) { return; }
      placeList.push(placeObj);
    };

    this.hasPlace = function(id) {
      return getIndexOf(id) >= 0;
    };

    this.setMeansOfTransport = function(t) {
      meansOfTransport = t;
    };

    this.getMeansOfTransport = function() {
      return meansOfTransport;
    };

    function getIndexOf(id) {
      // if we are expecting a huge amount of
      // places in one, than we need to optimize this
      for (var idx = 0; idx < placeList.length; idx++) {
        if (placeList[idx].id === id) { return idx; }
      }
      return -1;
    }

    function moveItineraryItem(fromIdx, toIdx) {
      placeList.splice(toIdx, 0, placeList.splice(fromIdx, 1)[0]);
    }
  }]);
