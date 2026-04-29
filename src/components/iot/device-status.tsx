"use client";

import { useState, useEffect } from 'react';
import { getDevices, type IoTDevice } from '@/services/iot-devices.service';
import { Wifi, WifiOff, MapPin } from 'lucide-react';

export default function DeviceStatus() {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchDevices, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchDevices() {
    setLoading(true);
    const data = await getDevices();
    setDevices(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Memuat status device...</p>
      </div>
    );
  }

  const activeDevices = devices.filter(d => d.is_active).length;
  const inactiveDevices = devices.length - activeDevices;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-white p-4 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Wifi className="text-green-600" size={20} />
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600">{activeDevices}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-white p-4 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <WifiOff className="text-gray-400" size={20} />
            <div>
              <p className="text-sm text-muted-foreground">Inactive</p>
              <p className="text-2xl font-bold text-gray-600">{inactiveDevices}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Device List */}
      <div className="space-y-2">
        {devices.map((device) => (
          <div
            key={device.device_id}
            className="rounded-lg border border-border bg-white p-4 hover:shadow-md transition-shadow dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {device.is_active ? (
                  <Wifi className="text-green-600" size={20} />
                ) : (
                  <WifiOff className="text-gray-400" size={20} />
                )}
                <div>
                  <h3 className="font-semibold">{device.device_id}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin size={14} />
                    <span>{device.location || 'Unknown Location'}</span>
                  </div>
                </div>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                  device.is_active
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                {device.is_active ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
