app.controller('landingController', function($scope, $location, $anchorScroll){

	// Permet d'afficher ou pas le bouton d'inscription
	$scope.boutonInscription = true;

	// Permet d'afficher le menu responsive
	$scope.menuResponsive = false;

	$scope.scrollSection = function(idSection){
		$location.hash(idSection);
		$anchorScroll();
	}
});

