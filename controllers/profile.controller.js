app.controller('profileController', function($scope, $rootScope, $http, $window, $timeout){

	// Permet d'afficher ou pas le bouton d'inscription
	$scope.boutonInscription = false;
	$scope.colorSignIn = true;

	// Permet d'afficher le menu responsive
	$scope.menuResponsive = true;



  /******************************************

  *** Varibales globales pour inscription ***

  ******************************************/

  /** variables pour affichage du formulaire **/

  $scope.step = 1; // L'étape du formulaire par defaut et 1

  $scope.valuePreviousStep = false; // Pat defaut, il n'y a pas d'étape précédente

  $scope.userHandicap = ($rootScope.userData.handicap == "0") ? false : true;

  $scope.valueNextStep = ($rootScope.userData.handicap == "0") ? false : true;

  $scope.sendForm = ($rootScope.userData.handicap == "0") ? true : false;



  /** variables pour enregistrement d'un user **/

  $scope.register = {

    firstname : $rootScope.userData.firstname,

    lastname : $rootScope.userData.lastname,

    email : $rootScope.userData.email,

    pwd : '',

    pwd2 : '',

    birthDate : $rootScope.userData.birthDate,

    handicap : ($rootScope.userData.handicap == "0") ? "non" : "oui",

    accessStairs: ($rootScope.userData.accessStairs == "1") ? true : false,

  	accessEscalator: ($rootScope.userData.accessEscalator == "1") ? true : false,

  	accessFlatEscalator: ($rootScope.userData.accessFlatEscalator == "1") ? true : false,

  	accessRamp: ($rootScope.userData.accessRamp == "1") ? true : false,

  	accessElevator: ($rootScope.userData.accessElevator == "1") ? true : false,

  	accessPavement: ($rootScope.userData.accessPavement == "1") ? true : false,

  	accessHightPavement: ($rootScope.userData.accessHightPavement == "1") ? true : false,

    equipments: []

  }



  $scope.equipments = {

    crutch : false,

    manualWheelchair : false,

    electricWheelchair : false,

    cane : false,

    walker : false

  }

  

  for (var i=0; i<$rootScope.userData.equipments.length; i++) {

	  if ($rootScope.userData.equipments[i].idEquipment == 1) $scope.equipments.crutch = true;

	  if ($rootScope.userData.equipments[i].idEquipment == 2) $scope.equipments.manualWheelchair = true;

	  if ($rootScope.userData.equipments[i].idEquipment == 3) $scope.equipments.electricWheelchair = true;

	  if ($rootScope.userData.equipments[i].idEquipment == 4) $scope.equipments.cane = true;

	  if ($rootScope.userData.equipments[i].idEquipment == 5) $scope.equipments.walker = true;

  }



  $scope.empty = {

	  firstname: false,

	  lastname: false,

	  pwd: false,

	  pwd2: false

  };

  /***************************

  *** Envoie du formulaire ***

  ***************************/

  $scope.edit = function(){

	  if ($scope.step == 1 && ($scope.register.firstname == '' || $scope.register.lastname == '' || $scope.register.pwd == '' || $scope.register.pwd2 == '' || $scope.register.firstname == undefined || $scope.register.lastname == undefined || $scope.register.pwd == undefined || $scope.register.pwd2 == undefined)) {

		if ($scope.register.firstname == '' || $scope.register.firstname == undefined) {

			$scope.empty.firstname = true;

			

			$timeout( function () {

				$scope.empty.firstname = false;

			}, 2000);

		}

		

		if ($scope.register.lastname == '' || $scope.register.lastname == undefined) {

			$scope.empty.lastname = true;

			

			$timeout( function () {

				$scope.empty.lastname = false;

			}, 2000);

		}

		

		if ($scope.register.pwd == '' || $scope.register.pwd == undefined) {

			$scope.empty.pwd = true;

			

			$timeout( function () {

				$scope.empty.pwd = false;

			}, 2000);

		}

		

		if ($scope.register.pwd2 == '' || $scope.register.pwd2 == undefined) {

			$scope.empty.pwd2 = true;

			

			$timeout( function () {

				$scope.empty.pwd2 = false;

			}, 2000);

		}

	  } else {

		if($scope.equipments.crutch) $scope.register.equipments.push(1);

		if($scope.equipments.manualWheelchair) $scope.register.equipments.push(2);

		if($scope.equipments.electricWheelchair) $scope.register.equipments.push(3);

		if($scope.equipments.cane) $scope.register.equipments.push(4);

		if($scope.equipments.walker) $scope.register.equipments.push(5);

		

		var data = angular.copy($scope.register);

		data.id = $rootScope.userData.id;

		data.handicap = (data.handicap == "oui") ? true : false;



		$http({

		  method: 'POST',

				url: 'https://www.api.benpedia.com/handistress/users/edit.php',

				headers: {

				  'Content-Type': undefined

				},

				data: data

		}).then(function successCallback(response) {

			if (response.data.code == 200) {

				$rootScope.connectionUser(response.data.token, response.data.data);

				$window.location.href = '/map';

			} else {}

		}, function errorCallback(response) {

			console.log(response);

		});

	  }

  }



  /*****************************

  *** Controle Handicap User ***

  *****************************/

  $scope.controleUserHandicapTrue = function(){

    $scope.userHandicap = true; // Valeur à true car on peut accéder à l'étapes suivante

    $scope.valueNextStep = true; // Valeur à true car on peut accéder à l'étape suivante

    $scope.sendForm = false; // Valeur à false car l'envoie du formulaire n'est pas possible

  } 

  



  $scope.controleUserHandicapFalse = function() {

    $scope.userHandicap = false; // valeur à false car les étapes suivantes sont inutiles

    $scope.valueNextStep = false; // valeur à false car les étapes suivantes sont inutiles

    $scope.sendForm = true; // Valeur à true car pas besoin des étapes suivantes pour valider le formulaire

  }

  



  /****************************

  *** Next or Previous step ***

  ****************************/

  $scope.nextStep = function(){

	if ($scope.step == 1 && ($scope.register.firstname == '' || $scope.register.lastname == '' || $scope.register.pwd == '' || $scope.register.pwd2 == '' || $scope.register.firstname == undefined || $scope.register.lastname == undefined || $scope.register.pwd == undefined || $scope.register.pwd2 == undefined)) {

		if ($scope.register.firstname == '' || $scope.register.firstname == undefined) {

			$scope.empty.firstname = true;

			

			$timeout( function () {

				$scope.empty.firstname = false;

			}, 2000);

		}

		

		if ($scope.register.lastname == '' || $scope.register.lastname == undefined) {

			$scope.empty.lastname = true;

			

			$timeout( function () {

				$scope.empty.lastname = false;

			}, 2000);

		}

		

		if ($scope.register.pwd == '' || $scope.register.pwd == undefined) {

			$scope.empty.pwd = true;

			

			$timeout( function () {

				$scope.empty.pwd = false;

			}, 2000);

		}

		

		if ($scope.register.pwd2 == '' || $scope.register.pwd2 == undefined) {

			$scope.empty.pwd2 = true;

			

			$timeout( function () {

				$scope.empty.pwd2 = false;

			}, 2000);

		}

	} else {

		$scope.step ++;

		$scope.valuePreviousStep = true; // Possibilité de retourner en arriere

		if($scope.step == 3){

			$scope.valueNextStep = false; // Il n'y a plus d'étape après, on met donc à false

			$scope.sendForm = true; // On peut envoyer le formulaire

		}

    }

  }



  $scope.previousStep = function(){

    $scope.step --;



    // Si etape 1, le previous est forcement à false

    if($scope.step == 1){

      $scope.valuePreviousStep = false;

    }



    // Si on est a l'étape 2

    if($scope.step == 2){

      $scope.valueNextStep = true; // On revient de l'étape 3, donc il faut repasser la valueNextStep à true

      $scope.sendForm = false; // Il est impossible à l'étape 2 d'envoyer le formulaire

    }

  }

});