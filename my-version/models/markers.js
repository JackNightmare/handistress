app.factory('Marker', function($http, $q, $filter){
	var deferred = $q.defer();

	var factory = {
		markers : false,
		getMarkers : function(){
			$http.get('json/new_markers.json')
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
