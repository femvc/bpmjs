@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\node_modules\bpm\bin\bpm.js" %*
) ELSE (
  node  "%~dp0\node_modules\bpm\bin\bpm.js" %*
)