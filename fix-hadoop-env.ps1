# ========================================
# Script untuk Fix Hadoop JAVA_HOME Error
# ========================================

Write-Host "🔧 Fixing Hadoop JAVA_HOME Configuration..." -ForegroundColor Cyan
Write-Host ""

# Define paths
$hadoopEnvFile = "C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd"
$backupFile = "C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd.backup"
$javaHome = "C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot"
$hadoopHome = "C:\hadoop-3.3.6"

# Check if Hadoop directory exists
if (-not (Test-Path "C:\hadoop-3.3.6")) {
    Write-Host "❌ ERROR: Hadoop directory not found at C:\hadoop-3.3.6" -ForegroundColor Red
    Write-Host "   Please check if Hadoop is installed correctly." -ForegroundColor Yellow
    exit 1
}

# Check if Java directory exists
if (-not (Test-Path $javaHome)) {
    Write-Host "❌ ERROR: Java JDK not found at $javaHome" -ForegroundColor Red
    Write-Host "   Please check your Java installation path." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Java JDK found at: $javaHome" -ForegroundColor Green
Write-Host "✅ Hadoop found at: $hadoopHome" -ForegroundColor Green
Write-Host ""

# Check if hadoop-env.cmd exists
if (-not (Test-Path $hadoopEnvFile)) {
    Write-Host "❌ ERROR: hadoop-env.cmd not found at $hadoopEnvFile" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found hadoop-env.cmd" -ForegroundColor Green
Write-Host ""

# Backup original file
Write-Host "📦 Creating backup..." -ForegroundColor Cyan
try {
    Copy-Item -Path $hadoopEnvFile -Destination $backupFile -Force
    Write-Host "✅ Backup created: $backupFile" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Warning: Could not create backup" -ForegroundColor Yellow
}
Write-Host ""

# Read original file
Write-Host "📖 Reading original file..." -ForegroundColor Cyan
$content = Get-Content -Path $hadoopEnvFile -Raw

# Create new configuration
$newConfig = @"
@echo off
@rem Licensed to the Apache Software Foundation (ASF) under one or more
@rem contributor license agreements.  See the NOTICE file distributed with
@rem this work for additional information regarding copyright ownership.
@rem The ASF licenses this file to You under the Apache License, Version 2.0
@rem (the "License"); you may not use this file except in compliance with
@rem the License.  You may obtain a copy of the License at
@rem
@rem     http://www.apache.org/licenses/LICENSE-2.0
@rem
@rem Unless required by applicable law or agreed to in writing, software
@rem distributed under the License is distributed on an "AS IS" BASIS,
@rem WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@rem See the License for the specific language governing permissions and
@rem limitations under the License.

@rem ============================================
@rem EDITED BY USER - June 9, 2026
@rem Fixed JAVA_HOME path with spaces issue
@rem ============================================

@rem Set Java Home (WITH QUOTES for paths containing spaces)
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot"

@rem Set Hadoop Home
set "HADOOP_HOME=C:\hadoop-3.3.6"

@rem Set Hadoop Configuration Directory
set "HADOOP_CONF_DIR=%HADOOP_HOME%\etc\hadoop"

@rem Set Hadoop Log Directory
set "HADOOP_LOG_DIR=%HADOOP_HOME%\logs"

@rem Hadoop Classpath
set "HADOOP_CLASSPATH=%HADOOP_HOME%\share\hadoop\tools\lib\*"

@rem ============================================
@rem HADOOP OPTS (Memory settings)
@rem ============================================
set "HADOOP_OPTS=-Xmx512m -Djava.net.preferIPv4Stack=true"
set "HADOOP_CLIENT_OPTS=-Xmx512m %HADOOP_CLIENT_OPTS%"
set "HADOOP_NAMENODE_OPTS=-Xmx512m %HADOOP_NAMENODE_OPTS%"
set "HADOOP_DATANODE_OPTS=-Xmx512m %HADOOP_DATANODE_OPTS%"

@rem ============================================
@rem PATH
@rem ============================================
set "PATH=%HADOOP_HOME%\bin;%JAVA_HOME%\bin;%PATH%"

@rem ============================================
@rem Default settings (keep existing)
@rem ============================================
"@

# Write new configuration
Write-Host "✏️  Writing new configuration..." -ForegroundColor Cyan
try {
    Set-Content -Path $hadoopEnvFile -Value $newConfig -Force -Encoding ASCII
    Write-Host "✅ File updated successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Could not write to file" -ForegroundColor Red
    Write-Host "   Try running PowerShell as Administrator" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "✅ HADOOP CONFIGURATION FIXED!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Changes made:" -ForegroundColor Cyan
Write-Host "   - Set JAVA_HOME with proper quotes" -ForegroundColor White
Write-Host "   - Set HADOOP_HOME" -ForegroundColor White
Write-Host "   - Set HADOOP_CONF_DIR" -ForegroundColor White
Write-Host "   - Set HADOOP_LOG_DIR" -ForegroundColor White
Write-Host "   - Fixed HADOOP_OPTS with quotes" -ForegroundColor White
Write-Host ""
Write-Host "🔄 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "   1. CLOSE this PowerShell window" -ForegroundColor White
Write-Host "   2. Open a NEW Command Prompt or PowerShell" -ForegroundColor White
Write-Host "   3. Test with: java -version" -ForegroundColor White
Write-Host "   4. Test with: hadoop version" -ForegroundColor White
Write-Host ""
Write-Host "📄 Backup file saved at:" -ForegroundColor Cyan
Write-Host "   $backupFile" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
