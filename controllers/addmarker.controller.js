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

  /** Variable pour gestion des �tapes **/
  $scope.step = 1; // Ppar defaut, nous sommes � l'�tape num�ro 1
  $scope.valuePreviousStep = false;
  $scope.valueNextStep = true;
  $scope.sendForm = false;


  /** Variable pour envoie ajout de marker **/
  $scope.markerAccess = {
    type : 2,
    access : 1,
    entitled : '',
    description: ''
  }
  $scope.markerPlace = {
    type : 1,
    place: 2,
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
  
	$scope.listAccess == [];
  
	$http({
		method: 'GET',
		url: 'https://www.api.benpedia.com/handistress/access/get.php',
		headers: {
			'Content-Type': undefined
		}
    }).then(function successCallback(response) {
		console.log(response);
		
		$scope.listAccess = response.data;
	}, function errorCallback(response) {
		console.log(response);
	});

  /********************************
  *** Actions sur le formulaire ***
  ********************************/
  // Permet d'afficher le formulaire de lieu
  $scope.seePlaceForm = function(){
    $scope.formAccess = false; // false car ne doit pas �tre afficher
    $scope.formPlace = true; // true car doit �tre afficher
  }

  // Permet d'afficher le formulaire d'acc�s
  $scope.seeAccessForm = function(){
    $scope.formAccess = true; // true car doit �tre afficher
    $scope.formPlace = false; // false car ne doit pas �tre afficher
  }

  // Permet d'acc�der aux �tapes de l'ajout de lieu
  $scope.nextStep = function(){
    $scope.step ++;
    $scope.valuePreviousStep = true; // Possibilit� de retourner en arriere
    if($scope.step == 3){
        $scope.valueNextStep = false; // Il n'y a plus d'�tape apr�s, on met donc � false
        $scope.sendForm = true; // On peut envoyer le formulaire
    }
  }

  $scope.previousStep = function(){
    $scope.step --;

    // Si etape 1, le previous est forcement � false
    if($scope.step == 1){
      $scope.valuePreviousStep = false;
    }

    // Si on est a l'�tape 2
    if($scope.step == 2){
      $scope.valueNextStep = true; // On revient de l'�tape 3, donc il faut repasser la valueNextStep � true
      $scope.sendForm = false; // Il est impossible � l'�tape 2 d'envoyer le formulaire
    }
  }



  /*****************************************************
  *** Envoie des formulaire pour ajouter des markers ***
  *****************************************************/
  // Ajout d'un marker de type acc�s
  $scope.addAccess = function(){
    var data = angular.copy($scope.markerAccess);

    data.token = $rootScope.readCookie('handistress_user');
	
	$geolocation.getCurrentPosition().then(function(location) {
		data.lat = location.coords.latitude;
		data.lng = location.coords.longitude;
		
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
	});
  }

  // Ajout d'un marker de type lieu
  $scope.addPlace = function(){
    var data = angular.copy($scope.markerPlace);

    data.token = $rootScope.readCookie('handistress_user');

    $geolocation.getCurrentPosition().then(function(location) {
		data.lat = location.coords.latitude;
		data.lng = location.coords.longitude;
		
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
	});
  }
});
