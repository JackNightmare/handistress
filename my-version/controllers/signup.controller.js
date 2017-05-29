app.controller('signupController', function($scope, $http){

  $scope.userHandicap = false;
  $scope.sendForm = true;


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
  	accessElevator: false,
  	accessPavement: false,
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
			console.log(response);
		}, function errorCallback(response) {
			console.log(response);
		});
  }

  /*****************************
  *** Controle Handicap User ***
  *****************************/
  $scope.controleUserHandicap = function(){
    if ($scope.userHandicap == false){
      $scope.userHandicap = true;
      $scope.sendForm = false;
    }
    else{
      $scope.userHandicap = false;
      $scope.sendForm = true;
    }
  }
});
