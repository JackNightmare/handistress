app.controller('headerController', function($scope, $rootScope, $http){
	
	/****************************************
	*** Variables globales pour le Header ***
	****************************************/
	$scope.activeFilter = false;
	$scope.responsiveMenuOpen = false;

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
	
	$scope.login = {
		email: '',
		pwd: ''
	};
	
	$scope.signIn = function () {
		var data = {
			email: $scope.login.email,
			pwd: $scope.login.pwd
		};
		
		$http({
			  method: 'POST',
					url: 'https://www.api.benpedia.com/handistress/users/connection.php',
					headers: {
					  'Content-Type': undefined
					},
					data: data
			}).then(function successCallback(response) {
				if (response.data.code == 200) {
					$rootScope.connectionUser(response.data.token, response.data.data);
					$scope.activeFilter = false;
				} else {
					
				}
			}, function errorCallback(response) {
				console.log(response);
			});
	};


	/**********************************************
	*** Fonction pour ouvrir le menu responsive ***
	**********************************************/
	$scope.openMenuResponsive = function(){
		/** ferme le menu classique obligatoire **/
		$scope.openMenu = false;
		$scope.closeMenu = true;

		$scope.responsiveMenuOpen = $scope.responsiveMenuOpen == false ? true : false ;
	}
});
