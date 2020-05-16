// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
const ptr = PullToRefresh.init({
    mainElement: 'body',
    onRefresh() {
        window.location.reload();
    }
});
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        let dateToday = document.createTextNode(getDateToday());
        $('#date-today').append(dateToday);
        $('#get-weather-btn').click(getWeatherWithCityName);
        $("#checkbox").click(favouriteButtonClicked);
        $("#geolocButton").click(geolocationButtonClicked);
        getWeatherWithGeoLocation();
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();