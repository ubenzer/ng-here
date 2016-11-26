"use strict";

describe("ItineraryService", function() {
  var $window, Itinerary;

  beforeEach(module("app.service.itinerary"));
  beforeEach(inject(function(_$window_, _Itinerary_) {
    $window = _$window_;
    Itinerary = _Itinerary_;
  }));

  describe("export/import", function() {
    it("returns serialized and urlized itinerary data", function() {
      Itinerary.addPlace({id: "1", name: "test"});
      Itinerary.addPlace({id: "2", name: "test2"});
      Itinerary.setMeansOfTransport("moonwalking");
      var data = Itinerary.exportToString();
      expect(data).toContain($window.location.origin);
      expect(data).toContain($window.location.pathname);
      expect(data).toContain("#!/import/");
      var importData = decodeURIComponent(data.split("#!/import/")[1]);

      Itinerary.removePlace("2");
      Itinerary.setMeansOfTransport("portalgun");

      Itinerary.loadFromString(importData);
      expect(Itinerary.getPlaceCount()).toEqual(2);
      expect(Itinerary.getAllPlaces()[1].name).toEqual("test2");
      expect(Itinerary.getMeansOfTransport()).toEqual("moonwalking");
    });
  });

  describe("getAllPlaces", function() {
    it("returns (a copy of) all places in itinerary", function() {
      Itinerary.addPlace({id: "1", name: "test"});
      Itinerary.addPlace({id: "2", name: "test2"});
      var items = Itinerary.getAllPlaces();
      expect(items[0].id).toEqual("1");
      expect(items[0].name).toEqual("test");
    });
  });

  describe("getPlaceCount", function() {
    it("returns count of places in itinerary", function() {
      expect(Itinerary.getPlaceCount()).toEqual(0);
      Itinerary.addPlace({id: "1", name: "test"});
      expect(Itinerary.getPlaceCount()).toEqual(1);
      Itinerary.removePlace("1");
      expect(Itinerary.getPlaceCount()).toEqual(0);
    });
  });

  describe("movePlaceUp", function() {
    it("moves place to one place closer to beginning", function() {
      var places;
      Itinerary.addPlace({id: "1"});
      Itinerary.addPlace({id: "2"});
      Itinerary.addPlace({id: "3"});
      Itinerary.movePlaceUp("1"); // nothing happens as it is already on top

      places = Itinerary.getAllPlaces();
      expect(places[0].id).toEqual("1");

      Itinerary.movePlaceUp("8"); //  nothing happens as 8 is not existent
      places = Itinerary.getAllPlaces();
      expect(places[0].id).toEqual("1");

      Itinerary.movePlaceUp("3");
      places = Itinerary.getAllPlaces();
      expect(places[0].id).toEqual("1");
      expect(places[1].id).toEqual("3");
      expect(places[2].id).toEqual("2");

      Itinerary.movePlaceUp("3");
      places = Itinerary.getAllPlaces();
      expect(places[0].id).toEqual("3");
      expect(places[1].id).toEqual("1");
      expect(places[2].id).toEqual("2");
    });
  });

  describe("movePlaceDown", function() {
    it("moves place to one place closer to end", function() {
      var places;
      Itinerary.addPlace({id: "1"});
      Itinerary.addPlace({id: "2"});
      Itinerary.addPlace({id: "3"});
      Itinerary.movePlaceDown("3"); // nothing happens as it is already on bottom

      places = Itinerary.getAllPlaces();
      expect(places[2].id).toEqual("3");

      Itinerary.movePlaceDown("8"); //  nothing happens as 8 is not existent
      places = Itinerary.getAllPlaces();
      expect(places[2].id).toEqual("3");

      Itinerary.movePlaceDown("1");
      places = Itinerary.getAllPlaces();
      expect(places[0].id).toEqual("2");
      expect(places[1].id).toEqual("1");
      expect(places[2].id).toEqual("3");

      Itinerary.movePlaceDown("1");
      places = Itinerary.getAllPlaces();
      expect(places[0].id).toEqual("2");
      expect(places[1].id).toEqual("3");
      expect(places[2].id).toEqual("1");
    });
  });

  describe("removePlace", function() {
    it("removes a place from itinerary", function() {
      var places;
      Itinerary.addPlace({id: "1"});
      Itinerary.addPlace({id: "2"});
      Itinerary.addPlace({id: "3"});

      expect(Itinerary.getPlaceCount()).toEqual(3);

      Itinerary.removePlace("2");
      expect(Itinerary.getPlaceCount()).toEqual(2);
      places = Itinerary.getAllPlaces();
      expect(places[0].id).toEqual("1");
      expect(places[1].id).toEqual("3");

      Itinerary.removePlace("3");
      expect(Itinerary.getPlaceCount()).toEqual(1);
      places = Itinerary.getAllPlaces();
      expect(places[0].id).toEqual("1");

      Itinerary.removePlace("1");
      expect(Itinerary.getPlaceCount()).toEqual(0);
    });
  });

  describe("addPlace", function() {
    it("adds a place to itinerary", function() {
      expect(Itinerary.getPlaceCount()).toEqual(0);
      Itinerary.addPlace({id: "1"});
      expect(Itinerary.getPlaceCount()).toEqual(1);
    });
  });

  describe("hasPlace", function() {
    it("checks existence of a place by id", function() {
      Itinerary.addPlace({id: "1"});
      expect(Itinerary.hasPlace("WHAT?")).toEqual(false);
      expect(Itinerary.hasPlace("1")).toEqual(true);
    });
  });

  describe("meansOfTransport", function() {
    it("can be changed", function() {
      expect(Itinerary.getMeansOfTransport()).toEqual("car");
      Itinerary.setMeansOfTransport("walking");
      expect(Itinerary.getMeansOfTransport()).toEqual("walking");
    });
  });
});
