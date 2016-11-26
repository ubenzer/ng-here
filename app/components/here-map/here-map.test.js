"use strict";

describe("hereMapDirective", function() {
  var $rootScope, $compile, $window, element, HerePlatform, sandbox;

  beforeEach(module("app.component.hereMap"));
  beforeEach(inject(function(_$rootScope_, _$compile_, _$window_, _HerePlatform_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $window = _$window_;
    HerePlatform = _HerePlatform_;
    sandbox = sinon.sandbox.create();
  }));
  afterEach(function() {
    sandbox.restore();
  });

  it("renders properly", function() {
    var mockDefaultLayers = {normal: {map: "defaultlayers"}};
    var mockMap = {
      addObjects: sinon.spy(),
      setViewBounds: sinon.spy()
    };
    var mockMapEvent = {
      a: 1
    };
    var mockStrip = {
      pushLatLngAlt: sinon.spy()
    };
    var mockPolyline = {
      getBounds: function() { return "##bounds##"; }
    };
    var mockMarker = {
      b: 1
    };

    var createDefaultLayers = sandbox.stub(HerePlatform, "createDefaultLayers").returns(mockDefaultLayers);
    var MapEvents = sandbox.stub($window.H.mapevents, "MapEvents").returns(mockMapEvent);
    var Map = sandbox.stub($window.H, "Map").returns(mockMap);
    var Behavior = sandbox.stub($window.H.mapevents, "Behavior");
    var Strip = sandbox.stub($window.H.geo, "Strip").returns(mockStrip);
    var Polyline = sandbox.stub($window.H.map, "Polyline").returns(mockPolyline);
    var Marker = sandbox.stub($window.H.map, "Marker").returns(mockMarker);

    compile(getMockRouteObj());

    // draw map
    expect(createDefaultLayers.calledOnce).toEqual(true);
    expect(Map.calledOnce).toEqual(true);
    expect(Map.calledWithExactly(element[0], "defaultlayers")).toEqual(true);
    expect(MapEvents.calledOnce).toEqual(true);
    expect(MapEvents.calledWithExactly(mockMap)).toEqual(true);
    expect(Behavior.calledOnce).toEqual(true);
    expect(Behavior.calledWithExactly(mockMapEvent)).toEqual(true);

    // draw route
    expect(Strip.calledOnce).toEqual(true);
    expect(mockStrip.pushLatLngAlt.calledWith("12", "51")).toEqual(true);
    expect(Polyline.calledOnce).toEqual(true);
    expect(Polyline.calledWith(mockStrip)).toEqual(true);
    expect(Marker.calledOnce).toEqual(true);
    expect(Marker.calledWithExactly({lat: 13, lng: 45})).toEqual(true);
    expect(mockMap.addObjects.calledOnce).toEqual(true);
    expect(mockMap.addObjects.calledWithExactly([mockPolyline, mockMarker])).toEqual(true);
    expect(mockMap.setViewBounds.calledOnce).toEqual(true);
    expect(mockMap.setViewBounds.calledWithExactly("##bounds##")).toEqual(true);
  });

  function compile(routeObj) {
    $rootScope.routeObj = routeObj;
    element = $compile("<here-map route='routeObj'></here-map>")($rootScope);
    $rootScope.$digest();
  }

  function getMockRouteObj() {
    return {
      shape: ["12,51"],
      waypoint: [
        {
          mappedPosition: {
            latitude: 13,
            longitude: 45
          }
        }
      ]
    };
  }
});
