@echo off
setlocal

:: Define variables
set ZIP_NAME=edge-master-volume.zip
set BUILD_DIR=build
set OUT_DIR=%~dp0%BUILD_DIR%

:: Clean up old build folder and zip
echo Cleaning previous build...
if exist "%OUT_DIR%" rd /s /q "%OUT_DIR%"
if exist "%ZIP_NAME%" del "%ZIP_NAME%"

:: Create build directory
mkdir "%OUT_DIR%"

:: Copy extension files
echo Copying files...
copy manifest.json "%OUT_DIR%"
copy popup.html "%OUT_DIR%"
copy popup.js "%OUT_DIR%"
robocopy icons "%OUT_DIR%\icons" /E /XF *.xcf >nul

:: Change to build dir and create zip
echo Zipping contents...
powershell -command "Compress-Archive -Path '%OUT_DIR%\*' -DestinationPath '%ZIP_NAME%'"

:: Done
echo Done. Output: %ZIP_NAME%
pause
:: End of script