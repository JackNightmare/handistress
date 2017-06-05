app.controller('landingController', function($scope, $location, $anchorScroll){

  // Permet d'afficher ou pas le bouton d'inscription
  $scope.boutonInscription = true;

  $scope.scrollSection = function(idSection){
     $location.hash(idSection);
     $anchorScroll();
  }
});
