var OpenWeatherAppKey = "<-- PLACE YOUR OPENWEATHERMAP KEY HERE -->"; 
const APIUnitsInCelsius = "&units=metric";

function getWeatherWithCityName() {
    var cityName = $('#city-name-input').val();
    if (!/\S/.test(cityName)) {
        hideAllAndDisplayError("Моля въведете име на град.");
        return false;
    }

    CallApiForCity(cityName);
    DecideFavouriteButtonState();

    $('#city-name-input').val('');

    return false;
}

function CallApiForCity(cityName) {
    var queryString =
        'https://api.openweathermap.org/data/2.5/weather?q='
        + cityName + '&appid=' + OpenWeatherAppKey + APIUnitsInCelsius;
    getJSONForWeatherToday(queryString);

    var queryStringFor5Days =
        'https://api.openweathermap.org/data/2.5/forecast?q='
        + cityName + '&appid=' + OpenWeatherAppKey + APIUnitsInCelsius;
    getJSONForWeather5Days(queryStringFor5Days);
}

function getJSONForWeatherToday(queryString) {
    $.getJSON(queryString, function (results) {
        showWeatherData(results);
    }).fail(function (jqXHR) {
        hideAllAndDisplayError("Грешка при получаване на данните. " + jqXHR.statusText);
    });
}
function getJSONForWeather5Days(queryString) {
    $.getJSON(queryString, function (results) {
        showWeatherDataFor5Days(results);
    }).fail(function (jqXHR) {
        $('.next-5-days').hide();
        if ($('#error-msg').is(":hidden")) {
            $('#error-msg').show();
            $('#error-msg').text("Не можахме да доставим данните за следващите 5 дни!" + jqXHR.statusText);
        }
    });
}


function favouriteButtonClicked() {
    if ($("#checkbox").is(":checked")) {
        window.localStorage.setItem("Favourite", $("#title").text());
        $("#favouriteText").text("Запомнено");
    } else {
        window.localStorage.setItem("Favourite", "");
        $("#favouriteText").text("Запомни");
    }
}

function geolocationButtonClicked() {
    toggleLoadingAnimation(true);
    setTimeout(function () {
        getWeatherWithGeoLocation(true);
    }, 300); // give it time to display animation
}
function toggleLoadingAnimation(on) {
    if (on) {
        $("#circularLoader").removeClass("d-none");
        $("#weather-page").toggleClass("blurry-background");
    } else {
        setTimeout(function () {
            $("#circularLoader").addClass("d-none");
            $("#weather-page").removeClass("blurry-background");
        }, 700);
    }
}

function ToggleFavouriteButton() {
    if ($("#checkbox").is(":checked")) {
        $("#checkbox").prop("checked", false);
        $("#favouriteText").text("Запомни");
    } else {
        $("#checkbox").prop("checked", true);
        $("#favouriteText").text("Запомнено");
    }
}

function DecideFavouriteButtonState() {
    if (window.localStorage.getItem("Favourite") == $("#title").text()) {
        ToggleFavouriteButton();
    }
}


function showWeatherData(results) {
    if (results.weather.length) {
        $('#error-msg').hide();
        fadeInDayContainers();
        $('#title').text(results.name);
        $('#temperature').html(Math.round(results.main.temp) + "&deg;C");
        $('#tempMax').html(Math.round(results.main.temp_max) + "&deg;C");
        $('#tempMax').attr("originalVal", results.main.temp_max);
        $('#tempMin').html(Math.round(results.main.temp_min) + "&deg;C");
        $('#tempMin').attr("originalVal", results.main.temp_min);
        $('#feelsLike').html("Чувства се като " + Math.round(results.main.feels_like) + "&deg;C");
        $('#wind').text(results.wind.speed + "m/s");
        $('#humidity').text(results.main.humidity + "%");
        $('#visibilityIcon').attr("src", "https://openweathermap.org/img/wn/" + results.weather[0].icon + "@2x.png");
        $('#visibility').text(getWeatherStateInBulgarian(results.weather[0].main));
        var sunriseDate = new Date(results.sys.sunrise * 1000);
        $('#sunrise').text(sunriseDate.toLocaleTimeString('bg-BG'));
        var sunsetDate = new Date(results.sys.sunset * 1000);
        $('#sunset').text(sunsetDate.toLocaleTimeString('bg-BG'));
        DecideFavouriteButtonState();
    } else {
        hideAllAndDisplayError("Грешка!");
    }
}

