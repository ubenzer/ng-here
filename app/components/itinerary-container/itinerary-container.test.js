"use strict";

describe("itineraryContainerDirective", function() {
  var $rootScope, element, componentScope, Itinerary, sandbox;

  beforeEach(module("app.component.itineraryContainer"));
  beforeEach(module("templates"));
  beforeEach(inject(function(_$rootScope_, $compile, _Itinerary_) {
    $rootScope = _$rootScope_;
    Itinerary = _Itinerary_;
    element = $compile("<itinerary-container></itinerary-container>")($rootScope);
    $rootScope.$digest();
    componentScope = element.isolateScope().$ctrl;
    sandbox = sinon.sandbox.create();
  }));
  afterEach(function() {
    sandbox.restore();
  });

  it("inits and renders properly", function() {
    var mockItineraryItems = [{a: 1, b: 2}];
    sandbox.stub(Itinerary, "getAllPlaces").returns(mockItineraryItems);
    sandbox.stub(Itinerary, "getMeansOfTransport").returns("jumping");
    componentScope.$onInit();

    expect(componentScope.itineraryItems).toEqual(mockItineraryItems);
    expect(componentScope.transportType).toEqual("jumping");
    expect(componentScope.shareUrl).toEqual(null);
    expect(element[0].querySelectorAll("*").length).toBeGreaterThan(0);
  });

  it("displays share link when requested", function() {
    sandbox.stub(Itinerary, "exportToString").returns("url");

    expect(element[0].querySelectorAll(".itinerary-container__share-input").length).toEqual(0);
    componentScope.createShareUrl();
    $rootScope.$digest();

    expect(element[0].querySelectorAll(".itinerary-container__share-input").length).toEqual(1);
    expect(componentScope.shareUrl).toEqual("url");
  });
  it("persists transport type change", function() {
    var setMeansOfTransport = sandbox.stub(Itinerary, "setMeansOfTransport");

    componentScope.transportType = "skiing";
    componentScope.onTransportTypeUpdated();
    setMeansOfTransport.calledWithExactly("skiing");
  });
  it("persists itinerary place order change, removal", function() {
    var movePlaceUp = sandbox.stub(Itinerary, "movePlaceUp");
    var movePlaceDown = sandbox.stub(Itinerary, "movePlaceDown");
    var removePlace = sandbox.stub(Itinerary, "removePlace");
    var getAllPlaces = sandbox.stub(Itinerary, "getAllPlaces");

    componentScope.movePlaceUp("id1");
    expect(movePlaceUp.calledOnce).toEqual(true);
    expect(movePlaceUp.calledWithExactly("id1")).toEqual(true);
    expect(getAllPlaces.callCount).toEqual(1);

    componentScope.movePlaceDown("id2");
    expect(movePlaceDown.calledOnce).toEqual(true);
    expect(movePlaceDown.calledWithExactly("id2")).toEqual(true);
    expect(getAllPlaces.callCount).toEqual(2);

    componentScope.remove("id3");
    expect(removePlace.calledOnce).toEqual(true);
    expect(removePlace.calledWithExactly("id3")).toEqual(true);
    expect(getAllPlaces.callCount).toEqual(3);
  });
});
