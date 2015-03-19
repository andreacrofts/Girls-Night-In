/* NOTES
==================================================*/

// LCBO API: 'MDoxZmUyNWFhYS1jZTYyLTExZTQtOWY1ZC01ZmJiNzc5YmZkMmY6YkpVeDJndnNKN2VRUDhGMHlwR1N1VWM2blE2SzBOS2Q4WkFZ'
// RATE LIMIT IS 1200/Hour


/* GLOBAL VARIABLES
==================================================*/

var wineApp = {};


/* COLLECTING INFORMATION
==================================================*/

	wineApp.collectInfo = function() {
		$('form').on('submit', function(e) {
			e.preventDefault();

			// User is going to select a type of wine from a predefined list.
			// Get contents of first input box and save them in a variable.
			wineApp.type = $('input.drink:checked').val();

			// Let a user select Canadian or International and save it in a variable.
			wineApp.location = $('input.location:checked').val();

			// Get the price that a user asked for
			wineApp.price = $('input#priceTag').val()*100;
			wineApp.getStuff();
		});
	}

/* AJAX CALL
==================================================*/

	// Making an ajax call to the LCBO API to provide the type of wine a user asked for
	wineApp.getStuff = function() {
		
		$.ajax({
			url: 'http://lcboapi.com/products',
			type: 'GET',
			dataType: 'JSON',
			headers: {
		    'Authorization' : 'Token MDoxZmUyNWFhYS1jZTYyLTExZTQtOWY1ZC01ZmJiNzc5YmZkMmY6YkpVeDJndnNKN2VRUDhGMHlwR1N1VWM2blE2SzBOS2Q4WkFZ'
		  },
		  data :{
		  	per_page: 20,
		  	order: 'price_in_cents.asc',
		  	origin: 'Canada, Ontario',
		  	q: wineApp.type
		  },
		  success: function(data) {
		  	wineApp.stuff = data.result;
		  	wineApp.sort();
		  }
		});

	}

	wineApp.sort = function() {
		$('.contentHeader ul').html(''); // clean it out

			// Take information that came back and sort through it
			for (var i = 0; i < wineApp.stuff.length; i++) {
			// console.log('the user selected ' + wineApp.length);

			//Store each loopedover object in a variable
			var wine = wineApp.stuff[i];
			
			// If price in cents is lower than user inputted value, console.log the item
			var isCanadian = !!wine.origin.match(/canada/gi);
			var isInternational = !wine.origin.match(/canada/gi);

			if (wine.price_in_cents < wineApp.price) {
				if((wineApp.location === 'international' && isInternational) || wineApp.location === 'domestic' && isCanadian) {
					console.log(wine);


/* OUTPUT
==================================================*/

					var output = $('<li>');

					// var div = $('<div>').addClass('price');
					var h2 = $('<h2>').text(wine.name);

					var p = $('<p>').addClass('price').text("$" + (wine.price_in_cents/100).toFixed(2));

					output.append(h2,p);

					// Check to see if there is an image first
					if(wine.image_url){

						var img = $('<img>').attr('src',wine.image_url);
						output.append(img);
						$('ul').append(output);	
					}
				}
			}
		}
	}


/* RESTART THE APP
==================================================*/

	wineApp.restart = function() {
		$(".drinksUpButton").on("click", function() {
			// Gets all input types and removes user selections
			$("input[type='radio']").removeAttr("checked");
			$("input[type='range']").val('1');
			$('#rangevalue').text('7');
			$('.results ul').empty();
		});
	}

	wineApp.init = function() {
		wineApp.collectInfo();
		wineApp.restart();
	}


/* DOCUMENT READY
==================================================*/

	$(function() {
		wineApp.init();
	});
