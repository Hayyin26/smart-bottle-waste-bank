/**
 * Test Hadoop Connection Script
 * Run: npx tsx scripts/test-hadoop-connection.ts
 */

import { hadoopClient } from '../src/lib/hadoop-client'
import { hdfsPaths } from '../src/lib/hadoop-config'

async function testHadoopConnection() {
  console.log('🐘 Testing Hadoop Connection...\n')

  try {
    // Test 1: List root directory
    console.log('📂 Test 1: List root directory')
    const rootFiles = await hadoopClient.listDirectory('/')
    console.log(`✓ Found ${rootFiles.length} items in root directory`)
    rootFiles.forEach((file) => {
      console.log(
        `  - ${file.pathSuffix} (${file.type}) - ${(file.length / 1024).toFixed(2)} KB`
      )
    })
    console.log('')

    // Test 2: Create test directory
    console.log('📁 Test 2: Create test directory')
    const testDir = '/test-iot-data'
    const dirExists = await hadoopClient.exists(testDir)

    if (dirExists) {
      console.log(`  Directory ${testDir} already exists`)
    } else {
      await hadoopClient.createDirectory(testDir)
      console.log(`✓ Created directory: ${testDir}`)
    }
    console.log('')

    // Test 3: Upload test file
    console.log('📤 Test 3: Upload test file')
    const testData = {
      test: 'IoT Hadoop Integration',
      timestamp: new Date().toISOString(),
      data: {
        device_id: 'ESP32-TEST-001',
        temperature: 25.5,
        bottles: [
          { type: 'small', count: 10 },
          { type: 'large', count: 5 },
        ],
      },
    }
    const jsonData = JSON.stringify(testData, null, 2)
    const testFilePath = `${testDir}/test-${Date.now()}.json`

    await hadoopClient.uploadFile('test', testFilePath, jsonData)
    console.log(`✓ Uploaded test file to: ${testFilePath}`)
    console.log('')

    // Test 4: Read back the file
    console.log('📥 Test 4: Read test file')
    const readData = await hadoopClient.readFile(testFilePath)
    const parsedData = JSON.parse(readData)
    console.log('✓ Successfully read file:')
    console.log(JSON.stringify(parsedData, null, 2))
    console.log('')

    // Test 5: Get file status
    console.log('ℹ️  Test 5: Get file status')
    const fileStatus = await hadoopClient.getFileStatus(testFilePath)
    console.log(`✓ File info:`)
    console.log(`  - Size: ${(fileStatus.length / 1024).toFixed(2)} KB`)
    console.log(`  - Owner: ${fileStatus.owner}`)
    console.log(`  - Permission: ${fileStatus.permission}`)
    console.log(
      `  - Modified: ${new Date(fileStatus.modificationTime).toLocaleString()}`
    )
    console.log('')

    // Test 6: List test directory
    console.log('📋 Test 6: List test directory')
    const testFiles = await hadoopClient.listDirectory(testDir)
    console.log(`✓ Found ${testFiles.length} files in ${testDir}:`)
    testFiles.forEach((file) => {
      console.log(
        `  - ${file.pathSuffix} - ${(file.length / 1024).toFixed(2)} KB`
      )
    })
    console.log('')

    // Test 7: Create IoT data directories
    console.log('📂 Test 7: Create IoT data structure')
    const directories = [
      hdfsPaths.iotData,
      hdfsPaths.transactions,
      hdfsPaths.devices,
      hdfsPaths.daily,
      hdfsPaths.monthly,
      hdfsPaths.backup,
    ]

    for (const dir of directories) {
      const exists = await hadoopClient.exists(dir)
      if (!exists) {
        await hadoopClient.createDirectory(dir)
        console.log(`✓ Created: ${dir}`)
      } else {
        console.log(`  ✓ Already exists: ${dir}`)
      }
    }
    console.log('')

    // Summary
    console.log('🎉 All tests passed!')
    console.log('\n✅ Hadoop is ready for IoT data integration')
    console.log('\nNext steps:')
    console.log('1. Start your Next.js app: npm run dev')
    console.log('2. Test sync API: POST http://localhost:3000/api/hadoop/sync')
    console.log('3. Check Hadoop UI: http://localhost:9870')
  } catch (error) {
    console.error('\n❌ Test failed:', error)
    console.error('\nTroubleshooting:')
    console.error('1. Check if Hadoop is running: jps')
    console.error('2. Check NameNode: http://localhost:9870')
    console.error('3. Verify .env configuration')
    console.error(
      '4. Check logs in C:\\hadoop-3.3.6\\logs\\hadoop-hadoop-namenode-*.log'
    )
    process.exit(1)
  }
}

// Run tests
testHadoopConnection()
