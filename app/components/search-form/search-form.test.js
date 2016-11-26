"use strict";

describe("searchFormDirective", function() {
  var $rootScope, element, componentScope;

  beforeEach(module("app.component.searchForm"));
  beforeEach(module("templates"));
  beforeEach(inject(function(_$rootScope_, $compile) {
    $rootScope = _$rootScope_;
    element = $compile("<search-form on-submit='changed(keyword)'></search-form>")($rootScope);
    $rootScope.$digest();
    componentScope = element.isolateScope().$ctrl;
  }));

  it("renders properly", function() {
    expect(element[0].querySelectorAll("*").length).toBeGreaterThan(0);
  });

  it("notifies outer world search submission via onSubmit binding", function(done) {
    componentScope.$onInit();
    expect(componentScope.keyword).toEqual("");

    $rootScope.changed = function(keyword) {
      expect(keyword).toEqual("Alexanderplatz");
      done();
    };
    componentScope.keyword = "Alexanderplatz";
    componentScope.onSearch();
    $rootScope.$digest();
  });
});
