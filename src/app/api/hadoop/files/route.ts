import { NextRequest, NextResponse } from 'next/server'
import { hadoopClient } from '@/lib/hadoop-client'

export const dynamic = 'force-dynamic'

/**
 * GET /api/hadoop/files?path=/iot-data
 * List files in HDFS directory
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const path = searchParams.get('path') || '/'

    const files = await hadoopClient.listDirectory(path)

    return NextResponse.json({
      success: true,
      path,
      files: files.map((file) => ({
        name: file.pathSuffix,
        type: file.type,
        size: file.length,
        modified: new Date(file.modificationTime).toISOString(),
        owner: file.owner,
        group: file.group,
        permission: file.permission,
        replication: file.replication,
      })),
      count: files.length,
    })
  } catch (error) {
    console.error('[Hadoop Files] Error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to list files',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
