"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestConnectionPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnection();
  }, []);

  async function testConnection() {
    setLoading(true);
    const testResults: any = {};

    // Test 1: Check environment variables
    testResults.envVars = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'MISSING',
      keyExists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
    };

    // Test 2: Test profiles table
    try {
      const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      testResults.profiles = {
        success: !error,
        count: count,
        error: error ? JSON.stringify(error) : null,
      };
    } catch (err: any) {
      testResults.profiles = {
        success: false,
        error: err.message,
      };
    }

    // Test 3: Test iot_devices table
    try {
      const { data, error, count } = await supabase
        .from('iot_devices')
        .select('*', { count: 'exact', head: true });
      
      testResults.devices = {
        success: !error,
        count: count,
        error: error ? JSON.stringify(error) : null,
      };
    } catch (err: any) {
      testResults.devices = {
        success: false,
        error: err.message,
      };
    }

    // Test 4: Test transactions table
    try {
      const { data, error, count } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true });
      
      testResults.transactions = {
        success: !error,
        count: count,
        error: error ? JSON.stringify(error) : null,
      };
    } catch (err: any) {
      testResults.transactions = {
        success: false,
        error: err.message,
      };
    }

    // Test 5: Fetch sample data
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, total_points')
        .limit(3);
      
      testResults.sampleData = {
        success: !error,
        data: data,
        error: error ? JSON.stringify(error) : null,
      };
    } catch (err: any) {
      testResults.sampleData = {
        success: false,
        error: err.message,
      };
    }

    setResults(testResults);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Testing connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>

        {/* Environment Variables */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow">
          <h2 className="text-xl font-semibold mb-4">1. Environment Variables</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span>URL:</span>
              <span className={results.envVars?.url !== 'MISSING' ? 'text-green-600' : 'text-red-600'}>
                {results.envVars?.url}
              </span>
            </div>
            <div className="flex justify-between">
              <span>API Key Exists:</span>
              <span className={results.envVars?.keyExists ? 'text-green-600' : 'text-red-600'}>
                {results.envVars?.keyExists ? 'YES' : 'NO'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>API Key Length:</span>
              <span className={results.envVars?.keyLength > 100 ? 'text-green-600' : 'text-red-600'}>
                {results.envVars?.keyLength} characters
              </span>
            </div>
          </div>
        </div>

        {/* Profiles Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow">
          <h2 className="text-xl font-semibold mb-4">2. Profiles Table</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={results.profiles?.success ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {results.profiles?.success ? '✅ SUCCESS' : '❌ FAILED'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Count:</span>
              <span className="font-semibold">{results.profiles?.count ?? 'N/A'}</span>
            </div>
            {results.profiles?.error && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded text-red-600 text-sm">
                <strong>Error:</strong> {results.profiles.error}
              </div>
            )}
          </div>
        </div>

        {/* Devices Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow">
          <h2 className="text-xl font-semibold mb-4">3. IoT Devices Table</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={results.devices?.success ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {results.devices?.success ? '✅ SUCCESS' : '❌ FAILED'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Count:</span>
              <span className="font-semibold">{results.devices?.count ?? 'N/A'}</span>
            </div>
            {results.devices?.error && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded text-red-600 text-sm">
                <strong>Error:</strong> {results.devices.error}
              </div>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow">
          <h2 className="text-xl font-semibold mb-4">4. Transactions Table</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={results.transactions?.success ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {results.transactions?.success ? '✅ SUCCESS' : '❌ FAILED'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Count:</span>
              <span className="font-semibold">{results.transactions?.count ?? 'N/A'}</span>
            </div>
            {results.transactions?.error && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded text-red-600 text-sm">
                <strong>Error:</strong> {results.transactions.error}
              </div>
            )}
          </div>
        </div>

        {/* Sample Data */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow">
          <h2 className="text-xl font-semibold mb-4">5. Sample Data</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={results.sampleData?.success ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {results.sampleData?.success ? '✅ SUCCESS' : '❌ FAILED'}
              </span>
            </div>
            {results.sampleData?.success && results.sampleData?.data && (
              <div className="mt-4">
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(results.sampleData.data, null, 2)}
                </pre>
              </div>
            )}
            {results.sampleData?.error && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded text-red-600 text-sm">
                <strong>Error:</strong> {results.sampleData.error}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={testConnection}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Test Again
          </button>
          <a
            href="/dashboard"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
