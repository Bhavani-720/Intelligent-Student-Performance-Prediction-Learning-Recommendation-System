@echo off
REM TREKVERSE AI: Automated Git Initialization and GitHub Push Script
SETLOCAL EnableDelayedExpansion

echo ====================================================================
echo 🎓 TREKVERSE AI — GitHub Synchronization Utility
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
        echo Please ensure Git is installed.
        pause
        exit /b 1
    )
)

echo [1/4] Using Git binary: %GIT_CMD%

REM 2. Initialize git repository if not initialized
if not exist ".git" (
    echo [2/4] Initializing new Git repository...
    %GIT_CMD% init -b main
) else (
    echo [2/4] Existing Git repository detected.
)

REM 3. Stage all modified and added files
echo [3/4] Staging all files...
%GIT_CMD% config user.name "Trekverse AI Team"
%GIT_CMD% config user.email "engineering@trekverse.ai"
%GIT_CMD% add .
%GIT_CMD% commit -m "feat: complete upgrade to Trekverse AI Student Intelligence & Early-Warning System"

echo.
echo ====================================================================
echo [4/4] Repository is committed and ready to push to GitHub!
echo ====================================================================
echo If you have created a GitHub repository, push with:
echo.
echo   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
echo   git push -u origin main
echo ====================================================================

ENDLOCAL

