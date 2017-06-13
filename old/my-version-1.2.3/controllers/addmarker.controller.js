app.controller('addmarkerController', function($scope, $http){
  // Permet d'afficher ou pas le bouton d'inscription et corriger couleur de la connexion
  $scope.boutonInscription = true;
  $scope.colorSignIn = true;

  /**********************************************
  *** Varibales globales pour ajout de marker ***
  **********************************************/
  /** Variable pour affichage des formulaires **/
  $scope.formAccess = false;
  $scope.formPlace = true; // Par defaut, le formulaire d'ajout lieu sera visible

  /** Variable pour gestion des étapes **/
  $scope.step = 1; // Ppar defaut, nous sommes à l'étape numéro 1
  $scope.valuePreviousStep = false;
  $scope.valueNextStep = true;
  $scope.sendForm = false;


  /** Variable pour envoie ajout de marker **/
  $scope.markerAccess = {
    type : 2,
    access : null,
    entitled : '',
    description: ''
  }
  $scope.markerPlace = {
    type : 1,
    place: null,
    entitled: '',
    description: '',
    access: [],
    complements: {
      accessEnterExit: '',
      toiletAdapt: false,
      equipmentAdapt: false,
      handicapGantry: false,
      exitNumber: '',
      informationOffice: false,
      subwayLine: ''
    }
  }

  /********************************
  *** Actions sur le formulaire ***
  ********************************/
  // Permet d'afficher le formulaire de lieu
  $scope.seePlaceForm = function(){
    $scope.formAccess = false; // false car ne doit pas être afficher
    $scope.formPlace = true; // true car doit être afficher
  }

  // Permet d'afficher le formulaire d'accès
  $scope.seeAccessForm = function(){
    $scope.formAccess = true; // true car doit être afficher
    $scope.formPlace = false; // false car ne doit pas être afficher
  }

  // Permet d'accéder aux étapes de l'ajout de lieu
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



  /*****************************************************
  *** Envoie des formulaire pour ajouter des markers ***
  *****************************************************/
  // Ajout d'un marker de type accès
  $scope.addAccess = function(){
    var data = angular.copy($scope.markerAccess);

    // Bousin pour geolocalisation

    data.lat = 48.60;
    data.lng = 2.60;

    $http({
      method: 'POST',
			url: 'https://www.api.benpedia.com/handistress/markers/add.php',
			headers: {
			  'Content-Type': undefined
			},
			data: data
    }).then(function successCallback(response) {
			console.log(response);
		}, function errorCallback(response) {
			console.log(response);
		});
  }

  // Ajout d'un marker de type lieu
  $scope.addPlace = function(){
    var data = angular.copy($scope.markerPlace);

    data.lat = 48.54;
    data.lng = 2.54;

    $http({
      method: 'POST',
			url: 'https://www.api.benpedia.com/handistress/markers/add.php',
			headers: {
			  'Content-Type': undefined
			},
			data: data
    }).then(function successCallback(response) {
			console.log(response);
		}, function errorCallback(response) {
			console.log(response);
		});
  }
});
