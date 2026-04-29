# Pages Fixed - Users, Transaksi, and Laporan

## Problem
Three pages were not working because they were trying to query tables that don't exist in your Supabase database:
- `/nasabah` (Users page) - was querying `nasabah` table
- `/transaksi` (Transactions page) - was querying `transaksi_sampah` table  
- `/laporan` (Reports page) - was using empty dummy data arrays

## Your Actual Database Schema
Your Supabase database has these tables:
- `profiles` (user profiles linked to auth.users)
- `transactions` (IoT transaction records)
- `iot_devices` (IoT device information)

## What Was Fixed

### 1. Fixed `src/services/nasabah.service.ts`
**Changed from:** Querying `nasabah` table  
**Changed to:** Querying `profiles` table

**Key changes:**
- `getNasabahList()` - Now fetches from `profiles` table and counts transactions per user
- `getNasabahById()` - Fetches profile and counts user's transactions
- `updateNasabah()` - Updates `profiles` table (only name and points)
- `createNasabah()` - Disabled (profiles are auto-created by auth trigger)
- `deleteNasabah()` - Disabled (cannot delete profiles without deleting auth user)

**Field mapping:**
- `full_name` → `nama`
- `total_points` → `saldoPoint`
- Transaction count calculated from `transactions` table
- Email, phone, address not available (not in profiles table)

### 2. Fixed `src/services/transaksi.service.ts`
**Changed from:** Querying `transaksi_sampah` table  
**Changed to:** Querying `transactions` table

**Key changes:**
- `getTransaksiList()` - Fetches from `transactions` table and enriches with user names
- `getTransaksiByUserId()` - Fetches user's transactions from `transactions` table
- `createTransaksi()` - Creates transaction in `transactions` table (simplified)
- `updateTransaksi()` - Updates transaction in `transactions` table
- `deleteTransaksi()` - Deletes from `transactions` table

**Field mapping:**
- `points_earned` → `nilaiTukar`
- `created_at` → `tanggal` and `waktu`
- Default values for fields not in transactions table:
  - `jenisAmpah` = "Sampah Umum"
  - `berat` = 1 kg
  - `status` = "selesai"

### 3. Fixed `src/app/laporan/page.tsx`
**Changed from:** Using empty dummy data arrays  
**Changed to:** Fetching real data from services

**Key changes:**
- Added `useState` and `useEffect` to fetch data
- Calls `getNasabahList()` and `getTransaksiList()` on page load
- Added loading state with spinner
- All statistics now calculated from real database data

## How to Test

1. Make sure your dev server is running:
   ```bash
   npm run dev
   ```

2. Navigate to each page:
   - http://localhost:3000/nasabah - Should show users from `profiles` table
   - http://localhost:3000/transaksi - Should show transactions from `transactions` table
   - http://localhost:3000/laporan - Should show reports with real statistics

3. If pages are empty:
   - Make sure you have users created in Supabase Authentication
   - Make sure test data was inserted (run `test-data.sql`)
   - Check browser console for any errors

## Notes

- The pages now work with your actual IoT database schema
- Some fields (email, phone, address) are not available because they're not in the `profiles` table
- Transactions are simplified because the `transactions` table doesn't have waste type, weight, etc.
- If you need more detailed transaction data, you'll need to add columns to the `transactions` table

## Next Steps

If you want to add more fields to track:
1. Add columns to `transactions` table (e.g., `waste_type`, `weight_kg`)
2. Update the services to use these new columns
3. Update the IoT system to send this data when creating transactions
