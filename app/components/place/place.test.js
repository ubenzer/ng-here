"use strict";

describe("placeDirective", function() {
  var $rootScope, element;

  beforeEach(module("app.component.place"));
  beforeEach(module("templates"));
  beforeEach(inject(function(_$rootScope_, $compile) {
    $rootScope = _$rootScope_;
    $rootScope.place = {
      title: "Bundestag",
      category: "Government Building",
      vicinityHtml: "Berlin<br>Germany"
    };
    element = $compile("<place place='place'></place>")($rootScope);
    $rootScope.$digest();
  }));

  it("renders repository properly", function() {
    expect(element[0].querySelectorAll("*").length).toBeGreaterThan(0);
    expect(element[0].querySelector(".place__title").textContent).toEqual("Bundestag");
    expect(element[0].querySelector(".place__category").textContent).toEqual("Government Building");
    expect(element[0].querySelector(".place__vicinity").innerHTML).toEqual("Berlin<br>Germany");
  });
});
