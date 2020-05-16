# FindWeather
Find Weather is a mobile application made on Apache Cordova with Javascript to check the weather for today and 5 days later.
It is using the openweathermap's API (https://openweathermap.org/)  
**THE ENTIRE APP IS IN BULGARIAN** - read Info if you wonder why.  

<img src="./app-screenshot.jpg" align="left" width="413" height="862">

## Info
The purpose of this app creation is term paper for my University in Bulgaria.  
Most of the code is located in file named "weather.js" as the project is small, its development very fast paced and doesn't really have much functions to begin with.  
However some of the implementations I've used, I've found very interesting, and this is the reason why I'm uploading it here.  
Feel free to use it as you see fit!

## Installation
### Run with Visual Studio
You can start it in Visual Studio - either use Google emulator or browser simulation. For this case you need Visual Studio 2017 with module "Mobile applications with Javascript" installed.
### Insert your OpenWeatherMap.org API key
Insert your OpenWeatherMap.org API key in www/scripts/weather.js (first line) and in Merges/iOS/scripts/weather.js (first line), if you'd like to compile it for iOS.

### Compile for Android or iOS
To compile the app you need to have Android SDK (I'm using SDK for Android 8), JDK 8 (my version is Java SE Development Kit 8 Update 251), Gradle (I recommend version 4.4.1 or newer) and Cordova Command-line Interface (npm install -g cordova)
To build Android APK:
First enter folder FindWeather (where you can find www)
Procede to enter following commands in CMD or Powershell:
```Batchfile
cordova platform rm android
cordova platform add android
cordova build android
```
If you don't experience errors with just "cordova build android", you can skip the first two commands. I personally get error message everytime if I don't use them.
You can also use the Batchfile I provided in the repo - BUILD.bat.
You need to run it in the same directory as the .sln file (the current directory)!
It creates folder FindWeather_Build, copies all the files from FindWeather, runs the 3 commands above and copies the resulting .apk file in the same directory.

## Plugins Used

* [pulltorefresh](https://github.com/BoxFactura/pulltorefresh.js)

* [cordova-plugin-request-location-accuracy](https://github.com/dpa99c/cordova-plugin-request-location-accuracy)

* ... and other plugins inside Cordova's default library!

## Others
Great app design thanks to * [responsive-web-weather-app] (https://github.com/JonUK/responsive-web-weather-app)
