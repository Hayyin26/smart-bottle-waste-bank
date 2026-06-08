/**
 * Scheduled Hadoop Sync Script
 * Run otomatis untuk backup data dari Supabase ke Hadoop
 * 
 * Run: npx tsx scripts/scheduled-hadoop-sync.ts
 */

import { createClient } from '@supabase/supabase-js'
import { hadoopClient } from '../src/lib/hadoop-client'
import { hdfsPaths } from '../src/lib/hadoop-config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

interface SyncResult {
  dataType: string
  recordCount: number
  hdfsPath: string
  success: boolean
  error?: string
}

async function syncDataToHadoop(
  dataType: string,
  timeRange: string = '24h'
): Promise<SyncResult> {
  try {
    console.log(`\n📊 Syncing ${dataType} (${timeRange})...`)

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
      case 'all':
        startDate = new Date('2000-01-01')
        break
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    }

    // Fetch data from Supabase
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
        const { data: devices, error } = await supabase.from('devices').select('*')

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
        throw new Error(`Unknown data type: ${dataType}`)
    }

    if (data.length === 0) {
      console.log(`  ⚠️  No data to sync for ${dataType}`)
      return {
        dataType,
        recordCount: 0,
        hdfsPath: '',
        success: true,
      }
    }

    // Ensure directory exists
    const dirExists = await hadoopClient.exists(hdfsBasePath)
    if (!dirExists) {
      await hadoopClient.createDirectory(hdfsBasePath)
    }

    // Prepare data
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

    // Upload to HDFS
    const timestamp = now.toISOString().replace(/[:.]/g, '-')
    const hdfsPath = `${hdfsBasePath}/${dataType}_${timestamp}.json`

    await hadoopClient.uploadFile('supabase-backup', hdfsPath, jsonData)

    console.log(
      `  ✓ Synced ${data.length} records to ${hdfsPath} (${(jsonData.length / 1024).toFixed(2)} KB)`
    )

    return {
      dataType,
      recordCount: data.length,
      hdfsPath,
      success: true,
    }
  } catch (error) {
    console.error(`  ✗ Failed to sync ${dataType}:`, error)
    return {
      dataType,
      recordCount: 0,
      hdfsPath: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

async function scheduledSync() {
  console.log('🐘 Starting Scheduled Hadoop Sync...')
  console.log(`⏰ Time: ${new Date().toLocaleString()}\n`)

  const results: SyncResult[] = []

  // Sync different data types
  results.push(await syncDataToHadoop('transactions', '24h'))
  results.push(await syncDataToHadoop('devices', 'all'))
  results.push(await syncDataToHadoop('iot_sessions', '24h'))

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 Sync Summary:')
  console.log('='.repeat(60))

  let totalRecords = 0
  let successCount = 0
  let failedCount = 0

  results.forEach((result) => {
    const status = result.success ? '✅' : '❌'
    console.log(`${status} ${result.dataType}: ${result.recordCount} records`)
    if (result.success) {
      totalRecords += result.recordCount
      successCount++
    } else {
      failedCount++
      console.log(`   Error: ${result.error}`)
    }
  })

  console.log('\n' + '-'.repeat(60))
  console.log(`Total records synced: ${totalRecords}`)
  console.log(`Success: ${successCount} | Failed: ${failedCount}`)
  console.log('='.repeat(60))

  if (failedCount > 0) {
    process.exit(1)
  }
}

// Run sync
scheduledSync().catch((error) => {
  console.error('❌ Scheduled sync failed:', error)
  process.exit(1)
})
