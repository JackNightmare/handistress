app.factory('Marker', function($http, $q, $filter){
	var factory = {
		getAllMarkers : function(lat, lng, rayon){
			deferred = $q.defer();
			
			// $http.get('json/allMarkers.json') // Mettre l'api pour tout charger
				// .success(function(data, status){
					// factory.markers = data;
					// deferred.resolve(factory.markers);
				// })
				// .error(function(data, status){
					// deferred.reject('une erreurs lors du chargement des markers');
				// });
			
			var data = {
				lat: lat,
				lng: lng,
				rayon: rayon,
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
					factory.markers = response.data;
					deferred.resolve(factory.markers);
				}, function errorCallback(response) {
					deferred.reject('une erreurs lors du chargement des markers');
				});
			
			return deferred.promise;
		},
		getPlacesMarkers : function(lat, lng, rayon){
			deferred = $q.defer();
			
			// $http.get('json/placesMarkers.json') // Mettre l'api pour tout charger
				// .success(function(data, status){
					// factory.markers = data;
					// deferred.resolve(factory.markers);
				// })
				// .error(function(data, status){
					// deferred.reject('une erreurs lors du chargement des markers');
				// });
				
			var data = {
				lat: lat,
				lng: lng,
				rayon: rayon,
				includePlaces: [2,3,4,5,6,7,8,9,10,11],
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
					factory.markers = response.data;
					deferred.resolve(factory.markers);
				}, function errorCallback(response) {
					deferred.reject('une erreurs lors du chargement des markers');
				});
			
			return deferred.promise;
		},
		getAccessMarkers : function(lat, lng, rayon){
			deferred = $q.defer();

			// $http.get('json/accessMarkers.json') // Mettre l'api pour tout charger
				// .success(function(data, status){
					// factory.markers = data;
					// deferred.resolve(factory.markers);
				// })
				// .error(function(data, status){
					// deferred.reject('une erreurs lors du chargement des markers');
				// });
			
			var data = {
				lat: lat,
				lng: lng,
				rayon: rayon,
				includePlaces: [1],
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
					factory.markers = response.data;
					deferred.resolve(factory.markers);
				}, function errorCallback(response) {
					deferred.reject('une erreurs lors du chargement des markers');
				});
			
			return deferred.promise;
		},
		searchMarkers : function(theSearch){
			deferred = $q.defer();
			$http.get('json/allMarkers.json') // Mettre l'api pour tout charger
				.success(function(data, status){
					searchReturn = [];
					for(key in data){
						if(data[key]['infoSearch'].search(theSearch) != '-1'){
							searchReturn.push(data[key]);
						}
					}
					factory.markers = searchReturn;
					deferred.resolve(factory.markers);
				})
				.error(function(data, status){
					deferred.reject('une erreurs lors du chargement des markers');
				});
			return deferred.promise;
		},
		getTypePlace : function(theTypePlace){
			/** On recupere la valeur qui correspond à l'id **/
			console.log(theTypePlace);
			deferred = $q.defer();
			$http.get('json/placesMarkers.json') // Mettre l'api pour tout charger
				.success(function(data, status){
					factory.markers = data;
					deferred.resolve(factory.markers);
				})
				.error(function(data, status){
					deferred.reject('une erreurs lors du chargement des markers');
				});
			return deferred.promise;
		},
		getTypeAccess : function(theTypeAccess){
			/** On recupere la valeur qui correspond à l'id **/
			console.log(theTypeAccess);
			deferred = $q.defer();
			$http.get('json/accessMarkers.json') // Mettre l'api pour tout charger
				.success(function(data, status){
					factory.markers = data;
					deferred.resolve(factory.markers);
				})
				.error(function(data, status){
					deferred.reject('une erreurs lors du chargement des markers');
				});
			return deferred.promise;
		},
		searchForbiddenAccess : function(type){
			deferred = $q.defer();
			$http.get('json/forbiddenAccess.json') // Mettre l'api pour tout charger
				.success(function(data, status){
					infoReturn = [];
					allType = type.split(",");
					
					for(key in data){
						for(keyType in allType){
							if(data[key]['type'].search(allType[keyType]) != '-1'){
								infoReturn.push(data[key]);
							}
						}
					}
					factory.markers = infoReturn;
					deferred.resolve(factory.markers);
				})
				.error(function(data, status){
					deferred.reject('une erreurs lors du chargement des markers');
				});
			return deferred.promise;
		}
	}

	return factory;
});
