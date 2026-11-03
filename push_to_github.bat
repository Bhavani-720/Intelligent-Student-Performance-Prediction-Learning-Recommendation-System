@echo off
REM TREKVERSE AI: Automated Git Initialization and GitHub Push Script
SETLOCAL EnableDelayedExpansion

echo ====================================================================
echo 🎓 TREKVERSE AI — GitHub Push Utility
echo ====================================================================

REM 1. Check if git is available in standard path or local MinGit
where git >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set GIT_CMD=git
) else (
    if exist "%LOCALAPPDATA%\Programs\MinGit\cmd\git.exe" (
        set GIT_CMD="%LOCALAPPDATA%\Programs\MinGit\cmd\git.exe"
    ) else (
        echo [ERROR] Git was not found in PATH or MinGit directory.
        pause
        exit /b 1
    )
)

echo [1/3] Using Git binary: %GIT_CMD%

REM 2. Configure Remote
echo [2/3] Configuring origin remote to Bhavani-720 repository...
%GIT_CMD% remote remove origin >nul 2>&1
%GIT_CMD% remote add origin https://github.com/Bhavani-720/Intelligent-Student-Performance-Prediction-Learning-Recommendation-System.git
%GIT_CMD% branch -M main

REM 3. Push to GitHub
echo [3/3] Pushing to GitHub (main branch)...
echo If prompted:
echo   Username: Bhavani-720
echo   Password: ^<Your GitHub Personal Access Token^>
echo.
%GIT_CMD% push -u origin main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================================================
    echo ✅ SUCCESS: Repository successfully pushed to GitHub!
    echo URL: https://github.com/Bhavani-720/Intelligent-Student-Performance-Prediction-Learning-Recommendation-System
    echo ====================================================================
) else (
    echo.
    echo ====================================================================
    echo ⚠️ NOTE: If authentication failed, please generate a Personal
    echo Access Token (classic) on GitHub:
    echo   1. Visit: https://github.com/settings/tokens
    echo   2. Generate new token (classic) with "repo" permission checked
    echo   3. Use your token as the password when prompted
    echo ====================================================================
)

pause
ENDLOCAL
