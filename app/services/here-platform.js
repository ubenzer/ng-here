"use strict";

angular.module("app.service.herePlatform", [])
  .constant("HerePlatformConfig", {
    app_id: "b9KGcnHlsfTdUyyG0Am1",
    app_code: "AnuyLyt-fa4hnfLoz_Ltzw",
    useHTTPS: true
  })
  .factory("HerePlatform", ["$window", "HerePlatformConfig", function($window, HerePlatformConfig) {
    return new $window.H.service.Platform(HerePlatformConfig);
  }]);
