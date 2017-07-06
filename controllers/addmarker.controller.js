app.controller('addmarkerController', function($scope, $http, $rootScope, $geolocation){
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
  $scope.step = 1; // Par defaut, nous sommes à l'étape numéro 1
  $scope.valuePreviousStep = false;
  $scope.valueNextStep = true;
  $scope.sendForm = false;


  /** Variable pour envoie ajout de marker **/
  $scope.markerAccess = {
    type : 2,
    access : "null",
    entitled : '',
    description: ''
  }
  $scope.markerPlace = {
    type : 1,
    place: "null",
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
  
  $scope.subwayLines = [{value: ''}];
  
  $scope.addSL = function () {
	  $scope.subwayLines.push({value: ''});
  };
  
  $scope.removeSL = function (index) {
	  $scope.subwayLines.splice(index, 1);
  };
  
	$scope.listAccess == [];
  
	$http({
		method: 'GET',
		url: 'https://www.api.benpedia.com/handistress/access/get.php',
		headers: {
			'Content-Type': undefined
		}
    }).then(function successCallback(response) {
		// console.log(response);
		
		$scope.listAccess = response.data;
	}, function errorCallback(response) {
		console.log(response);
	});

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
  *** Liste de droite ***
  *****************************************************/
  $scope.markersProx = [];
  
  $geolocation.getCurrentPosition().then(function(location) {
      var lat = location.coords.latitude;
      var lng = location.coords.longitude;

      var data = {
			lat: lat,
			lng: lng,
			rayon: 0.005,
			includePlaces: [1,2,3,4,5,6,7,8,9,10,11],
			excludePlaces: []
		};
		
		$http({
				method: 'POST',
				url: 'https://www.api.benpedia.com/handistress/markers/getInZone.php',
				headers: {
					'Content-Type': undefined
				},
				data: data
			}).then(function successCallback(response) {
				$scope.markersProx = response.data;
			}, function errorCallback(response) {
				console.log('une erreurs lors du chargement des markers');
			});
    });
  
  /*****************************************************
  *** Edition marker ***
  *****************************************************/
  
  $scope.openMarker = function (id) {
	  console.log(id);
  };
  
  /*****************************************************
  *** Envoie des formulaire pour ajouter des markers ***
  *****************************************************/
  // Ajout d'un marker de type accès
  $scope.addAccess = function(){	  
    var data = angular.copy($scope.markerAccess);

    data.token = $rootScope.readCookie('handistress_token_connection');

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
	  for (var i=0; i<$scope.subwayLines.length; i++) {
		if (i == 0)
			$scope.markerPlace.complements.subwayLine = $scope.subwayLines[i].value + '';
		else
			$scope.markerPlace.complements.subwayLine = $scope.markerPlace.complements.subwayLine + '**' + $scope.subwayLines[i].value;
	  }
	  
    var data = angular.copy($scope.markerPlace);
	console.log(data);
    data.token = $rootScope.readCookie('handistress_token_connection');

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
