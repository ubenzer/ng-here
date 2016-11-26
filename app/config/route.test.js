"use strict";

describe("AppRouting", function() {
  var $route, $injector, $rootScope;

  beforeEach(module("app.config.routeConfig"));
  beforeEach(inject(function(_$injector_, _$rootScope_, _$route_) {
    $route = _$route_;
    $injector = _$injector_;
    $rootScope = _$rootScope_;
  }));

  it("maps paths to container components", function() {
    expect($route.routes["/search"].template).toContain("search-container");
    expect($route.routes["/itinerary"].template).toContain("itinerary-container");
    expect($route.routes["/map"].template).toContain("map-container");

    expect($route.routes[null].redirectTo).toEqual("search");
  });

  it("defines an endpoint to import itinerary via url", function(done) {
    var fn = $route.routes["/import/:data*"].resolveRedirectTo;
    $route.current = {
      params: {
        data: "###encodedItinerary###"
      }
    };
    var loadFromString = sinon.spy();
    var invokedRedirect = $injector.invoke(fn, this, {
      Itinerary: {loadFromString: loadFromString}
    });
    expect(loadFromString.calledOnce).toEqual(true);
    expect(loadFromString.calledWith("###encodedItinerary###")).toEqual(true);
    invokedRedirect.then(function(toRoute) {
      expect(toRoute).toEqual("/itinerary");
      done();
    });
    $rootScope.$digest();
  });
});
