/**
 * API Route: Read file dari Hadoop HDFS
 * GET /api/hadoop/read?path=/iot-data/test.json
 */

import { NextRequest, NextResponse } from 'next/server'
import { hadoopClient } from '@/lib/hadoop-client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json(
        { success: false, error: 'Path parameter is required' },
        { status: 400 }
      )
    }

    console.log(`[Hadoop Read] Reading file: ${path}`)

    const content = await hadoopClient.readFile(path)

    // Try to parse as JSON
    let parsedContent
    try {
      parsedContent = JSON.parse(content)
    } catch {
      parsedContent = content // Return as string if not JSON
    }

    return NextResponse.json({
      success: true,
      path,
      content: parsedContent,
    })
  } catch (error) {
    console.error('[Hadoop Read] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
