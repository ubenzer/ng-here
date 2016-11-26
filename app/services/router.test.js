"use strict";

describe("RouterService", function() {
  var $rootScope, HerePlatform, Router, sandbox;

  beforeEach(module("app.service.router"));
  beforeEach(inject(function(_HerePlatform_, _$rootScope_, _Router_) {
    HerePlatform = _HerePlatform_;
    $rootScope = _$rootScope_;
    Router = _Router_;
    sandbox = sinon.sandbox.create();
  }));
  afterEach(function() {
    sandbox.restore();
  });

  describe("search", function() {
    it("returns a route in promise, if a route is found", function(done) {
      var calculateRoute = mockRouting(getMockRoutingResponse());

      var placeObjects = [
        {
          latitude: 50,
          longitude: 12
        },
        {
          latitude: 60,
          longitude: 24
        }
      ];
      Router.findRoute(placeObjects, "car")
        .then(function(route) {
          expect(calculateRoute.calledOnce).toEqual(true);
          expect(calculateRoute.calledWith({
            mode: "fastest;car",
            representation: "display",
            waypoint0: "geo!50,12",
            waypoint1: "geo!60,24"
          })).toEqual(true);

          expect(route.mock).toEqual("first routing data");
          done();
        });
      $rootScope.$digest();
    });

    it("returns a rejected promise in case no route found", function(done) {
      mockRouting(getMockRoutingNoResponse());

      var placeObjects = [
        {
          latitude: 50,
          longitude: 12
        },
        {
          latitude: 60,
          longitude: 24
        }
      ];
      Router.findRoute(placeObjects, "car").catch(done);
      $rootScope.$digest();
    });

    it("returns a rejected promise in case something goes wrong", function(done) {
      mockRouting(null, {});

      var placeObjects = [
        {
          latitude: 50,
          longitude: 12
        },
        {
          latitude: 60,
          longitude: 24
        }
      ];
      Router.findRoute(placeObjects, "car").catch(done);
      $rootScope.$digest();
    });
  });

  function mockRouting(result, error) {
    var calculateRoute = sandbox.spy(function calculateRoute(routingParameters, onResult, onError) {
      if (result) {
        onResult(result);
      } else {
        onError(error);
      }
    });

    sandbox.stub(HerePlatform, "getRoutingService",
      function() {
        return {
          calculateRoute: calculateRoute
        };
      });

    return calculateRoute;
  }
  function getMockRoutingResponse() {
    return {
      response: {
        route: [
          {
            mock: "first routing data"
          },
          {
            mock: "another routing data"
          }
        ]
      }
    }
  }
  function getMockRoutingNoResponse() {
    return {}
  }
});
