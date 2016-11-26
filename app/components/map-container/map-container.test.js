"use strict";

describe("mapContainerDirective", function() {
  var $q, $rootScope, element, componentScope, Itinerary, Router, sandbox;

  beforeEach(module("app.component.mapContainer"));
  beforeEach(module("templates"));
  beforeEach(inject(function(_$rootScope_, _$q_, $compile, _Itinerary_, _Router_) {
    $rootScope = _$rootScope_;
    $q = _$q_;
    Itinerary = _Itinerary_;
    Router = _Router_;
    element = $compile("<map-container></map-container>")($rootScope);
    $rootScope.$digest();
    componentScope = element.isolateScope().$ctrl;
    sandbox = sinon.sandbox.create();
  }));
  afterEach(function() {
    sandbox.restore();
  });

  it("warns user to add more places", function() {
    sandbox.stub(Itinerary, "getAllPlaces").returns([{item: "1"}]);
    var findRoute = sandbox.stub(Router, "findRoute");
    componentScope.$onInit();
    expect(element[0].querySelectorAll("*").length).toBeGreaterThan(0);
    expect(componentScope.noPlaces).toEqual(true);
    expect(findRoute.callCount).toEqual(0);
  });

  it("displays map", function() {
    var places = [{}, {}];
    var routes = $q.defer();
    sandbox.stub(Itinerary, "getAllPlaces").returns(places);
    sandbox.stub(Itinerary, "getMeansOfTransport").returns("rocket");
    var findRoute = sandbox.stub(Router, "findRoute").returns(routes.promise);

    componentScope.$onInit();
    expect(componentScope.noRouteFound).toEqual(false);
    expect(componentScope.noPlaces).toEqual(false);
    expect(componentScope.isLoading).toEqual(true);

    routes.resolve("resolvedRoute");
    $rootScope.$digest();
    expect(componentScope.route).toEqual("resolvedRoute");
    expect(componentScope.isLoading).toEqual(false);

    expect(findRoute.callCount).toEqual(1);
    expect(findRoute.calledWithExactly(places, "rocket")).toEqual(true);
  });

  it("warns user that no possible routes found", function() {
    var places = [{}, {}];
    sandbox.stub(Itinerary, "getAllPlaces").returns(places);
    var findRoute = sandbox.stub(Router, "findRoute").returns($q.reject());

    componentScope.$onInit();
    expect(componentScope.noRouteFound).toEqual(false);
    expect(componentScope.noPlaces).toEqual(false);
    expect(componentScope.isLoading).toEqual(true);

    $rootScope.$digest();
    expect(componentScope.noRouteFound).toEqual(true);
    expect(componentScope.isLoading).toEqual(false);
  });
});
