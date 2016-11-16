/**
	Startpage Reworked
	==================

	by Christian Brassat,
	reusing code by Jukka Svahn
*/

/**
	Released under MIT License
	
	Copyright (c) 2010 Jukka Svahn, Christian Brassat
	<http://rahforum.biz>
	<http://crshd.cc>

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

/* Settings *\
\*==========*/
var settings = {
	"navigation": {
		"newWindow": true
	},
	
	"search": {
		"engines": [
			["https://www.google.com/search", "q", "Google", "sg"],
			// ["http://www.google.com/images", "q", "Google Images", "si"],
			// ["http://search.yahoo.com/search", "p", "Yahoo", "sy"],
			// ["http://wikipedia.org/w/index.php", "w", "Wikipedia", "sw"],
			["http://www.dict.cc", "s", "Dict.cc", "sd"],
			// ["http://dict.leo.org", "search", "leo", "sl"],
			// ["http://www.flickr.com/search", "q", "flickr", "sf"],
			// ["http://browse.deviantart.com/", "q", "deviantArt", "sa"]
		],
		"focusSearch": false
	},
	
	"clock": {
		"showClock": true
	},
	"weather": {
		"showWether": true
	},
	"animation": {
		"hideLinks": true
	},

	"icons": {
		"showIcons": true
	}
};

/*  Clock  *\
\*=========*/
function updateClock() {
	var currentTime = new Date ();
	var currentHours = currentTime.getHours ();
	var currentMinutes = currentTime.getMinutes ();
	//var currentSeconds = currentTime.getSeconds ();

	// Pad the minutes and seconds with leading zeros, if required
	currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
	//currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;

	// Choose either "AM" or "PM" as appropriate
	var timeOfDay = (currentHours < 12) ? "AM" : "PM";
	var timeOfDay = ""

	// Convert the hours component to 12-hour format if needed
	// currentHours = (currentHours > 12) ? currentHours - 12 : currentHours;

	// Convert an hours component of "0" to "12"
	currentHours = (currentHours == 0) ? 12 : currentHours;

	// Compose the string for display
	var currentTimeString = currentHours + ":" + currentMinutes;

	// Fill '#clock' div with time
	$("#clock").html(currentTimeString);
}

function searchBox(url, name, placeholder) {
	var string = '<form method="get" action="' + url + '">'
	           + '<input type="text" id="g" name="' + name + '" placeholder="' + "" + '" maxlength="255" value="">'
	           + '<label for="g">'+placeholder+'</label>'
	           + '<input type="submit" value="Go">'
	           + '</form>';
	return string;
}


/* Greeding *\
\* ======== */
(function ($) {
	var username = "Andreas"
  $.fn.setGreeting = function(username){
    var now = new Date().getHours();
    var text;

    if (now >= 6 && now < 12){
      text = 'Guten Morgen';
    }
    else if (now >= 12 && now < 17){
      text = 'Hallo'; 
    }
    else if (now >= 17 && now < 22 ){
      text = 'Guten Abend';
    }
    else{
      text = 'Gute Nacht';
    }

    return this.each(function(){
      var $div = $(this);

      $div.html(text + ' ' + username);
    });
  }

}(jQuery));


