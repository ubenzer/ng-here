"use strict";

angular.module("app.component.searchContainer", ["app.service.places", "app.service.userLocation"])
  .component("searchContainer", {
    templateUrl: "components/search-container/search-container.html",
    controller: ["Places", "UserLocation", function(Places, UserLocation) {
      var ctrl = this;
      var lastRequestId = 0;

      ctrl.$onInit = function() {
        ctrl.inProgress = false;
        ctrl.hasError = false;
        ctrl.searchResults = [];
        ctrl.hasSearch = false;
        ctrl.cantGetLocation = false;

        // fire and forget:
        // we try to get user's location on page load to
        // get better results on search
        UserLocation.getCurrentLocation()
          .catch(function() {
            ctrl.cantGetLocation = true;
          });
      };

      ctrl.onSearch = function(keyword) {
        var userLocation = UserLocation.getLastLocation();

        lastRequestId++;
        var currentRequestId = lastRequestId;

        ctrl.hasSearch = true;
        ctrl.inProgress = true;
        ctrl.hasError = false;

        Places.search(keyword, userLocation)
          .then(function(searchResults) {
            if (currentRequestId !== lastRequestId) {
              // user typed another search and this result is useless
              return;
            }
            ctrl.inProgress = false;
            ctrl.searchResults = searchResults;
          })
          .catch(function() {
            if (currentRequestId !== lastRequestId) { return; }
            ctrl.inProgress = false;
            ctrl.hasError = true;
          });
      }
    }]
  });
