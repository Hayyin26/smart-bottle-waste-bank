# ========================================
# Script untuk Fix Hadoop JAVA_HOME Error
# Version 2: Menggunakan Short Path (8.3)
# ========================================

Write-Host "🔧 Fixing Hadoop JAVA_HOME Configuration (Version 2)..." -ForegroundColor Cyan
Write-Host ""

# Define paths
$hadoopEnvFile = "C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd"
$backupFile = "C:\hadoop-3.3.6\etc\hadoop\hadoop-env.cmd.backup2"
$javaHomeLong = "C:\Program Files\Eclipse Adoptium\jdk-11.0.31.11-hotspot"

# Check if Java directory exists
if (-not (Test-Path $javaHomeLong)) {
    Write-Host "❌ ERROR: Java JDK not found at $javaHomeLong" -ForegroundColor Red
    exit 1
}

# Get short path (8.3 format) for Java - this avoids space issues
$fso = New-Object -ComObject Scripting.FileSystemObject
$javaHomeShort = $fso.GetFolder($javaHomeLong).ShortPath

Write-Host "✅ Java JDK found at: $javaHomeLong" -ForegroundColor Green
Write-Host "✅ Short path (8.3): $javaHomeShort" -ForegroundColor Green
Write-Host ""

# Check if hadoop-env.cmd exists
if (-not (Test-Path $hadoopEnvFile)) {
    Write-Host "❌ ERROR: hadoop-env.cmd not found" -ForegroundColor Red
    exit 1
}

# Backup original file
Write-Host "📦 Creating backup..." -ForegroundColor Cyan
Copy-Item -Path $hadoopEnvFile -Destination $backupFile -Force
Write-Host "✅ Backup created: $backupFile" -ForegroundColor Green
Write-Host ""

# Create new configuration using SHORT PATH (8.3 format - no spaces!)
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

@rem Set environment variables here.

@rem ============================================
@rem EDITED BY USER - June 9, 2026
@rem Using SHORT PATH (8.3 format) to avoid spaces
@rem ============================================

@rem The java implementation to use (SHORT PATH - NO SPACES!)
set JAVA_HOME=$javaHomeShort

@rem Where log files are stored
set HADOOP_LOG_DIR=%HADOOP_HOME%\logs

@rem Extra Java CLASSPATH elements
set HADOOP_CLASSPATH=%HADOOP_HOME%\share\hadoop\tools\lib\*

@rem The maximum amount of heap to use, in MB
set HADOOP_HEAPSIZE=512

@rem Command specific options appended to HADOOP_OPTS when specified
set HADOOP_NAMENODE_OPTS=-Xmx512m %HADOOP_NAMENODE_OPTS%
set HADOOP_DATANODE_OPTS=-Xmx512m %HADOOP_DATANODE_OPTS%
set HADOOP_SECONDARYNAMENODE_OPTS=-Xmx512m %HADOOP_SECONDARYNAMENODE_OPTS%
set HADOOP_CLIENT_OPTS=-Xmx512m %HADOOP_CLIENT_OPTS%

@rem The following applies to multiple commands (fs, dfs, fsck, distcp etc)
set HADOOP_OPTS=-Djava.net.preferIPv4Stack=true %HADOOP_OPTS%
"@

# Write new configuration
Write-Host "✏️  Writing new configuration with SHORT PATH..." -ForegroundColor Cyan
Set-Content -Path $hadoopEnvFile -Value $newConfig -Force -Encoding ASCII
Write-Host "✅ File updated successfully!" -ForegroundColor Green

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "✅ HADOOP CONFIGURATION FIXED (Version 2)!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Changes made:" -ForegroundColor Cyan
Write-Host "   - Set JAVA_HOME to SHORT PATH: $javaHomeShort" -ForegroundColor White
Write-Host "   - Removed all quotes (not needed with short path)" -ForegroundColor White
Write-Host "   - Set HADOOP_HEAPSIZE=512" -ForegroundColor White
Write-Host "   - Set all HADOOP_OPTS properly" -ForegroundColor White
Write-Host ""
Write-Host "🔄 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "   1. CLOSE all terminal windows" -ForegroundColor White
Write-Host "   2. Open a NEW Command Prompt" -ForegroundColor White
Write-Host "   3. Test with: java -version" -ForegroundColor White
Write-Host "   4. Test with: hadoop version" -ForegroundColor White
Write-Host ""
Write-Host "💡 TIP: Short path format (8.3) solves space issues!" -ForegroundColor Cyan
Write-Host "   Long:  $javaHomeLong" -ForegroundColor Gray
Write-Host "   Short: $javaHomeShort" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
