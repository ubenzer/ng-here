"use strict";

describe("UserLocationService", function() {
  var $window, $rootScope, UserLocation, sandbox;

  beforeEach(module("app.service.userLocation"));
  beforeEach(inject(function(_$window_, _$rootScope_, _UserLocation_) {
    $window = _$window_;
    $rootScope = _$rootScope_;
    UserLocation = _UserLocation_;
    sandbox = sinon.sandbox.create();
  }));
  afterEach(function() {
    sandbox.restore();
  });

  describe("search", function() {
    it("gets location via HTML5 geolocation in promise", function(done) {
      sandbox.stub($window.navigator.geolocation, "getCurrentPosition",
        function(onPosition) {
          onPosition({
            coords: {
              latitude: 22.12,
              longitude: 44.33
            }
          })
        });

      expect(UserLocation.getLastLocation()).toEqual(null);
      UserLocation.getCurrentLocation()
        .then(function(position) {
          expect(position.latitude).toEqual(22.12);
          expect(position.longitude).toEqual(44.33);
          expect(UserLocation.getLastLocation().latitude).toEqual(22.12);
          done();
        });
      $rootScope.$digest();
    });

    it("returns a failed promise if location is not available", function(done) {
      sandbox.stub($window.navigator.geolocation, "getCurrentPosition",
        function(onPosition, onError) {
          onError();
        });

      UserLocation.getCurrentLocation().catch(done);
      $rootScope.$digest();
    });
  });
});
