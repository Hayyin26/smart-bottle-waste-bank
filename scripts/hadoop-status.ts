/**
 * Hadoop Status Checker
 * Check Hadoop health and connection status
 * Run: npx tsx scripts/hadoop-status.ts
 */

import { hadoopClient } from '../src/lib/hadoop-client'
import { getHadoopStatus, hdfsPaths } from '../src/lib/hadoop-config'
import axios from 'axios'

async function checkHadoopStatus() {
  console.log('🐘 Hadoop Status Checker\n')
  console.log('='.repeat(60))

  // 1. Check NameNode Web UI
  console.log('📡 Checking NameNode Web UI...')
  try {
    const response = await axios.get(getHadoopStatus(), { timeout: 5000 })
    if (response.status === 200) {
      console.log('  ✅ NameNode is running')
      console.log(`  🌐 Web UI: ${getHadoopStatus()}`)
    }
  } catch (error) {
    console.log('  ❌ NameNode is NOT running')
    console.log('  💡 Start Hadoop: cd C:\\hadoop-3.3.6\\sbin && start-dfs.cmd')
    process.exit(1)
  }

  // 2. Check WebHDFS API
  console.log('\n📂 Checking WebHDFS API...')
  try {
    const files = await hadoopClient.listDirectory('/')
    console.log(`  ✅ WebHDFS is accessible`)
    console.log(`  📊 Files in root: ${files.length}`)
  } catch (error) {
    console.log('  ❌ WebHDFS is not accessible')
    console.log('  Error:', error instanceof Error ? error.message : error)
    process.exit(1)
  }

  // 3. Check IoT data directories
  console.log('\n📁 Checking IoT Data Directories...')
  const directories = Object.entries(hdfsPaths)

  for (const [name, path] of directories) {
    try {
      const exists = await hadoopClient.exists(path)
      if (exists) {
        const files = await hadoopClient.listDirectory(path)
        console.log(`  ✅ ${name.padEnd(15)}: ${path} (${files.length} files)`)
      } else {
        console.log(`  ⚠️  ${name.padEnd(15)}: ${path} (not created yet)`)
      }
    } catch (error) {
      console.log(`  ❌ ${name.padEnd(15)}: ${path} (error)`)
    }
  }

  // 4. Calculate total storage
  console.log('\n💾 Storage Summary...')
  try {
    const allFiles = await hadoopClient.listDirectory('/iot-data')
    let totalSize = 0
    let fileCount = 0

    const calculateSize = async (path: string) => {
      const files = await hadoopClient.listDirectory(path)
      for (const file of files) {
        if (file.type === 'FILE') {
          totalSize += file.length
          fileCount++
        } else if (file.type === 'DIRECTORY') {
          await calculateSize(`${path}/${file.pathSuffix}`)
        }
      }
    }

    await calculateSize('/iot-data')

    console.log(`  📊 Total files: ${fileCount}`)
    console.log(`  💾 Total size: ${(totalSize / 1024).toFixed(2)} KB`)
    console.log(`  💾 Total size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`)
  } catch (error) {
    console.log('  ⚠️  No data yet in /iot-data')
  }

  // 5. Recent files
  console.log('\n📄 Recent Files (Last 5)...')
  try {
    const transactions = await hadoopClient.listDirectory(
      hdfsPaths.transactions
    )
    const sorted = transactions
      .filter((f) => f.type === 'FILE')
      .sort((a, b) => b.modificationTime - a.modificationTime)
      .slice(0, 5)

    if (sorted.length > 0) {
      sorted.forEach((file) => {
        const date = new Date(file.modificationTime).toLocaleString()
        const sizeMB = (file.length / (1024 * 1024)).toFixed(2)
        console.log(`  📄 ${file.pathSuffix}`)
        console.log(`     └─ ${sizeMB} MB | ${date}`)
      })
    } else {
      console.log('  ⚠️  No transaction files yet')
    }
  } catch (error) {
    console.log('  ⚠️  Transactions directory not found')
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('✅ Hadoop Status: HEALTHY')
  console.log('='.repeat(60))
  console.log('\n🎯 Next actions:')
  console.log('  • Sync data: curl -X POST http://localhost:3000/api/hadoop/sync')
  console.log('  • Run backup: npx tsx scripts/scheduled-hadoop-sync.ts')
  console.log('  • View UI: http://localhost:9870')
  console.log('')
}

// Run check
checkHadoopStatus().catch((error) => {
  console.error('\n❌ Status check failed:', error)
  process.exit(1)
})
