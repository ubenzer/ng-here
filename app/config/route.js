"use strict";

angular.module("app.config.routeConfig", ["ngRoute"])
  .config(["$routeProvider", function($routeProvider) {
    $routeProvider.when("/search", {template: "<search-container></search-container>"});
    $routeProvider.when("/itinerary", {template: "<itinerary-container></itinerary-container>"});
    $routeProvider.when("/map", {template: "<map-container></map-container>"});
    $routeProvider.when("/import/:data*", {
      resolveRedirectTo: ["$q", "$route", "Itinerary", function($q, $route, Itinerary) {
        Itinerary.loadFromString($route.current.params.data);
        return $q.when("/itinerary");
      }]
    });
    $routeProvider.otherwise("search");
  }]);