$(document).ready(function() {

	var shortcuts = {};
	
	/*  Get Links  *\
	\*=============*/
	var linkString = $('body').text();

	/*  Clear Page  *\
	\*==============*/
	$('body').empty();

	/*  Create Array from linkString  *\
	\*================================*/
	var linkArray = linkString.split("\n");

	/*  Go thru Array  *\
	\*=================*/
	var i;
	var count = 1;
	var html = '';

	for(i in linkArray) {

		/*  Get line  *\
		\*============*/
		var line = jQuery.trim(linkArray[i]);

		// If line is empty, skip
		if(!line) continue;

		/*  If it doesn't contain "://",  *\
		|*  it's not a URL                *|
		\*================================*/
		if(/:\/\//.test(line) != true) {
			if(count > 1) {
				html = html + '</div>';
			}
			html = html + '<div class="block"><h1>' + line + '</h1><ul>';
			count++;
			continue;
		}

		/*  Split URL, Title and icon (if any) *\
		\*=======================*/
		var lineArray = line.split(" || ");
		var url = lineArray[0];
		var title = lineArray[1];
		
		var icon = "";
		if (lineArray[3]) {
			icon = lineArray[3];
		}
		
		/*  Add to shortcuts array *\
		\*=========================*/
		if(lineArray[2]) {
			shortcuts[lineArray[2]] = "'"+url+"'";
		}

		/* Prepares HTML code for showing icon *\
		\*=====================================*/
		var iconHtml = '';
		if (settings.icons.showIcons && icon) {
			iconHtml = '<img src="' + icon + '"/>'; 
		}

		/*  Add HTML code  *\
		\*=================*/
		if(settings.navigation.newWindow) {
			html = html + '<li>' + iconHtml + '<a href="' + url + '" target="_blank">' + title + '</a></li>'
		}
		else {
			html = html + '<li>' + iconHtml + '<a href="' + url + '">' + title + '</a></li>'
		}
	}

	/*  Add generated content to page  *\
	\*=================================*/
	html = html + '</ul></div>';
	$('body').append(html);


	/*  Animation Time!  *\
	\*===================*/
	
	/*  Hide lists  *\
	\*==============*/
	if (settings.animation.hideLinks) {
		$('ul').slideUp();

		/*  Show on hover  *\
		\*=================*/
		$('.block').mouseenter(function() {
			$('ul', this).slideDown();
		});

		/*  Hide on unhover  *\
		\*===================*/
		$('.block').mouseleave(function() {
			$('ul', this).slideUp();
		});
	}


	/*  Search Engines  *\
	\*==================*/

	var search = '<div id="searches">';

	for (var i = 0; i < settings.search.engines.length; i++) {
		var engine = settings.search.engines[i];
		search = search + searchBox(engine[0], engine[1], engine[2]);
		if(engine[3]) {
			var jsSearchUrl=engine[0]+"?"+engine[1]+"=";
			var jsSearchPrompt="prompt('Search "+engine[2]+":')";
			var jsSearch="'"+jsSearchUrl+"'+"+jsSearchPrompt;
			shortcuts[engine[3]] = jsSearch;
      }
	}

	search = search + '</div>';

	/*  Add to page  *\
	\*===============*/
	$('body').append(search);
	if(settings.search.focusSearch) {
		var searchDiv = document.getElementById ('searches');
		$(searchDiv.firstChild.firstChild).focus();
	}
 
	/*  Clock  *\
	\*=========*/
	if(settings.clock.showClock) {

		var current_location = ""

		// Add empty '#clock' div
		$('body').append('<div id="clock"></div>');
		$('<div id="greeting"></div>').insertAfter('div#clock');
		// Update clock
		setInterval('updateClock()', 100);
		$('#greeting').setGreeting('Andreas');

		$('<div id="weather"><img src="images/loading3.gif" width="100" /></div>').insertAfter('div#greeting');
		$.getJSON('https://freegeoip.net/json/').done(function(geo_location) {
			$('#loadingmessage').show();
			/*
			console.log(geo_location.country_name);
			console.log(geo_location.country_code);
			console.log(geo_location.region_name);
			console.log(geo_location.region_code);
			console.log(geo_location.city);
			console.log(geo_location.latitude);
			console.log(geo_location.longitude);
			console.log(geo_location.time_zone);
			console.log(geo_location.ip);
			*/
		
			$.simpleWeather({
			    location: geo_location.city,
			    woeid: '',
			    unit: 'c',
			    success: function(weather) {
			    	var codes = new Array();

					codes[0] = "Wirbelsturm"; //"tornado"
					codes[1] = "Tropensturm"; //"tropical storm"
					codes[2] = "Orkan"; //"hurricane"
					codes[3] = "schwere Gewitter"; //"severe thunderstorms"
					codes[4] = "Gewitter"; //"thunderstorms"
					codes[5] = "Regen und Schnee"; //"mixed rain and snow"
					codes[6] = "Regen und Graupelschauer"; //"mixed rain and sleet"
					codes[7] = "Schnee und Graupelschauer"; //"mixed snow and sleet"
					codes[8] = "Nieselregen gefrierend"; //"freezing drizzle"
					codes[9] = "Nieselregen"; //"drizzle"
					codes[10] = "Eisregen"; //"freezing rain"
					codes[11] = "Regenschauer"; //"showers"
					codes[12] = "Regen"; //"showers"
					codes[13] = "Schneegestöber"; //"snow flurries"
					codes[14] = "leichte Schneeschauer"; //"light snow showers"
					codes[15] = "Schneetreiben"; // "blowing snow"
					codes[16] = "Schnee"; //"snow"
					codes[17] = "Hagel"; //"hail"
					codes[18] = "Schneeregen"; //"sleet"
					codes[19] = "Staub"; //"dust"
					codes[20] = "neblig"; //"foggy"
					codes[21] = "Dunst"; //"haze"
					codes[22] = "rauchig"; //"smoky"
					codes[23] = "stürmisch"; //"blustery"
					codes[24] = "windig"; //"windy"
					codes[25] = "kalt"; //"cold"
					codes[26] = "bewölkt"; //"cloudy"
					codes[27] = "Nachts überwiegend bewölkt"; //"mostly cloudy (night)"
					codes[28] = "Tags überwiegend bewölkt"; //"mostly cloudy (day)"
					codes[29] = "Nachts wechselnd bewölkt"; //"partly cloudy (night)"
					codes[30] = "Tags wechselnd bewölkt"; //"partly cloudy (day)"
					codes[31] = "Nachts klar"; //"clear (night)"
					codes[32] = "sonnig"; //"sunny"
					codes[33] = "Nachts schön"; //"fair (night)"
					codes[34] = "Tags schön"; //"fair (day)"
					codes[35] = "Regen und Hagel"; //"mixed rain and hail"
					codes[36] = "heiss"; //"hot"
					codes[37] = "vereinzelt Gewitter"; //"isolated thunderstorms"
					codes[38] = "vereinzelte Gewitter"; //"scattered thunderstorms"
					codes[39] = "vereinzelte Gewitter"; //"scattered thunderstorms"
					codes[40] = "vereinzelte Schauer"; //"scattered showers"
					codes[41] = "schwerer Schneefall"; //"heavy snow"
					codes[42] = "vereinzelte Schneeschauer"; //"scattered snow showers"
					codes[43] = "schwerer Schneefall"; //"heavy snow"
					codes[44] = "wechselnd bewölkt"; //"partly cloudy"
					codes[45] = "Gewitterschauer"; //"thundershowers"
					codes[46] = "Schneeschauer"; //"snow showers"
					codes[47] = "vereinzelt Gewitterschauer"; //"isolated thundershowers"
					codes[3200] = "nicht verfügbar"; //"not available"
			    	html = '<h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
			    	html += '<ul><img style="float:left;" width="50px" src="'+weather.image+'" /><li>'+weather.city+', '+weather.region+'</li>';
			    	html += '<li class="currently">'+codes[weather.code]+'</li>';
			    	html += '<li>'+weather.wind.direction+' '+weather.wind.speed+' '+weather.units.speed+'</li></ul>';
			    	$('#loadingmessage').hide();
			    	$("#weather").html(html);
			    },
			    error: function(error) {
			      $("#weather").html('<p>'+error+'</p>');
			    }
			});
		});
	}


	/*  Keybindings  *\
	\*===============*/

	var typed = '';
	var shortcutArray = Object.keys(shortcuts);
	var typedDate = new Date();
		
	// Check if we typed a keybinding
	function hasSubstring(element) {
		var index = typed.indexOf(element);
		if(index >= 0) {
			var sliced = typed.slice(index, typed.length);
			typed = ''; // Clean typed, so that we can watch for the next keybinding
			if(settings.navigation.newWindow) {
				window.open(eval(shortcuts[sliced]));
			} else {
				window.location.replace(eval(shortcuts[sliced]));
			}
		}
	}

	// React on keypress
	$(window).keypress(function(e) {
		// If we're in an input, we don't want to interpret the keypresses
		$('input').keypress(function(e) {
			e.stopPropagation();
		});
		var nowDate = new Date();
		var diffMs = (nowDate - typedDate);
		if (diffMs > 1000) {	
			typed = String.fromCharCode(e.which);
		} else {
			typed = typed + String.fromCharCode(e.which);
		}
		typedDate = new Date();
		shortcutArray.some(hasSubstring);
	});

});
