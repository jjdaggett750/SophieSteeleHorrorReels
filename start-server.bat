@echo off
echo Starting the server...
cd /d %~dp0
node server.js
echo Server is running on http://localhost:3000
pause