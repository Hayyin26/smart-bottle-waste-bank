'use client'

import { useEffect, useState } from 'react'
import Container from '@/components/container'
import { 
  Server, 
  HardDrive, 
  Folder, 
  File, 
  RefreshCw,
  ExternalLink,
  Database,
  Activity
} from 'lucide-react'

interface HadoopStatus {
  success: boolean
  status: 'online' | 'offline'
  nameNode?: {
    host: string
    port: string
    total: number
    used: number
    free: number
    percentUsed: number
    version: string
    live: Record<string, any>
    dead: Record<string, any>
  }
  webUI: string
  error?: string
  message?: string
}

interface HDFSFile {
  name: string
  type: 'FILE' | 'DIRECTORY'
  size: number
  modified: string
  owner: string
  permission: string
  replication: number
}

interface FilesResponse {
  success: boolean
  path: string
  files: HDFSFile[]
  count: number
}

export default function HadoopMonitoringPage() {
  const [status, setStatus] = useState<HadoopStatus | null>(null)
  const [files, setFiles] = useState<HDFSFile[]>([])
  const [currentPath, setCurrentPath] = useState('/iot-data')
  const [loading, setLoading] = useState(true)
  const [filesLoading, setFilesLoading] = useState(false)

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/hadoop/status')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error('Error fetching Hadoop status:', error)
      setStatus({
        success: false,
        status: 'offline',
        error: 'Network error',
        message: 'Cannot connect to server',
        webUI: 'http://localhost:9870'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchFiles = async (path: string) => {
    setFilesLoading(true)
    try {
      const response = await fetch(`/api/hadoop/files?path=${encodeURIComponent(path)}`)
      const data: FilesResponse = await response.json()
      if (data.success) {
        setFiles(data.files)
        setCurrentPath(path)
      }
    } catch (error) {
      console.error('Error fetching files:', error)
    } finally {
      setFilesLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    fetchFiles('/iot-data')
  }, [])

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading Hadoop Status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Container className="py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-600" />
              Hadoop Monitoring
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor Hadoop HDFS cluster and IoT data storage
            </p>
          </div>
          <button
            onClick={() => {
              fetchStatus()
              fetchFiles(currentPath)
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </Container>

      {/* Status Cards */}
      <Container className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cluster Status */}
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm dark:bg-slate-900">
            <div className="flex gap-3 mb-4">
              <Activity className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Cluster Status</h3>
            </div>
            <div className="space-y-2">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                status?.status === 'online' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }`}>
                <span className="w-2 h-2 rounded-full bg-current"></span>
                {status?.status === 'online' ? 'Online' : 'Offline'}
              </div>
              {status?.nameNode && (
                <>
                  <p className="text-sm text-muted-foreground">
                    <strong>Version:</strong> {status.nameNode.version}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Host:</strong> {status.nameNode.host}:{status.nameNode.port}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Live Nodes:</strong> {Object.keys(status.nameNode.live).length}
                  </p>
                </>
              )}
              {status?.error && (
                <p className="text-sm text-red-600 dark:text-red-400">{status.message}</p>
              )}
            </div>
          </div>

          {/* Storage Usage */}
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm dark:bg-slate-900">
            <div className="flex gap-3 mb-4">
              <HardDrive className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Storage Usage</h3>
            </div>
            {status?.nameNode ? (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Used</span>
                    <span className="font-semibold">
                      {status.nameNode.percentUsed.toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${status.nameNode.percentUsed}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p className="font-semibold">{formatBytes(status.nameNode.total)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Free</p>
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      {formatBytes(status.nameNode.free)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </div>

          {/* Web UI Access */}
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm dark:bg-slate-900">
            <div className="flex gap-3 mb-4">
              <Server className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Web UI</h3>
            </div>
            <div className="space-y-3">
              <a
                href={status?.webUI}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors dark:bg-blue-900 dark:text-blue-300"
              >
                <span>Open HDFS NameNode</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="http://localhost:8088"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors dark:bg-purple-900 dark:text-purple-300"
              >
                <span>Open YARN Manager</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </Container>

      {/* File Browser */}
      <Container className="py-4">
        <div className="rounded-lg border border-border bg-white shadow-sm dark:bg-slate-900">
          <div className="flex justify-between items-center p-6 border-b border-border">
            <div className="flex gap-3">
              <Folder className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold">HDFS File Browser</h3>
                <p className="text-sm text-muted-foreground">{currentPath}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fetchFiles('/')}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                Root
              </button>
              <button
                onClick={() => fetchFiles('/iot-data')}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                IoT Data
              </button>
            </div>
          </div>
          <div className="p-6">
            {filesLoading ? (
              <div className="flex justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading files...</p>
                </div>
              </div>
            ) : files.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 dark:border-gray-700">
                    <tr className="text-left">
                      <th className="pb-3 font-semibold">Name</th>
                      <th className="pb-3 font-semibold">Type</th>
                      <th className="pb-3 font-semibold">Size</th>
                      <th className="pb-3 font-semibold">Modified</th>
                      <th className="pb-3 font-semibold">Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors dark:border-gray-800 dark:hover:bg-gray-800"
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            {file.type === 'DIRECTORY' ? (
                              <Folder className="w-4 h-4 text-blue-600" />
                            ) : (
                              <File className="w-4 h-4 text-gray-500" />
                            )}
                            {file.type === 'DIRECTORY' ? (
                              <button
                                onClick={() => fetchFiles(`${currentPath}/${file.name}`)}
                                className="text-blue-600 hover:underline font-medium"
                              >
                                {file.name}
                              </button>
                            ) : (
                              <span className="font-medium">{file.name}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                            file.type === 'DIRECTORY' 
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {file.type}
                          </span>
                        </td>
                        <td className="py-3 text-sm">{formatBytes(file.size)}</td>
                        <td className="py-3 text-sm text-muted-foreground">
                          {formatDate(file.modified)}
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">{file.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Folder className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No files found in this directory</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
