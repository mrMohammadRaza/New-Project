@echo off
setlocal
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"

echo ========================================================
echo   Starting AgriFlow Mobile (Expo Go)
echo   SIH20676 Solution
echo ========================================================

cd mobile
echo Starting Expo Metro Bundler...
npx expo start

pause
