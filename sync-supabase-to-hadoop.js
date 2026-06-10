#!/usr/bin/env node

/**
 * Sync Supabase Data to Hadoop HDFS
 * 
 * This script exports data from Supabase PostgreSQL to Hadoop HDFS
 * Run manually or schedule with cron/Task Scheduler
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const path = require('path');

const execPromise = util.promisify(exec);

// Load environment variables (optional - for local development only)
try {
  require('dotenv').config();
} catch (err) {
  // dotenv not installed - that's OK, will use system env vars
  console.log('[Info] dotenv not available, using system environment variables');
}

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for full access
);

// Configuration
const HADOOP_CONTAINER = 'hadoop-namenode';
const TEMP_DIR = './hadoop-data';
const HDFS_BASE_PATH = '/user/admin';

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

/**
 * Convert array of objects to CSV string
 */
function arrayToCSV(data, headers) {
  if (!data || data.length === 0) return headers.join(',') + '\n';
  
  const csvRows = [headers.join(',')];
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Escape commas and quotes in CSV
      if (value === null || value === undefined) return '';
      const escaped = String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

/**
 * Export transactions from Supabase
 */
async function exportTransactions() {
  console.log('[Transactions] Fetching from Supabase...');
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('[Transactions] Error:', error);
    return false;
  }
  
  console.log(`[Transactions] Found ${data.length} records`);
  
  // Convert to CSV
  const headers = ['id', 'user_id', 'device_id', 'bottle_size', 'points_earned', 'created_at'];
  const csv = arrayToCSV(data, headers);
  
  // Save to file
  const filename = `transactions_${Date.now()}.csv`;
  const filepath = path.join(TEMP_DIR, filename);
  fs.writeFileSync(filepath, csv);
  
  console.log(`[Transactions] Saved to ${filepath}`);
  return { filepath, filename, hdfsPath: `${HDFS_BASE_PATH}/transactions/${filename}` };
}

/**
 * Export users (profiles) from Supabase
 */
async function exportUsers() {
  console.log('[Users] Fetching from Supabase...');
  
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role, total_points, updated_at')
    .order('updated_at', { ascending: true });
  
  if (error) {
    console.error('[Users] Error:', error);
    return false;
  }
  
  console.log(`[Users] Found ${data.length} records`);
  
  // Convert to CSV
  const headers = ['id', 'full_name', 'role', 'total_points', 'updated_at'];
  const csv = arrayToCSV(data, headers);
  
  // Save to file
  const filename = `users_${Date.now()}.csv`;
  const filepath = path.join(TEMP_DIR, filename);
  fs.writeFileSync(filepath, csv);
  
  console.log(`[Users] Saved to ${filepath}`);
  return { filepath, filename, hdfsPath: `${HDFS_BASE_PATH}/users/${filename}` };
}

/**
 * Export IoT devices from Supabase
 */
async function exportDevices() {
  console.log('[Devices] Fetching from Supabase...');
  
  const { data, error } = await supabase
    .from('iot_devices')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('[Devices] Error:', error);
    return false;
  }
  
  console.log(`[Devices] Found ${data.length} records`);
  
  // Convert to CSV
  const headers = ['device_id', 'ip_address', 'last_seen', 'created_at'];
  const csv = arrayToCSV(data, headers);
  
  // Save to file
  const filename = `devices_${Date.now()}.csv`;
  const filepath = path.join(TEMP_DIR, filename);
  fs.writeFileSync(filepath, csv);
  
  console.log(`[Devices] Saved to ${filepath}`);
  return { filepath, filename, hdfsPath: `${HDFS_BASE_PATH}/devices/${filename}` };
}

/**
 * Check if Hadoop Docker container is running
 */
async function checkHadoopContainer() {
  try {
    const { stdout } = await execPromise(`docker ps --filter name=${HADOOP_CONTAINER} --format "{{.Names}}"`);
    return stdout.trim() === HADOOP_CONTAINER;
  } catch (error) {
    return false;
  }
}

/**
 * Upload file to Hadoop HDFS
 */
