/**
 * API Route: Sync data dari Supabase ke Hadoop
 * POST /api/hadoop/sync
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { hadoopClient } from '@/lib/hadoop-client'
import { hdfsPaths } from '@/lib/hadoop-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dataType = 'transactions', timeRange = '24h' } = body

    console.log(`[Hadoop Sync] Starting sync for ${dataType} (${timeRange})`)

    const supabase = await createClient()

    // Calculate time range
    const now = new Date()
    let startDate = new Date()

    switch (timeRange) {
      case '1h':
        startDate = new Date(now.getTime() - 60 * 60 * 1000)
        break
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'all':
        startDate = new Date('2000-01-01')
        break
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    }

    // Ambil data sesuai type
    let data: any[] = []
    let hdfsBasePath = ''

    switch (dataType) {
      case 'transactions': {
        const { data: transactions, error } = await supabase
          .from('transactions')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: false })

        if (error) throw error
        data = transactions || []
        hdfsBasePath = hdfsPaths.transactions
        break
      }

      case 'devices': {
        const { data: devices, error } = await supabase
          .from('devices')
          .select('*')

        if (error) throw error
        data = devices || []
        hdfsBasePath = hdfsPaths.devices
        break
      }

      case 'iot_sessions': {
        const { data: sessions, error } = await supabase
          .from('iot_sessions')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .order('created_at', { ascending: false })

        if (error) throw error
        data = sessions || []
        hdfsBasePath = hdfsPaths.iotData + '/sessions'
        break
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown data type: ${dataType}` },
          { status: 400 }
        )
    }

    if (data.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No data to sync',
        recordCount: 0,
      })
    }

    // Ensure base directory exists
    const dirExists = await hadoopClient.exists(hdfsBasePath)
    if (!dirExists) {
      await hadoopClient.createDirectory(hdfsBasePath)
    }

    // Prepare data dengan metadata
    const syncData = {
      metadata: {
        syncTime: now.toISOString(),
        dataType,
        timeRange,
        recordCount: data.length,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
      },
      data,
    }

    const jsonData = JSON.stringify(syncData, null, 2)

    // Generate filename dengan timestamp
    const timestamp = now.toISOString().replace(/[:.]/g, '-')
    const hdfsPath = `${hdfsBasePath}/${dataType}_${timestamp}.json`

    // Upload ke HDFS
    await hadoopClient.uploadFile('supabase-export', hdfsPath, jsonData)

    console.log(
      `[Hadoop Sync] ✓ Successfully synced ${data.length} records to ${hdfsPath}`
    )

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${data.length} ${dataType} records to Hadoop`,
      hdfsPath,
      recordCount: data.length,
      syncTime: now.toISOString(),
    })
  } catch (error) {
    console.error('[Hadoop Sync] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET: Check Hadoop connection status
 */
export async function GET() {
  try {
    // Test connection dengan list root directory
    const files = await hadoopClient.listDirectory('/')

    return NextResponse.json({
      success: true,
      message: 'Hadoop connection OK',
      filesInRoot: files.length,
      files: files.map((f) => ({
        name: f.pathSuffix,
        type: f.type,
        size: f.length,
      })),
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      },
      { status: 500 }
    )
  }
}
