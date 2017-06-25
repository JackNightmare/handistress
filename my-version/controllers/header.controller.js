app.controller('headerController', function($scope, $rootScope){
	
	/****************************************
	*** Variables globales pour le Header ***
	****************************************/
	$scope.activeFilter = false;


	/*****************************************************
	*** Ici il faut mettre le bousin pour se connecter ***
	*****************************************************/

	/*************************************
	*** Fonction pour fermer le filtre ***
	*************************************/
	$scope.closeFilter = function(){
		$scope.activeFilter = false;
	}

	$scope.openFilter = function(){
		$scope.activeFilter = true;
	}
});
