app.controller('addmarkerController', function($scope, $http){

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
