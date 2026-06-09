import { NextResponse } from 'next/server'
import { hadoopConfig } from '@/lib/hadoop-config'
import axios from 'axios'

export const dynamic = 'force-dynamic'

/**
 * GET /api/hadoop/status
 * Check Hadoop cluster status
 */
export async function GET() {
  try {
    const nameNodeUrl = `http://${hadoopConfig.host}:${hadoopConfig.port}/jmx?qry=Hadoop:service=NameNode,name=NameNodeInfo`
    
    const response = await axios.get(nameNodeUrl, {
      timeout: 5000,
    })

    const jmxData = response.data.beans[0]

    return NextResponse.json({
      success: true,
      status: 'online',
      nameNode: {
        host: hadoopConfig.host,
        port: hadoopConfig.port,
        live: jmxData.LiveNodes ? JSON.parse(jmxData.LiveNodes) : {},
        dead: jmxData.DeadNodes ? JSON.parse(jmxData.DeadNodes) : {},
        total: jmxData.Total || 0,
        used: jmxData.Used || 0,
        free: jmxData.Free || 0,
        percentUsed: jmxData.PercentUsed || 0,
        version: jmxData.Version || 'Unknown',
      },
      webUI: `http://${hadoopConfig.host}:${hadoopConfig.port}`,
    })
  } catch (error) {
    console.error('[Hadoop Status] Error:', error)
    
    return NextResponse.json({
      success: false,
      status: 'offline',
      error: 'Cannot connect to Hadoop NameNode',
      message: 'Make sure Hadoop services are running',
      webUI: `http://${hadoopConfig.host}:${hadoopConfig.port}`,
    }, { status: 503 })
  }
}
