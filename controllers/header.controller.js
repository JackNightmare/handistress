app.controller('headerController', function($scope, $rootScope, $http, $timeout){
	
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
	
	$scope.empty = {
		  email: false,
		  pwd: false
	  };
	
	$scope.showMessageConnectionError = false;
	
	$scope.signIn = function () {
		if ($scope.login.email == '' || $scope.login.pwd == '' || $scope.login.email == undefined || $scope.login.pwd == undefined) {
			if ($scope.login.email == '' || $scope.login.email == undefined) {
				$scope.empty.email = true;
				
				$timeout( function () {
					$scope.empty.email = false;
				}, 2000);
			}
			
			if ($scope.login.pwd == '' || $scope.login.pwd == undefined) {
				$scope.empty.pwd = true;
				
				$timeout( function () {
					$scope.empty.pwd = false;
				}, 2000);
			}
		} else {
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
						$scope.showMessageConnectionError = true;
						$scope.messageConnectionError = response.data.error;
						
						$timeout( function () {
							$scope.showMessageConnectionError = false;
							$scope.messageConnectionError = '';
						}, 2000);
					}
				}, function errorCallback(response) {
					console.log(response);
				});
		}
	};

	/**********************************************
	*** Fonction pour ouvrir le menu responsive ***
	**********************************************/
	$scope.openMenuResponsive = function(){
		$scope.responsiveMenuOpen = $scope.responsiveMenuOpen == false ? true : false ;
	}
});
