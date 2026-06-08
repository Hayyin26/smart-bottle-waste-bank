/**
 * API Route: List files di Hadoop HDFS
 * GET /api/hadoop/list?path=/iot-data
 */

import { NextRequest, NextResponse } from 'next/server'
import { hadoopClient } from '@/lib/hadoop-client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const path = searchParams.get('path') || '/'

    console.log(`[Hadoop List] Listing directory: ${path}`)

    const files = await hadoopClient.listDirectory(path)

    // Format response
    const formattedFiles = files.map((file) => ({
      name: file.pathSuffix,
      type: file.type,
      size: file.length,
      sizeMB: (file.length / (1024 * 1024)).toFixed(2),
      modified: new Date(file.modificationTime).toISOString(),
      owner: file.owner,
      group: file.group,
      permission: file.permission,
      replication: file.replication,
    }))

    return NextResponse.json({
      success: true,
      path,
      fileCount: files.length,
      files: formattedFiles,
    })
  } catch (error) {
    console.error('[Hadoop List] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
