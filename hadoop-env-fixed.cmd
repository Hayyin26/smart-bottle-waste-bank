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

@rem The java implementation to use.
set JAVA_HOME=C:\PROGRA~1\ECLIPS~1\jdk-11~1.11-

@rem The jsvc implementation to use. Jsvc is required to run secure datanodes
@rem that bind to privileged ports to provide authentication of data transfer
@rem protocol.  Jsvc is not required if SASL is configured for authentication of
@rem data transfer protocol using non-privileged ports.
@rem set JSVC_HOME=%JSVC_HOME%

set HADOOP_CONF_DIR=%HADOOP_CONF_DIR%

@rem Extra Java CLASSPATH elements.  Automatically insert capacity-scheduler.
for %%i in (%HADOOP_HOME%\share\hadoop\tools\lib\*.jar) do (
  if not defined HADOOP_CLASSPATH (
    set HADOOP_CLASSPATH=%%i
  ) else (
    set HADOOP_CLASSPATH=!HADOOP_CLASSPATH!;%%i
  )
)

@rem The maximum amount of heap to use, in MB. Default is 1000.
@rem set HADOOP_HEAPSIZE=
@rem set HADOOP_NAMENODE_INIT_HEAPSIZE=""

@rem Extra Java runtime options.  Empty by default.
@rem export HADOOP_OPTS="$HADOOP_OPTS -Djava.net.preferIPv4Stack=true"

@rem Command specific options appended to HADOOP_OPTS when specified
set HADOOP_NAMENODE_OPTS=-Xmx512m %HADOOP_NAMENODE_OPTS%
set HADOOP_DATANODE_OPTS=-Xmx512m %HADOOP_DATANODE_OPTS%
set HADOOP_SECONDARYNAMENODE_OPTS=-Xmx512m %HADOOP_SECONDARYNAMENODE_OPTS%
set HADOOP_CLIENT_OPTS=-Xmx512m %HADOOP_CLIENT_OPTS%

@rem The following applies to multiple commands (fs, dfs, fsck, distcp etc)
set HADOOP_CLIENT_OPTS=%HADOOP_CLIENT_OPTS%

@rem On secure datanodes, user to run the datanode as after dropping privileges.
@rem This **MUST** be uncommented to enable secure HDFS if using privileged ports
@rem to provide authentication of data transfer protocol.  This **MUST** be set
@rem to root when secure datanodes are used to ensure that SASL can work
@rem properly to authenticate and authorize requests.
@rem set HADOOP_SECURE_DN_USER=%HADOOP_SECURE_DN_USER%

@rem Where log files are stored.  %HADOOP_HOME%\logs by default.
@rem set HADOOP_LOG_DIR=%HADOOP_LOG_DIR%\%USERNAME%

@rem Where log files are stored in the secure data environment.
@rem set HADOOP_SECURE_DN_LOG_DIR=%HADOOP_LOG_DIR%\%HADOOP_HDFS_USER%

@rem The directory where pid files are stored. /tmp by default.
@rem set HADOOP_PID_DIR=%HADOOP_PID_DIR%
@rem set HADOOP_SECURE_DN_PID_DIR=%HADOOP_PID_DIR%

@rem A string representing this instance of hadoop. %USERNAME% by default.
@rem set HADOOP_IDENT_STRING=%USERNAME%
