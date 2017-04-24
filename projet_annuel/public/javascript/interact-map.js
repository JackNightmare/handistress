$(document).ready(function(){
	/** Click sur le menu **/
	$('.map-bouton-menu').on('click', function(){
		$('.map-menu').toggleClass('active');
		$(this).toggleClass('off');
	});

	$('.switch-form').on('click', function(){
		name = $(this).attr('name');
		formActif = '#'+name;
		
		$('.switch-form').removeClass('actif');
		$('form').addClass('hide');

		$(this).toggleClass('actif');
		$(formActif).toggleClass('hide');

	});

	/** click sur le filtre **/
	$('.map-filtrer-button').on('click', function(){
		$('.map-filtrer').toggleClass('active');
	});

	$('.see-filtrer').on('click', function(){
		actifFiltre = $(this).attr('class');
		
		if(actifFiltre == 'see-filtrer active'){
			$(this).removeClass('active')
		}
		else{
			$('.see-filtrer').removeClass('active');
			$(this).addClass('active');
		}
	});
});