function showWeatherDataFor5Days(results) {

    if (results.list.length) {
        $('#error-msg').hide();

        // clear old results
        $('.next-5-days').empty();
        let next5Days = document.createElement("h2");
        $(next5Days).addClass("next-5-days__heading");
        let next5DaysTextNode = document.createTextNode("Следващите 5 дни");
        next5Days.appendChild(next5DaysTextNode);
        $('.next-5-days').append(next5Days);
        //

        let currentDate = new Date();
        var currentHour = currentDate.getHours();
        let today = currentDate.getDate();
        let container = document.createElement("div");
        $(container).addClass("next-5-days__container");

        let dayCounter = today + 1;
        let monthChanged = false;
        let daysTaken = 0;
        let likelyWeatherConditionIndex = null;
        for (i = 0; i < results.list.length; i++) {
            let elementDate = new Date(results.list[i].dt_txt);
            let elementHour = elementDate.getHours();
            let elementDay = elementDate.getDate();

            if (elementDay == today) {
                let todayMin = Number($('#tempMin').attr("originalVal"));
                let todayMax = Number($('#tempMax').attr("originalVal"));

                if (Number(results.list[i].main.temp_min) < todayMin) {
                    $('#tempMin').html(Math.round(results.list[i].main.temp_min) + "&deg;C");
                    $('#tempMin').attr("originalVal", results.list[i].main.temp_min);
                }
                if (Number(results.list[i].main.temp_max) > todayMax) {
                    $('#tempMax').html(Math.round(results.list[i].main.temp_max) + "&deg;C");
                    $('#tempMax').attr("originalVal", results.list[i].main.temp_max);
                }
            }

            let currentWeather = results.list[i].weather[0];

            let currentWeatherIndex = 0;
            for (let key of weatherStates.keys()) {
                if (key == currentWeather.main) {
                    break;
                }
                currentWeatherIndex++;
            }
            weatherIcons[currentWeatherIndex] = currentWeather.icon;
            if (elementHour > 6 && elementHour <= 18) {
                if (likelyWeatherConditionIndex != null) {
                    if (currentWeatherIndex > likelyWeatherConditionIndex)
                        likelyWeatherConditionIndex = currentWeatherIndex;
                } else if (currentWeatherIndex > -1) {
                    likelyWeatherConditionIndex = currentWeatherIndex;
                }
            }

            if (elementDay < dayCounter) {
                if (i == 0) continue;
                if (!monthChanged && elementDate.getMonth() > new Date(results.list[i - 1].dt_txt).getMonth()) {
                    dayCounter = 1;
                    monthChanged = true;
                    i--;
                    continue;
                }
                else {
                    continue;
                }
            } else if (elementDay > dayCounter) {
                showWeatherForADay(container, results.list[i - 1], results.list, elementDay, likelyWeatherConditionIndex);
                daysTaken++;
                dayCounter++;
                likelyWeatherConditionIndex = null;
            }

            if (elementHour > currentHour) {
                showWeatherForADay(container, results.list[i - 1], results.list, elementDay, likelyWeatherConditionIndex);
                daysTaken++;
                dayCounter++;
                likelyWeatherConditionIndex = null;
            } else if (i == results.list.length - 1 && daysTaken != 5) {
                showWeatherForADay(container, results.list[i], results.list, elementDay, likelyWeatherConditionIndex);
            }
        }
        fadeIn5DaysContainers();
    } else {
        $('#error-msg').show();
        $('#error-msg').text("Не можахме да доставим данните за следващите 5 дни!");
    }
}

