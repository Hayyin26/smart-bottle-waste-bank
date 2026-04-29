// This file is deprecated. Use src/services/nasabah.service.ts instead
// Data is now fetched from Supabase database

import type { WasteUser } from "@/types/types";

// Empty array - data should be fetched from Supabase
export const userList: WasteUser[] = [];

// Keep nasabahList for backward compatibility
export const nasabahList = userList;
