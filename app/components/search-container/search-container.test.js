"use strict";

describe("searchContainerDirective", function() {
  var $rootScope, $q, element, componentScope, Places, UserLocation, sandbox;

  beforeEach(module("app.component.searchContainer"));
  beforeEach(module("templates"));
  beforeEach(inject(function(_$rootScope_, $compile, _$q_, _Places_, _UserLocation_) {
    $rootScope = _$rootScope_;
    $q = _$q_;
    Places = _Places_;
    UserLocation = _UserLocation_;
    element = $compile("<search-container></search-container>")($rootScope);
    $rootScope.$digest();
    componentScope = element.isolateScope().$ctrl;
    sandbox = sinon.sandbox.create();
  }));
  afterEach(function() {
    sandbox.restore();
  });

  it("inits and renders properly, complain on location retrieval failure", function() {
    sandbox.stub(UserLocation, "getCurrentLocation").returns($q.reject());

    componentScope.$onInit();

    expect(element[0].querySelectorAll("*").length).toBeGreaterThan(0);
    expect(componentScope.inProgress).toEqual(false);
    expect(componentScope.hasError).toEqual(false);
    expect(componentScope.searchResults).toEqual([]);
    expect(componentScope.hasSearch).toEqual(false);
    expect(componentScope.cantGetLocation).toEqual(false);

    $rootScope.$digest();
    expect(componentScope.cantGetLocation).toEqual(true);
  });

  describe("onSearch", function() {
    it("shows search results on success", function() {
      var deferred = $q.defer();
      var mockLastLocation = {latitude: 12, longitude: 15};
      sinon.stub(UserLocation, "getLastLocation").returns(mockLastLocation);
      var search = sinon.stub(Places, "search").returns(deferred.promise);

      componentScope.onSearch("U-Bahn");

      expect(componentScope.hasSearch).toEqual(true);
      expect(componentScope.inProgress).toEqual(true);
      expect(componentScope.hasError).toEqual(false);

      deferred.resolve(mockSearchResults(3));
      $rootScope.$digest();

      expect(componentScope.searchResults.length).toEqual(3);
      expect(element[0].querySelectorAll("search-result").length).toEqual(3);
      expect(search.calledWithExactly("U-Bahn", {latitude: 12, longitude: 15}));
    });

    it("shows error message on failure (network etc.)", function() {
      sinon.stub(UserLocation, "getLastLocation").returns(null);
      var search = sinon.stub(Places, "search").returns($q.reject());
      componentScope.onSearch("some place");

      $rootScope.$digest();
      expect(componentScope.hasSearch).toEqual(true);
      expect(componentScope.inProgress).toEqual(false);
      expect(componentScope.hasError).toEqual(true);
    });

    it("ignores old search queries if user manages to do rapid queries", function() {
      var searchNumber = 0;
      var firstSearchDefer = $q.defer();
      var secondSearchDefer = $q.defer();
      sinon.stub(UserLocation, "getLastLocation").returns(null);
      var search = sinon.stub(Places, "search", function() {
        searchNumber++;
        return searchNumber === 1 ? firstSearchDefer.promise : secondSearchDefer.promise;
      });

      componentScope.onSearch("search 1");
      // search 2 starts before search 1 ends
      componentScope.onSearch("search 2");

      expect(componentScope.inProgress).toEqual(true);
      firstSearchDefer.resolve(mockSearchResults(1));
      $rootScope.$digest();

      // search 1 completed but we don't care
      expect(componentScope.inProgress).toEqual(true);

      secondSearchDefer.resolve(mockSearchResults(5));
      $rootScope.$digest();
      expect(componentScope.inProgress).toEqual(false);
      expect(componentScope.searchResults.length).toEqual(5);
    });
  });

  function mockSearchResults(howMany) {
    var results = [];
    for (var i = 0; i < howMany; i++) {
      results.push({id: "id " + i, title: "title" + i});
    }
    return results;
  }
});
