/**************************
			*** Version MapquestApi ***
			**************************/
			// leafletData.getMap().then(function(map){
			// 	trace = MQ.routing.directions()
			// 		.on('success', function(data) {
			// 			console.log(data.info.messages);
			// 		})
			// 		.on('error', function(data){
			// 			console.log(data);
			// 		});
			//
			// 		console.log(startPoint[0]['latitude']+"-"+startPoint[0]['longitude']);
			// 		console.log(endPoint[0]['latitude']+"-"+endPoint[0]['longitude']);
			// 	// permet de supprimer un itinéraire si existe déja
			// 	// if(traceRoute){
			// 	// 	map.removeLayer(traceRoute);
			// 	// }
			//
			// 	// Permet d'informer les points de départs trajet
			// 	trace.route({
			// 		locations: [
			// 			{ latLng: { lat: parseFloat(startPoint[0]['latitude']), lng: parseFloat(startPoint[0]['longitude']) } },
			// 			{ latLng: { lat: parseFloat(endPoint[0]['latitude']), lng: parseFloat(endPoint[0]['longitude']) } }
			// 		],
			// 		options: {
			// 			routeType: 'pedestrian',
			// 			locale: 'fr_FR'
			// 		}
			// 	});
			//
			// 	// On ajoute les valeurs
			// 	traceRoute = MQ.routing.routeLayer({
			// 		directions: trace,
			// 		fitBounds: true,
			// 		zoom: 2,
			// 	});
			//
			// 	// On ajoute à la carte les informations de l'itinéraire
			// 	map.addLayer(traceRoute);
			// });





// Version ORSM

// map.fitBounds([
				// 	[parseFloat(startPoint[0]['latitude']), parseFloat(startPoint[0]['longitude'])],
				// 	[parseFloat(endPoint[0]['latitude']), parseFloat(endPoint[0]['longitude'])]
				// ]);