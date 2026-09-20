@echo off
chcp 65001 >nul
echo ========================================================
echo   AgriFlow - Expo Go Scan QR Code
echo   exp://10.223.57.253:8081
echo ========================================================
echo.
python -c "import sys, qrcode; sys.stdout.reconfigure(encoding='utf-8'); qr = qrcode.QRCode(); qr.add_data('exp://10.223.57.253:8081'); qr.print_ascii(invert=True)"
echo.
echo URL: exp://10.223.57.253:8081
echo.
echo Point the Expo Go app camera at the QR code above!
echo.
pause