function showWeatherForADay(container, element, allElements, currentElementDay, weatherIndex) {
    let elementDate = new Date(element.dt_txt);
    let elementDayString = weekday[elementDate.getDay()];

    let globalLabel = document.createElement("div");
    $(globalLabel).addClass("next-5-days__label");

    let childRow = document.createElement("div");
    $(childRow).addClass("next-5-days__row");

    let childDate = document.createElement("div");
    $(childDate).addClass("next-5-days__date");
    let childDateText = document.createElement("text");
    $(childDateText).text(elementDayString);
    $(childDateText).attr("style", "line-height:50px;");
    $(childDate).append(childDateText);
    let childDateLabel = globalLabel.cloneNode(true);
    let childDateContent = document.createTextNode(elementDate.getDate() + "/" + elementDate.getMonth());
    childDateLabel.appendChild(childDateContent);
    $(childDate).append(childDateLabel);
    $(childRow).append(childDate);

    let arrayFilter = allElements.filter(x => new Date(x.dt_txt).getDate() == currentElementDay);
    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;
    var tmpMin;
    var tmpMax;
    for (var i = arrayFilter.length - 1; i >= 0; i--) {
        tmpMin = arrayFilter[i].main.temp_min;
        tmpMax = arrayFilter[i].main.temp_max;
        if (tmpMin < lowest) lowest = tmpMin;
        if (tmpMax > highest) highest = tmpMax;
    }
    let filteredTempMin = element.main.temp_min;
    let filteredTempMax = element.main.temp_min;
    if (lowest != Number.POSITIVE_INFINITY) {
        filteredTempMin = lowest;
    }
    if (highest != Number.NEGATIVE_INFINITY) {
        filteredTempMax = highest;
    }


    let childLow = document.createElement("div");
    $(childLow).addClass("next-5-days__low");
    let childLowText = document.createElement("text");
    childLowText.innerHTML = Math.round(filteredTempMin) + "&deg;C";
    $(childLowText).attr("style", "line-height:50px;");
    $(childLow).append(childLowText);
    let childLowLabel = globalLabel.cloneNode(true);
    let childLowContent = document.createTextNode("Мин.");
    childLowLabel.appendChild(childLowContent);
    $(childLow).append(childLowLabel);
    $(childRow).append(childLow);

    let childHigh = document.createElement("div");
    $(childHigh).addClass("next-5-days__high");
    let childHighText = document.createElement("text");
    childHighText.innerHTML = Math.round(filteredTempMax) + "&deg;C";
    $(childHighText).attr("style", "line-height:50px;");
    $(childHigh).append(childHighText);
    let childHighLabel = globalLabel.cloneNode(true);
    let childHighContent = document.createTextNode("Макс.");
    childHighLabel.appendChild(childHighContent);
    $(childHigh).append(childHighLabel);
    $(childRow).append(childHigh);

    let childIcon = document.createElement("div");
    $(childIcon).addClass("next-5-days__icon");
    let childIconImg = document.createElement("img");
    $(childIconImg).attr("src", "https://openweathermap.org/img/wn/" + weatherIcons[weatherIndex] + ".png");
    let weatherNameBinder = 0;
    for (let name of weatherStates.values()) {
        if (weatherNameBinder == weatherIndex) {
            weatherNameBinder = name;
            break;
        }
        weatherNameBinder++;
    }
    $(childIconImg).attr("alt", weatherNameBinder);
    $(childIcon).append(childIconImg);
    let childIconLabel = globalLabel.cloneNode(true);
    let childIconContent = document.createTextNode(weatherNameBinder);
    childIconLabel.appendChild(childIconContent);
    $(childIcon).append(childIconLabel);
    $(childRow).append(childIcon);

    let childHumidity = document.createElement("div");
    $(childHumidity).addClass("next-5-days__rain");
    let childHumidityText = document.createElement("text");
    $(childHumidityText).text(element.main.humidity + "%");
    $(childHumidityText).attr("style", "line-height:50px;");
    $(childHumidity).append(childHumidityText);
    let childHumidityLabel = globalLabel.cloneNode(true);
    let childHumidityContent = document.createTextNode("Влажност");
    childHumidityLabel.appendChild(childHumidityContent);
    $(childHumidity).append(childHumidityLabel);
    $(childRow).append(childHumidity);

    let childWind = document.createElement("div");
    $(childWind).addClass("next-5-days__wind");
    let childWindText = document.createElement("text");
    $(childWindText).text(element.wind.speed + "m/s");
    $(childWindText).attr("style", "line-height:50px;");
    $(childWind).append(childWindText);
    let childWindLabel = globalLabel.cloneNode(true);
    let childWindContent = document.createTextNode("Вятър");
    childWindLabel.appendChild(childWindContent);
    $(childWind).append(childWindLabel);
    $(childRow).append(childWind);

    $(container).append(childRow);
    $('.next-5-days').append(container);
}
function getWeatherStateInBulgarian(state) {
    if (weatherStates.has(state)) {
        return weatherStates.get(state);
    } else {
        return state;
    }
}
function getWeatherWithGeoLocation(overrideFavourite) {
    let favouriteCity = window.localStorage.getItem("Favourite");
    if (favouriteCity != null && favouriteCity != "" && overrideFavourite != true) {
        CallApiForCity(favouriteCity);
    } else {
        $('#error-msg').show();
        $('#error-msg').text('Откриване на вашето местоположение ...');
        cordova.plugins.locationAccuracy.canRequest(function (canRequest) {
            if (canRequest) {
                cordova.plugins.locationAccuracy.request(function (success) {
                    console.log("Successfully requested accuracy: " + success.message);
                    navigator.geolocation.getCurrentPosition(onGetLocationSuccess, onGetLocationError, { enableHighAccuracy: true });
                    toggleLoadingAnimation(false);
                }, function (error) {
                    console.error("Accuracy request failed: error code=" + error.code + "; error message=" + error.message);
                    if (error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED) {
                        if (window.confirm("Не можахме да включим вашият GPS на висока точност. Желаете ли да го включите сами?")) {
                            cordova.plugins.diagnostic.switchToLocationSettings();
                        }
                    }
                    toggleLoadingAnimation(false);
                }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
            } else {
                navigator.geolocation.getCurrentPosition(onGetLocationSuccess, onGetLocationError, { enableHighAccuracy: false });
                toggleLoadingAnimation(false);
            }
        });
    }
}
function onGetLocationSuccess(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    var queryString = 'https://api.openweathermap.org/data/2.5/weather?lat='
        + latitude + '&lon=' + longitude + '&appid=' + OpenWeatherAppKey + APIUnitsInCelsius;
    getJSONForWeatherToday(queryString);

    var queryStringFor5Days = 'https://api.openweathermap.org/data/2.5/forecast?lat='
        + latitude + '&lon=' + longitude + '&appid=' + OpenWeatherAppKey + APIUnitsInCelsius;
    getJSONForWeather5Days(queryStringFor5Days);

}

function getDateToday() {
    let today = new Date();
    let monthNumber = today.getMonth();
    let monthString = months[monthNumber];
    return today.getDate() + " " + monthString + " " + today.getFullYear();
}

function fadeInDayContainers() {
    $('.location-and-date').hide();
    $('.current-temperature').hide();
    $('.current-stats').hide();

    $('.location-and-date').fadeIn(600);
    $('.current-temperature').fadeIn(800);
    $('.current-stats').fadeIn(1000);
}
function fadeIn5DaysContainers() {
    $('.next-5-days').show();
    $('.next-5-days__heading').hide();
    $('.next-5-days__heading').fadeIn(1200);
    let rows = $('.next-5-days__row');

    rows.each(function () {
        $(this).hide();
    });

    rows.each(function (index) {
        $(this).delay(400 * index).fadeIn(800);
    });
}
function hideAllAndDisplayError(errorMsg) {
    $('.location-and-date').hide();
    $('.current-temperature').hide();
    $('.current-stats').hide();
    $('.next-5-days').hide();
    $('#error-msg').fadeIn(500);
    $('#error-msg').text(errorMsg);
}

function onGetLocationError(error) {
    $('#error-msg').text('Грешка при получаване на вашата локация.');
}

const months = new Array(12);
months[0] = "Януари";
months[1] = "Февруари";
months[2] = "Март";
months[3] = "Април";
months[4] = "Май";
months[5] = "Юни";
months[6] = "Юли";
months[7] = "Август";
months[8] = "Септември";
months[9] = "Октомври";
months[10] = "Ноември";
months[11] = "Декември";

const weekday = new Array(7);
weekday[0] = "Неделя";
weekday[1] = "Понеделник";
weekday[2] = "Вторник";
weekday[3] = "Сряда";
weekday[4] = "Четвъртък";
weekday[5] = "Петък";
weekday[6] = "Събота";

const weatherStates = new Map();
weatherStates.set("Clear", "Ясно");
weatherStates.set("Clouds", "Облачно")
weatherStates.set("Snow", "Сняг");
weatherStates.set("Rain", "Дъжд");
weatherStates.set("Thunderstorm", "Буря");
weatherStates.set("Drizzle", "Слаб дъжд");
weatherStates.set("Mist", "Мъгла");
weatherStates.set("Smoke", "Пушек");
weatherStates.set("Haze", "Мъгла");
weatherStates.set("Dust", "Запрашено");
weatherStates.set("Fog", "Мъгливо");
weatherStates.set("Sand", "Пясъчни бури");
weatherStates.set("Ash", "Пепел");
weatherStates.set("Squall", "Вихрушка");
weatherStates.set("Tornado", "Торнадо");
var weatherIcons = [];
