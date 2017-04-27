app.factory('Marker', function($http, $q, $filter){
	var deferred = $q.defer();

	var factory = {
		markers : false,
		getMarkers : function(){
			$http.get('json/markers.json')
				.success(function(data, status){
					factory.markers = data;
					deferred.resolve(factory.markers);
				})
				.error(function(data, status){
					deferred.reject('un erreur mon con !');
				});
			return deferred.promise;
		}
	}

	return factory;
});