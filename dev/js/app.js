$(function () {

  $('.container').css('opacity', '1');
  // Create function to call on button click and keypress of enter button
  var getWeather = function() {

    // Get location value from input field
		var getLocation = $(".get-location").val();

    // 1 - Check if input field has a value
    // 2 - Display alert with a message if no value is found
    // 3 - If a value is found, output location information

  	if( getLocation === ''){
      // Error message if no value is found
      alert("Please enter a location");
  	}	else {
      // Add getLocation data to API url to get location data
      $.getJSON("http://api.openweathermap.org/data/2.5/weather?q=" + getLocation + "&units=metric&appid=68792d9cbf8c18dff3b8d8c23ad59223", function(result){

        // Log results in console for bug testing
        console.log("City: "+ result.name);
        console.log("Temperature: "+ (Math.round(result.main.temp)) +"&deg;C");
        console.log("Weather: "+ result.weather[0].description + result.weather[0].main);
        console.log(result.clouds.all + "% cloudy");
        console.log(result.wind.speed);
        console.log(result.weather[0].icon);

        // Create re-usable variable for the icon code data
        var iconCode = result.weather[0].icon;

        // Create re-usable variable for the div that shows the weather svg icon
        var iconDiv = $(".weather-results__icon");
        var body = $('body');
        // Reset iconDiv to default class
        iconDiv.attr('class', 'weather-results__icon');
        body.attr('class', '');


        // Add class to iconDiv for each iconCode to enable use of custom svg icons
        // Icon codes taken from http://openweathermap.org/weather-conditions
        if(iconCode === '01d'){
          iconDiv.addClass('icon--clear-day');
          body.addClass('bg1');
        } else if (iconCode === '01n'){
          iconDiv.addClass('icon--clear-night');
          body.addClass('bg2');
        } else if (iconCode === '02d'){
          iconDiv.addClass('icon--few-clouds-day');
          body.addClass('bg3');
        } else if (iconCode === '02n'){
          iconDiv.addClass('icon--few-clouds-night');
          body.addClass('bg5');
        } else if (iconCode === '03d'){
          iconDiv.addClass('icon--scattered-day');
          body.addClass('bg4');
        } else if (iconCode === '03n'){
          iconDiv.addClass('icon--scattered-night');
          body.addClass('bg5');
        } else if (iconCode === '04d'){
          iconDiv.addClass('icon--broken-clouds');
          body.addClass('bg3');
        } else if (iconCode === '04n'){
          iconDiv.addClass('icon--broken-clouds');
          body.addClass('bg5');
        } else if (iconCode === '09d'){
          iconDiv.addClass('icon--showers-day');
          body.addClass('bg6');
        } else if (iconCode === '09n'){
          iconDiv.addClass('icon--showers-night');
          body.addClass('bg7');
        } else if (iconCode === '10d'){
          iconDiv.addClass('icon--rain');
          body.addClass('bg8');
        } else if (iconCode === '10n'){
          iconDiv.addClass('icon--rain');
          body.addClass('bg7');
        }else if (iconCode === '11d' || iconCode === '11n'){
          iconDiv.addClass('icon--thunderstorm');
          body.addClass('bg9');
        } else if (iconCode === '13d' || iconCode === '13n'){
          iconDiv.addClass('icon--snow');
          body.addClass('bg10');
        } else if (iconCode === '50d'){
          iconDiv.addClass('icon--fog-day');
          body.addClass('bg3');
        } else if (iconCode === '50n'){
          iconDiv.addClass('icon--fog-night');
          body.addClass('bg5');
        }

        // Output results on screen
        $(".weather-results__location").html(result.name + " <span>, " + result.sys.country + "</span>");
        $(".weather-results__temp").html((Math.round(result.main.temp)) +"&deg;C");
        $(".weather-results__description").html(result.weather[0].description);
        $(".weather-results__clouds").html("Clouds: " + result.clouds.all +"%");
        $(".weather-results__wind").html("Wind speed : " + result.wind.speed + " ms");
        $(".weather-results__humidity").html("Humidity : " + result.main.humidity + "%");

        $(".container").addClass('is-active');

        setTimeout(function(){
          $(".weather-results").css('display', 'block');
        }, 1500);

        setTimeout(function(){
          $(".weather-results").addClass('is-visible');
        }, 1600);

      });
  	}

  };

  // Run getWeather on keypress of enter button
  $(".get-location").keypress(function(e) {
    if (e.which == 13) {
      e.preventDefault();
      getWeather();
    }
  });

  // Run getWeather on click of form submit button
  $('.submit-location').click(getWeather);


});
