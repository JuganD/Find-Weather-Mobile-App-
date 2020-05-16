@echo off
if not exist FindWeather_Build mkdir FindWeather_Build
cd FindWeather
xcopy /s *.* ..\FindWeather_Build /K /D /H /Y
cd ..\FindWeather_Build
cordova platform rm android & cordova platform add android & cordova build android & move platforms\android\app\build\outputs\apk\debug\app-debug.apk ..\FindWeather.apk & echo "Finished! Press any key to close" & pause