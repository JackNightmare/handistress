app.factory('Marker', function($http, $q, $filter){
	var factory = {
		getAllMarkers : function(){
			deferred = $q.defer();
			
			$http.get('json/allMarkers.json') // Mettre l'api pour tout charger
				.success(function(data, status){
					factory.markers = data;
					deferred.resolve(factory.markers);
				})
				.error(function(data, status){
					deferred.reject('une erreurs lors du chargement des markers');
				});
			return deferred.promise;
		},
		getPlacesMarkers : function(){
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
		getAccessMarkers : function(){
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
		}
	}

	return factory;
});
