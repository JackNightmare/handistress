app.factory('Marker', function($http, $q, $filter){
	var deferred = $q.defer();

	var factory = {
		markers : false,
		getAllMarkers : function(){
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
			factory.markers = {};
			console.log(factory.markers);
			$http.get('json/placesMarkers.json') // Mettre l'api pour tout charger
				.success(function(data, status){
					console.log('la data');
					console.log(data);
					factory.markers = data;
					deferred.resolve(factory.markers);
				})
				.error(function(data, status){
					deferred.reject('une erreurs lors du chargement des markers');
				});
			return deferred.promise;
		},
		getAccessMarkers : function(){
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
