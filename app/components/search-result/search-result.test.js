"use strict";

describe("searchResultDirective", function() {
  var $rootScope, element, componentScope, Itinerary, sandbox;

  beforeEach(module("app.component.searchResult"));
  beforeEach(module("templates"));
  beforeEach(inject(function(_$rootScope_, $compile, _Itinerary_) {
    $rootScope = _$rootScope_;
    Itinerary = _Itinerary_;
    $rootScope.place = {id: "123", title: "Wannsee"};
    element = $compile("<search-result place='place'></search-result>")($rootScope);
    $rootScope.$digest();
    componentScope = element.isolateScope().$ctrl;
    sandbox = sinon.sandbox.create();
  }));
  afterEach(function() {
    sandbox.restore();
  });

  it("renders properly", function() {
    var hasPlace = sinon.stub(Itinerary, "hasPlace").returns(true);
    expect(element[0].querySelectorAll("*").length).toBeGreaterThan(0);
    componentScope.$onInit();

    expect(componentScope.inItinerary).toEqual(true);
    expect(componentScope.place).toEqual($rootScope.place);
    expect(hasPlace.calledWithExactly("123")).toEqual(true);
  });

  it("adds place to and removes it from itinerary when requested", function() {
    sinon.stub(Itinerary, "hasPlace").returns(false);
    var addPlace = sinon.stub(Itinerary, "addPlace");
    var removePlace = sinon.stub(Itinerary, "removePlace");

    componentScope.$onInit();
    expect(componentScope.inItinerary).toEqual(false);
    expect(element[0].querySelectorAll(".search-result__add").length).toEqual(1);
    expect(element[0].querySelectorAll(".search-result__remove").length).toEqual(0);

    componentScope.addToItinerary();
    $rootScope.$digest();
    expect(addPlace.calledWithExactly(componentScope.place));
    expect(componentScope.inItinerary).toEqual(true);
    expect(element[0].querySelectorAll(".search-result__add").length).toEqual(0);
    expect(element[0].querySelectorAll(".search-result__remove").length).toEqual(1);

    componentScope.removeFromItinerary();
    $rootScope.$digest();
    expect(removePlace.calledWithExactly(componentScope.place));
    expect(componentScope.inItinerary).toEqual(false);
  });
});
