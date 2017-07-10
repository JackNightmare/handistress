app.controller('addmarkerController', function($scope, $http, $rootScope, $geolocation){
  // Permet d'afficher ou pas le bouton d'inscription et corriger couleur de la connexion
  $scope.boutonInscription = true;
  $scope.colorSignIn = true;

  /**********************************************
  *** Varibales globales pour ajout de marker ***
  **********************************************/
  /** Variable pour add / edit **/
  $scope.addOrEdit = 'add';
  $scope.idToEdit = null;
  
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
  
  $scope.listExits = [{number: '', address: '', handicap: false}];
  
  $scope.addLE = function () {
	  $scope.listExits.push({number: '', address: '', handicap: false});
  };
  
  $scope.removeLE = function (index) {
	  $scope.listExits.splice(index, 1);
  };
  
	$scope.listAccess = [];
  
	$http({
		method: 'GET',
		url: 'https://www.api.benpedia.com/handistress/access/get.php',
		headers: {
			'Content-Type': undefined
		}
    }).then(function successCallback(response) {
		for (var i=0; i<response.data.length; i++) {
			$scope.listAccess.push({id: response.data[i].id, entitled: response.data[i].entitled, checked: false});
		}
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
	$scope.addOrEdit = 'edit';
	$scope.step = 1;
	$scope.valuePreviousStep = false;
	$scope.valueNextStep = true;
	$scope.sendForm = false;
	  
	$scope.idToEdit = id;
	  
	  var data = {
		  id: id
	  };
	  
	  $http({
			method: 'POST',
			url: 'https://www.api.benpedia.com/handistress/markers/getById.php',
			headers: {
				'Content-Type': undefined
			},
			data: data
		}).then(function successCallback(response) {
			console.log(response.data);
			
			var data = response.data;
			
			if (data.idPlace == 1) {
				$scope.formAccess = true;
				$scope.formPlace = false;
				
				$scope.markerAccess = {
					type : 2,
					access : data.access[0].idAccess,
					entitled : data.nameMarker,
					description: data.descriptionMarker
				}
			} else {
				$scope.formAccess = false;
				$scope.formPlace = true;
				
				$scope.markerPlace = {
					type : 1,
					place: data.idPlace,
					entitled : data.nameMarker,
					description: data.descriptionMarker,
					access: [],
					complements: {
					  accessEnterExit: data.accessEnterExit,
					  toiletAdapt: (data.toiletAdapt == "1") ? true : false,
					  equipmentAdapt: (data.equipmentAdapt == "1") ? true : false,
					  handicapGantry: (data.handicapGantry == "1") ? true : false,
					  exitNumber: '',
					  informationOffice: (data.informationOffice == "1") ? true : false,
					  subwayLine: ''
					}
				}

				var splitedSubwayLine = data.subwayLine.split(' ** ');
				
				if (splitedSubwayLine.length == 0) {
					$scope.subwayLines = [{value: ''}];
				} else {
					$scope.subwayLines = [];
					for (var i=0; i<splitedSubwayLine.length; i++) {
						$scope.subwayLines.push({value: splitedSubwayLine[i]});
					}
				}
				
				var splitedExitNumber = data.exitNumber.split(';');
				
				if (splitedExitNumber.length == 0) {
					$scope.listExits = [{number: '', address: '', handicap: false}];
				} else {
					$scope.listExits = [];
					for (var i=0; i<splitedExitNumber.length; i++) {
						var exit = splitedExitNumber[i].split(' ** ');
						
						$scope.listExits.push({number: exit[0], address: exit[1], handicap: (exit[4] == "true") ? true : false});
					}
				}
				
				for (var i=0; i<$scope.listAccess.length; i++) {
					for (var j=0; j<data.access.length; j++) {
						if ($scope.listAccess[i].id == data.access[j].idAccess)
							$scope.listAccess[i].checked = true;
					}
				}
			}
		}, function errorCallback(response) {
			console.log('une erreurs lors du chargement des markers');
		});
  };
  
  $scope.cancelEdit = function () {
	  $scope.addOrEdit = 'add';
	  $scope.idToEdit = null;
  
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
	  
	  $scope.listExits = [{number: '', address: '', handicap: false}];
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
			$scope.markerPlace.complements.subwayLine = $scope.markerPlace.complements.subwayLine + ' ** ' + $scope.subwayLines[i].value;
	  }

	$scope.markerPlace.access = [];
	
	for (var i=0; i<$scope.listAccess.length; i++) {
		if ($scope.listAccess[i].checked)
			$scope.markerPlace.access.push($scope.listAccess[i].id);
	}	
	  
    var data = angular.copy($scope.markerPlace);
	
    data.token = $rootScope.readCookie('handistress_token_connection');

    $geolocation.getCurrentPosition().then(function(location) {
      data.lat = location.coords.latitude;
      data.lng = location.coords.longitude;
	  
	  for (var i=0; i<$scope.listExits.length; i++) {
		if (i == 0)
			$scope.markerPlace.complements.exitNumber = $scope.listExits[i].number + ' ** ' + $scope.listExits[i].address + ' ** ' + data.lat + ' ** ' + data.lng + ' ** ' + $scope.listExits[i].handicap;
		else
			$scope.markerPlace.complements.exitNumber = $scope.markerPlace.complements.exitNumber + ';' + $scope.listExits[i].number + ' ** ' + $scope.listExits[i].address + ' ** ' + data.lat + ' ** ' + data.lng + ' ** ' + $scope.listExits[i].handicap;
	  }
	  
	  data.complements.exitNumber = angular.copy($scope.markerPlace.complements.exitNumber);
	  
	  if ($scope.addOrEdit == 'add') {
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
	  } else if ($scope.addOrEdit == 'edit') {
		  data.id = angular.copy($scope.idToEdit);
		  $http({
			method: 'POST',
			url: 'https://www.api.benpedia.com/handistress/markers/edit.php',
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
  }
});