async function uploadToHDFS(localPath, hdfsPath) {
  console.log(`[HDFS] Uploading to ${hdfsPath}...`);
  
  try {
    // Create directory in HDFS if not exists
    const hdfsDir = path.dirname(hdfsPath);
    await execPromise(`docker exec ${HADOOP_CONTAINER} hdfs dfs -mkdir -p ${hdfsDir}`);
    
    // Copy file to container
    const containerTempPath = `/tmp/${path.basename(localPath)}`;
    await execPromise(`docker cp "${localPath}" ${HADOOP_CONTAINER}:${containerTempPath}`);
    
    // Move to HDFS
    await execPromise(`docker exec ${HADOOP_CONTAINER} hdfs dfs -put -f ${containerTempPath} ${hdfsPath}`);
    
    // Cleanup container temp file
    await execPromise(`docker exec ${HADOOP_CONTAINER} rm ${containerTempPath}`);
    
    console.log(`[HDFS] ✅ Upload successful: ${hdfsPath}`);
    return true;
  } catch (error) {
    console.error(`[HDFS] ❌ Upload failed:`, error.message);
    return false;
  }
}

/**
 * Verify file in HDFS
 */
async function verifyHDFS(hdfsPath) {
  try {
    const { stdout } = await execPromise(`docker exec ${HADOOP_CONTAINER} hdfs dfs -ls ${hdfsPath}`);
    return stdout.includes(path.basename(hdfsPath));
  } catch (error) {
    return false;
  }
}

/**
 * Main sync function
 */
async function main() {
  console.log('============================================');
  console.log('Supabase → Hadoop Sync');
  console.log('============================================');
  console.log('');
  
  // Check Hadoop
  console.log('[1/5] Checking Hadoop container...');
  const hadoopRunning = await checkHadoopContainer();
  
  if (!hadoopRunning) {
    console.error('❌ Hadoop container not running!');
    console.log('');
    console.log('Please start Hadoop first:');
    console.log('  .\\hadoop-docker-start.cmd');
    console.log('');
    process.exit(1);
  }
  
  console.log('✅ Hadoop is running');
  console.log('');
  
  // Export data from Supabase
  console.log('[2/5] Exporting data from Supabase...');
  const transactions = await exportTransactions();
  const users = await exportUsers();
  const devices = await exportDevices();
  console.log('');
  
  // Upload to Hadoop
  console.log('[3/5] Uploading to Hadoop HDFS...');
  const uploads = [];
  
  if (transactions) {
    uploads.push(uploadToHDFS(transactions.filepath, transactions.hdfsPath));
  }
  if (users) {
    uploads.push(uploadToHDFS(users.filepath, users.hdfsPath));
  }
  if (devices) {
    uploads.push(uploadToHDFS(devices.filepath, devices.hdfsPath));
  }
  
  await Promise.all(uploads);
  console.log('');
  
  // Verify uploads
  console.log('[4/5] Verifying uploads...');
  if (transactions) {
    const verified = await verifyHDFS(transactions.hdfsPath);
    console.log(`Transactions: ${verified ? '✅' : '❌'}`);
  }
  if (users) {
    const verified = await verifyHDFS(users.hdfsPath);
    console.log(`Users: ${verified ? '✅' : '❌'}`);
  }
  if (devices) {
    const verified = await verifyHDFS(devices.hdfsPath);
    console.log(`Devices: ${verified ? '✅' : '❌'}`);
  }
  console.log('');
  
  // Summary
  console.log('[5/5] Sync complete!');
  console.log('');
  console.log('============================================');
  console.log('View files in HDFS:');
  console.log('  http://localhost:9870');
  console.log('  Navigate to: Utilities > Browse the file system');
  console.log('  Path: /user/admin/');
  console.log('============================================');
  console.log('');
  
  // Cleanup local files (optional)
  // if (transactions) fs.unlinkSync(transactions.filepath);
  // if (users) fs.unlinkSync(users.filepath);
  // if (devices) fs.unlinkSync(devices.filepath);
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
