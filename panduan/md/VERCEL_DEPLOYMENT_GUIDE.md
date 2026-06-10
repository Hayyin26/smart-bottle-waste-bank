# ✅ Vercel Deployment Guide - Build Fixed!

## ✨ Status: Ready to Deploy!

**Good news:** All build errors have been fixed! The local build succeeds:
```
✓ Compiled successfully
✓ Checking validity of types    
✓ Collecting page data    
✓ Generating static pages (25/25)
```

---

## 📋 Pre-Deployment Checklist

### 1. ✅ Code Issues - FIXED
- ✅ Missing `generateQrCode` function - **FIXED**
- ✅ Missing `@/lib/supabase/server` - **FIXED**
- ✅ Missing `@/lib/supabase/client` - **FIXED**
- ✅ Local build passes successfully

### 2. ⚠️ Environment Variables - ACTION REQUIRED

You MUST add these environment variables in Vercel Dashboard:

```env
# Required (from your .env file)
NEXT_PUBLIC_SUPABASE_URL=https://dsdtxqpzofrvzxpyktoo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZHR4cXB6b2Zydnp4cHlrdG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODUxODAsImV4cCI6MjA5Mjg2MTE4MH0.lX5Y9VvXpDhL2dkem4uRLDFL36CPmAGGCo7c3MxOeVk

# ⚠️ CRITICAL - Get the REAL key from Supabase Dashboard
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
```

**How to get SUPABASE_SERVICE_ROLE_KEY:**
1. Go to https://supabase.com/dashboard
2. Open your project: `dsdtxqpzofrvzxpyktoo`
3. Click **Settings** → **API**
4. Scroll to **Project API keys**
5. Copy the **`service_role`** key (NOT the anon key!)
6. Paste it in Vercel environment variables

---

## 🚀 Deployment Steps

### Step 1: Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these three variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **MUST BE REAL KEY!**

4. Select environment: **Production**, **Preview**, **Development** (all)
5. Click **Save**

### Step 2: Trigger New Deployment

**Option A: Redeploy from Vercel Dashboard**
1. Go to **Deployments** tab
2. Click the three dots (⋯) on the latest deployment
3. Click **Redeploy**
4. Select **Use existing build cache** (optional)
5. Click **Redeploy**

**Option B: Push New Commit**
```bash
git add .
git commit -m "fix: resolve build errors for deployment"
git push origin main
```

### Step 3: Monitor Deployment

Watch the build logs in Vercel. You should see:
```
✓ Compiled successfully
✓ Checking validity of types
✓ Collecting page data
✓ Generating static pages (25/25)
```

---

## 📱 Post-Deployment Tasks

### 1. Update ESP32 Code with Production URL

After successful deployment, you'll get a URL like: `https://your-app.vercel.app`

**Update in `IOT/PBL/src/main.cpp`:**

```cpp
// Change from local:
String api_get_user = "http://192.168.1.7:3000/api/iot/get-user";

// To production:
String api_get_user = "https://your-app.vercel.app/api/iot/get-user";
```

**⚠️ Important:** Keep both lines - use local for testing, production for deployment!

### 2. Test Production Site

1. Open your Vercel URL: `https://your-app.vercel.app`
2. Test login/register: Go to `/login`
3. Test IoT auth flow: Go to `/iot-auth`
4. Verify QR code generation works
5. Check dashboard: Go to `/dashboard`

### 3. Test IoT Integration

1. Upload updated ESP32 code with production URL
2. Open Serial Monitor to get ESP32 IP address
3. Visit production site: `https://your-app.vercel.app/iot-auth`
4. Login or register
5. Update ESP32 IP in the web UI (click Edit button)
6. Scan the QR code with your phone
7. Verify ESP32 receives the token

---

## 🐛 Troubleshooting

### Build Still Failing?

**Check build logs for:**
- Missing dependencies → Run `pnpm install`
- TypeScript errors → Run `pnpm run build` locally first
- Environment variables not set → Verify in Vercel Settings

### API Routes Return 500 Error?

**Most likely cause:** Missing `SUPABASE_SERVICE_ROLE_KEY`

**Fix:**
1. Go to Vercel → Settings → Environment Variables
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set with REAL key
3. Redeploy

### QR Code Not Working?

**Check:**
1. ESP32 IP is correct in web UI
2. ESP32 is connected to same network (if testing locally)
3. Production URL is correct (if using Vercel deployment)

---

## 📊 What Was Fixed?

### Error 1: `Cannot find name 'generateQrCode'`
**Location:** `src/app/(user)/iot-auth/page.tsx:47`

**Problem:** Function was called but never defined

**Solution:** Created `generateQrCode` helper function:
```typescript
const generateQrCode = async (token: string) => {
  const qrData = `http://${esp32Ip}/set-token?token=${token}&device=${deviceId}`;
  const qrImage = await QRCode.toDataURL(qrData, { width: 300, margin: 2 });
  setQrCodeUrl(qrImage);
};
```

### Error 2: `Cannot find module '@/lib/supabase/server'`
**Solution:** Created `src/lib/supabase/server.ts` with proper Supabase admin client

### Error 3: `Cannot find module '@/lib/supabase/client'`
**Solution:** Created `src/lib/supabase/client.ts` with proper Supabase browser client

---

## ✅ Next Steps

1. **NOW:** Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel environment variables
2. **NOW:** Redeploy to Vercel
3. **AFTER DEPLOYMENT:** Update ESP32 code with production URL
4. **TEST:** Verify everything works in production

---

## 📞 Need Help?

If deployment still fails:
1. Check Vercel build logs (copy full error message)
2. Verify all 3 environment variables are set correctly
3. Make sure `SUPABASE_SERVICE_ROLE_KEY` is the REAL key from Supabase Dashboard

**Quick test locally:**
```bash
pnpm run build
```
If this fails, fix errors locally first before deploying to Vercel.

---

**Status:** ✅ Ready to deploy!  
**Last Updated:** Build errors fixed, local build passes  
**Action Required:** Add environment variables in Vercel and redeploy
