"use strict";

angular.module("app", [
  "ngSanitize",
  "ngRoute",
  "app.component.hereMap",
  "app.component.itineraryContainer",
  "app.component.mapContainer",
  "app.component.navigation",
  "app.component.place",
  "app.component.searchContainer",
  "app.component.searchForm",
  "app.component.searchResult",
  "app.config.routeConfig",
  "app.service.herePlatform",
  "app.service.itinerary",
  "app.service.places",
  "app.service.router",
  "app.service.userLocation"
]);
