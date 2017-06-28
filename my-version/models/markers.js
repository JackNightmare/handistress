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
		}
	}

	return factory;
});
