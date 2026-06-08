/**
 * Hadoop Client untuk operasi HDFS
 * Menggunakan WebHDFS REST API
 */

import axios, { AxiosError } from 'axios'
import { getWebHDFSUrl, hadoopConfig } from './hadoop-config'

export interface HDFSFileStatus {
  accessTime: number
  blockSize: number
  childrenNum?: number
  fileId: number
  group: string
  length: number
  modificationTime: number
  owner: string
  pathSuffix: string
  permission: string
  replication: number
  storagePolicy: number
  type: 'FILE' | 'DIRECTORY'
}

export interface HDFSListResult {
  FileStatuses: {
    FileStatus: HDFSFileStatus[]
  }
}

export class HadoopClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = getWebHDFSUrl()
  }

  /**
   * Upload file ke HDFS
   * @param localPath - Path lokal (untuk logging)
   * @param hdfsPath - Path di HDFS (misal: /iot-data/test.json)
   * @param data - Data string atau Buffer
   */
  async uploadFile(
    localPath: string,
    hdfsPath: string,
    data: string | Buffer
  ): Promise<{ success: boolean; path: string }> {
    try {
      console.log(`[Hadoop] Uploading to ${hdfsPath}...`)

      // Step 1: Create file dan dapatkan redirect URL
      const createUrl = `${this.baseUrl}${hdfsPath}?op=CREATE&user.name=${hadoopConfig.user}&overwrite=true`

      const redirectResponse = await axios.put(createUrl, null, {
        maxRedirects: 0,
        validateStatus: (status) => status === 307,
        timeout: 5000,
      })

      // Step 2: Upload data ke DataNode
      const uploadUrl = redirectResponse.headers.location
      if (!uploadUrl) {
        throw new Error('No redirect location received from NameNode')
      }

      await axios.put(uploadUrl, data, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        timeout: 30000,
      })

      console.log(`[Hadoop] ✓ Successfully uploaded to ${hdfsPath}`)
      return { success: true, path: hdfsPath }
    } catch (error) {
      console.error('[Hadoop] Upload error:', error)
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError
        throw new Error(
          `Hadoop upload failed: ${axiosError.message} (${axiosError.code})`
        )
      }
      throw error
    }
  }

  /**
   * Read file dari HDFS
   * @param hdfsPath - Path file di HDFS
   */
  async readFile(hdfsPath: string): Promise<string> {
    try {
      console.log(`[Hadoop] Reading ${hdfsPath}...`)

      const url = `${this.baseUrl}${hdfsPath}?op=OPEN&user.name=${hadoopConfig.user}`
      const response = await axios.get(url, {
        timeout: 30000,
      })

      console.log(`[Hadoop] ✓ Successfully read ${hdfsPath}`)
      return response.data
    } catch (error) {
      console.error('[Hadoop] Read error:', error)
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError
        throw new Error(
          `Hadoop read failed: ${axiosError.message} (${axiosError.code})`
        )
      }
      throw error
    }
  }

  /**
   * List directory contents
   * @param hdfsPath - Path directory di HDFS
   */
  async listDirectory(hdfsPath: string): Promise<HDFSFileStatus[]> {
    try {
      console.log(`[Hadoop] Listing directory ${hdfsPath}...`)

      const url = `${this.baseUrl}${hdfsPath}?op=LISTSTATUS&user.name=${hadoopConfig.user}`
      const response = await axios.get<HDFSListResult>(url, {
        timeout: 10000,
      })

      const files = response.data.FileStatuses.FileStatus
      console.log(`[Hadoop] ✓ Found ${files.length} items in ${hdfsPath}`)
      return files
    } catch (error) {
      console.error('[Hadoop] List error:', error)
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError
        if (axiosError.response?.status === 404) {
          return [] // Directory tidak ada, return empty array
        }
        throw new Error(
          `Hadoop list failed: ${axiosError.message} (${axiosError.code})`
        )
      }
      throw error
    }
  }

  /**
   * Delete file atau directory
   * @param hdfsPath - Path di HDFS
   * @param recursive - Recursive delete untuk directory
   */
  async deleteFile(
    hdfsPath: string,
    recursive: boolean = false
  ): Promise<{ success: boolean }> {
    try {
      console.log(`[Hadoop] Deleting ${hdfsPath}...`)

      const url = `${this.baseUrl}${hdfsPath}?op=DELETE&user.name=${hadoopConfig.user}&recursive=${recursive}`
      const response = await axios.delete(url, {
        timeout: 10000,
      })

      console.log(`[Hadoop] ✓ Successfully deleted ${hdfsPath}`)
      return { success: response.data.boolean }
    } catch (error) {
      console.error('[Hadoop] Delete error:', error)
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError
        throw new Error(
          `Hadoop delete failed: ${axiosError.message} (${axiosError.code})`
        )
      }
      throw error
    }
  }

  /**
   * Create directory di HDFS
   * @param hdfsPath - Path directory yang akan dibuat
   */
  async createDirectory(hdfsPath: string): Promise<{ success: boolean }> {
    try {
      console.log(`[Hadoop] Creating directory ${hdfsPath}...`)

      const url = `${this.baseUrl}${hdfsPath}?op=MKDIRS&user.name=${hadoopConfig.user}`
      const response = await axios.put(url, null, {
        timeout: 10000,
      })

      console.log(`[Hadoop] ✓ Successfully created directory ${hdfsPath}`)
      return { success: response.data.boolean }
    } catch (error) {
      console.error('[Hadoop] Create directory error:', error)
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError
        throw new Error(
          `Hadoop mkdir failed: ${axiosError.message} (${axiosError.code})`
        )
      }
      throw error
    }
  }

  /**
   * Check apakah file/directory exists
   * @param hdfsPath - Path yang akan dicek
   */
  async exists(hdfsPath: string): Promise<boolean> {
    try {
      const url = `${this.baseUrl}${hdfsPath}?op=GETFILESTATUS&user.name=${hadoopConfig.user}`
      await axios.get(url, {
        timeout: 5000,
      })
      return true
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false
      }
      throw error
    }
  }

  /**
   * Get file/directory status
   * @param hdfsPath - Path yang akan dicek
   */
  async getFileStatus(hdfsPath: string): Promise<HDFSFileStatus> {
    try {
      const url = `${this.baseUrl}${hdfsPath}?op=GETFILESTATUS&user.name=${hadoopConfig.user}`
      const response = await axios.get(url, {
        timeout: 5000,
      })
      return response.data.FileStatus
    } catch (error) {
      console.error('[Hadoop] Get file status error:', error)
      throw error
    }
  }
}

// Export singleton instance
export const hadoopClient = new HadoopClient()
