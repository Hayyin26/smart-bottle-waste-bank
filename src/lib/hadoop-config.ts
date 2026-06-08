/**
 * Hadoop Configuration
 * Konfigurasi koneksi ke Hadoop cluster
 */

export const hadoopConfig = {
  host: process.env.HADOOP_HOST || 'localhost',
  port: process.env.HADOOP_PORT || '9870',
  webhdfsPort: process.env.HADOOP_WEBHDFS_PORT || '9870',
  user: process.env.HADOOP_USER || 'hadoop',
  protocol: process.env.HADOOP_PROTOCOL || 'http',
}

/**
 * Get WebHDFS Base URL
 */
export const getWebHDFSUrl = () => {
  return `${hadoopConfig.protocol}://${hadoopConfig.host}:${hadoopConfig.webhdfsPort}/webhdfs/v1`
}

/**
 * HDFS Paths untuk IoT Data
 */
export const hdfsPaths = {
  iotData: '/iot-data',
  transactions: '/iot-data/transactions',
  devices: '/iot-data/devices',
  daily: '/iot-data/daily',
  monthly: '/iot-data/monthly',
  backup: '/iot-data/backup',
}

/**
 * Hadoop Status
 */
export const getHadoopStatus = () => {
  return `${hadoopConfig.protocol}://${hadoopConfig.host}:${hadoopConfig.port}`
}
