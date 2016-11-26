"use strict";

describe("PlacesService", function() {
  var $window, $rootScope, Places, sandbox;

  beforeEach(module("app.service.places"));
  beforeEach(inject(function(_$window_, _$rootScope_, _Places_) {
    $window = _$window_;
    $rootScope = _$rootScope_;
    Places = _Places_;
    sandbox = sinon.sandbox.create();
  }));
  afterEach(function() {
    sandbox.restore();
  });

  describe("search", function() {
    it("returns normalized places list in promise", function(done) {
      var request = sandbox.stub($window.H.places.Search.prototype, "request",
        function(params, headers, onResult) {
          onResult(getMockSearchResponse());
        });

      Places.search("bars", {latitude: 52, longitude: 13})
        .then(function(places) {
          expect(request.calledOnce).toEqual(true);
          expect(request.calledWith({q: "bars", at: "52,13"})).toEqual(true);

          expect(places.length).toEqual(2);
          expect(places[0].id).toEqual("1");
          expect(places[0].title).toEqual("Bar 1");
          expect(places[0].vicinityHtml).toEqual("Berlin");
          expect(places[0].category).toEqual("Bar - Restaurant");
          expect(places[0].latitude).toEqual(52.001);
          expect(places[0].longitude).toEqual(13.001);
          done();
        });
      $rootScope.$digest();
    });

    it("uses a default location, if consumer doesn't provide one", function(done) {
      var request = sandbox.stub($window.H.places.Search.prototype, "request",
        function(params, headers, onResult) {
          onResult(getMockSearchResponse());
        });

      Places.search("antalya")
        .then(function() {
          expect(request.calledOnce).toEqual(true);
          expect(request.calledWith({q: "antalya", at: Places.defaultLocation})).toEqual(true);
          done();
        });
      $rootScope.$digest();
    });

    it("returns a rejected promise in case something goes wrong", function(done) {
      var request = sandbox.stub($window.H.places.Search.prototype, "request",
        function(params, headers, onResult, onError) { onError(); });

      Places.search("antalya").catch(done);
      $rootScope.$digest();
    });
  });

  function getMockSearchResponse() {
    return {
      results: {
        items: [
          {
            id: "1",
            title: "Bar 1",
            vicinity: "Berlin",
            category: {
              title: "Bar - Restaurant"
            },
            position: [52.001, 13.001]
          },
          {
            id: "2",
            title: "Bar 2",
            vicinity: "Berlin 2",
            category: {
              title: "Bar 2 - Restaurant"
            },
            position: [52.002, 13.002]
          }
        ]
      }
    }
  }
});
