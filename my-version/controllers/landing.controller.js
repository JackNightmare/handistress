app.controller('landingController', function($scope, $location, $anchorScroll){
  $scope.scrollSection = function(idSection){
     $location.hash(idSection);
     $anchorScroll();
  }
});