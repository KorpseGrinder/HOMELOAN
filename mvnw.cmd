@REM Maven Wrapper startup batch script
@REM This script downloads Apache Maven if not found in the .mvn/wrapper directory

@echo off
setlocal

set MAVEN_PROJECTBASEDIR=%~dp0
set MAVEN_WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar
set MAVEN_WRAPPER_PROPERTIES=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties

@REM Check if Maven is already available
where mvn >nul 2>nul
if %ERRORLEVEL% == 0 (
    mvn %*
    goto end
)

@REM Check for Java
where java >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: JAVA_HOME is not set and java command is not available.
    echo Please install Java 21 and set JAVA_HOME environment variable.
    goto error
)

@REM If wrapper jar exists, use it
if exist "%MAVEN_WRAPPER_JAR%" (
    java -jar "%MAVEN_WRAPPER_JAR%" %*
    goto end
)

echo Maven wrapper JAR not found. Please install Maven manually:
echo   1. Download from https://maven.apache.org/download.cgi
echo   2. Extract and add bin directory to PATH
echo   3. Or run: mvn wrapper:wrapper in this directory

:error
exit /b 1

:end
endlocal
