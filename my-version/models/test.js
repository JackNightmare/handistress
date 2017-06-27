app.factory('Testpourmoi', function($http, $q, $filter){
	// var deferred = $q.defer();
	// var promise = deferred.promise;


	var test = function(apiName){
		deferred = $q.defer();

		$http.get('json/'+apiName+'.json')
			.success(function(data, status){
				deferred.resolve(data);
			})
			.error(function(data, status){
				deferred.reject('une erreurs lors du chargement des markers');
			});

		return deferred.promise;

		// apiList = ['placesMarkers', 'allMarkers'];
		// $q.all(apiList.map(function(item){
		// 	console.log(item);
		// }));
	}
	

	var testPourMoi = function(name){
		deferred = $q.defer();

		if(name){
			deferred.resolve('Je veux voir le nom -> ' + name);
		}
		else{
			deferred.reject('Pas de nom connard !');
		}

		return deferred.promise;
	}

	return {test : test, testPourMoi : testPourMoi};
});
