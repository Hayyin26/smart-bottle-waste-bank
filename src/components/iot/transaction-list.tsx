"use client";

import { useState, useEffect } from 'react';
import { getRecentTransactions, type Transaction } from '@/services/transactions.service';
import { supabase } from '@/lib/supabase';
import { Clock, MapPin, Award } from 'lucide-react';

interface TransactionListProps {
  limit?: number;
  userId?: string;
  deviceId?: string;
}

export default function TransactionList({ limit = 10, userId, deviceId }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
        },
        (payload) => {
          console.log('Transaction change detected:', payload);
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId, deviceId, limit]);

  async function fetchTransactions() {
    setLoading(true);
    const data = await getRecentTransactions(limit);
    setTransactions(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Memuat transaksi...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Belum ada transaksi
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="rounded-lg border border-border bg-white p-4 hover:shadow-md transition-shadow dark:bg-slate-900"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{transaction.user_name}</h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                  <Award size={12} />
                  +{transaction.points_earned} points
                </span>
              </div>
              
              <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{transaction.device_location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>
                    {new Date(transaction.created_at).toLocaleString('id-ID', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
