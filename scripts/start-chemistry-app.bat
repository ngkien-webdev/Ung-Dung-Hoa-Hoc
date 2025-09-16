
@echo off
echo Starting Chemistry Explorer...
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Error: Node.js is not installed or not in your PATH.
  echo Please install Node.js from https://nodejs.org/
  echo.
  pause
  exit /B 1
)

:: Set the application directory to the script's directory
cd /d %~dp0\..

:: Check if the serve package is installed
call npm list -g serve >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Installing serve package...
  call npm install -g serve
  if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to install serve package.
    pause
    exit /B 1
  )
)

:: Check if build directory exists
if not exist "build\" (
  echo Build directory not found. Building the application...
  call npm run build
  if %ERRORLEVEL% NEQ 0 (
    echo Error: Build failed.
    pause
    exit /B 1
  )
)

:: Open default browser
start "" http://localhost:5000

:: Start the serve command for the built application
echo Chemistry Explorer is running at http://localhost:5000
echo Press Ctrl+C to stop the server
serve -s build

pause
exit /B 0
