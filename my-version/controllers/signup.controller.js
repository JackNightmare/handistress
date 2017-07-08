app.controller('signupController', function($scope, $rootScope, $http){
  // Permet d'afficher ou pas le bouton d'inscription
  $scope.boutonInscription = false;
  $scope.colorSignIn = true;

  /******************************************
  *** Varibales globales pour inscription ***
  ******************************************/
  /** variables pour affichage du formulaire **/
  $scope.step = 1; // L'étape du formulaire par defaut et 1
  $scope.valuePreviousStep = false; // Pat defaut, il n'y a pas d'étape précédente
  $scope.userHandicap = false; // On lui dit que l'utilisateur est considerer non handicapé par defaut
  $scope.valueNextStep = false; // Par defaut, on lui dit qu'il n'y a pas d'étape suivante
  $scope.sendForm = true; // Par defaut, on peut envoyer le formulaire

  /** variables pour enregistrement d'un user **/
  $scope.register = {
    firstname : '',
    lastname : '',
    email : '',
    pwd : '',
    pwd2 : '',
    birthDate : new Date(),
    handicap : "non",
    accessStairs: false,
  	accessEscalator: false,
  	accessFlatEscalator: false,
  	accessRamp: false,
  	accessElevator: false,
  	accessPavement: false,
  	accessHightPavement: false,
    equipments: []
  }

  $scope.equipments = {
    crutch : false,
    manualWheelchair : false,
    electricWheelchair : false,
    cane : false,
    walker : false
  }

  /***************************
  *** Envoie du formulaire ***
  ***************************/
  $scope.signUp = function(){
    var data = angular.copy($scope.register);
    data.handicap = (data.handicap == "oui") ? true : false;

    if($scope.equipments.crutch) $scope.register.equipments.push(1);
    if($scope.equipments.manualWheelchair) $scope.register.equipments.push(2);
    if($scope.equipments.electricWheelchair) $scope.register.equipments.push(3);
    if($scope.equipments.cane) $scope.register.equipments.push(4);
    if($scope.equipments.walker) $scope.register.equipments.push(5);

    $http({
      method: 'POST',
			url: 'https://www.api.benpedia.com/handistress/users/register.php',
			headers: {
			  'Content-Type': undefined
			},
			data: data
    }).then(function successCallback(response) {
		if (response.data.code == 200) {
			$rootScope.connectionUser(response.data.token, response.data.data);
		} else {}
	}, function errorCallback(response) {
		console.log(response);
	});
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
    $scope.step ++;
    $scope.valuePreviousStep = true; // Possibilité de retourner en arriere
    if($scope.step == 3){
        $scope.valueNextStep = false; // Il n'y a plus d'étape après, on met donc à false
        $scope.sendForm = true; // On peut envoyer le formulaire
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


  /*
  *** test ***
  */

});
