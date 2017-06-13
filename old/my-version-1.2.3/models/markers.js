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
		}
	}

	return factory;
});
