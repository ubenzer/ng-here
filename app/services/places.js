"use strict";

angular.module("app.service.places", ["app.service.herePlatform"])
  .service("Places", ["$q", "HerePlatform", function($q, HerePlatform) {
    var service = this;
    var search = new H.places.Search(HerePlatform.getPlacesService());
    // to be used when where is not provided
    // service can be converted to provder and this can be defined there
    service.defaultLocation = "52.5309352,13.3827263;u=100000";

    service.search = function(keyword, where) {
      var deferred = $q.defer();

      var at = service.defaultLocation;
      if (where) {
        at = where.latitude + "," + where.longitude;
      }
      var params = {
        q: keyword,
        at: at
      };
      search.request(params, {}, onResult, onError);

      return deferred.promise;

      function onResult(data) {
        // console.table(data.results.items);
        var normalizedPlace = data.results.items.map(function(searchResult) {
          return {
            id: searchResult.id,
            title: searchResult.title,
            vicinityHtml: searchResult.vicinity,
            category: searchResult.category.title,
            latitude: searchResult.position[0],
            longitude: searchResult.position[1]
          }
        });
        deferred.resolve(normalizedPlace);
      }
      function onError() {
        deferred.reject();
      }
    }
  }]);
