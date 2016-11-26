"use strict";

describe("navigationDirective", function() {
  var $rootScope, element, componentScope, Itinerary, sandbox;

  beforeEach(module("app.component.navigation"));
  beforeEach(module("templates"));
  beforeEach(inject(function(_$rootScope_, $compile, _Itinerary_) {
    $rootScope = _$rootScope_;
    Itinerary = _Itinerary_;
    element = $compile("<navigation></navigation>")($rootScope);
    $rootScope.$digest();
    componentScope = element.isolateScope().$ctrl;
    sandbox = sinon.sandbox.create();
  }));
  afterEach(function() {
    sandbox.restore();
  });

  it("renders properly, showing place count on screen", function() {
    sandbox.stub(Itinerary, "getPlaceCount").returns(20);

    componentScope.$onInit();
    $rootScope.$digest();
    expect(componentScope.getItinerarySize).toEqual(Itinerary.getPlaceCount) ;
    expect(element[0].querySelectorAll("*").length).toBeGreaterThan(0);
    expect(element[0].querySelector(".navigation__itinerary-size").textContent).toEqual("20");
  });
});
