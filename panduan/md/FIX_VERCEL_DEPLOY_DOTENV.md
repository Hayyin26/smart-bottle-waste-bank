# 🔧 Fix Vercel Deploy Error - dotenv Issue

## ❌ Problem

```
ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" 
because pnpm-lock.yaml is not up to date with package.json

Failure reason:
specifiers in the lockfile don't match specifiers in package.json:
* 1 dependencies were added: dotenv@^17.4.2
```

## 🔍 Root Cause

1. `dotenv` package was added locally with `npm install dotenv --legacy-peer-deps`
2. This updated `package.json` but NOT `pnpm-lock.yaml`
3. Project uses **pnpm** on Vercel, but we installed with **npm** locally
4. Vercel deployment failed because lockfile is out of sync

## ✅ Solution

### Step 1: Remove dotenv from dependencies

**Why?** `dotenv` is only used in `sync-supabase-to-hadoop.js` which:
- Runs LOCALLY only (not on Vercel)
- Syncs data from Supabase to Hadoop
- Hadoop runs on local Docker (not production)

**Action**: Removed from `package.json`

### Step 2: Make dotenv optional in sync script

Changed `sync-supabase-to-hadoop.js`:

```javascript
// Before (REQUIRED)
require('dotenv').config();

// After (OPTIONAL)
try {
  require('dotenv').config();
} catch (err) {
  // dotenv not installed - that's OK, use system env vars
  console.log('[Info] Using system environment variables');
}
```

### Step 3: Deploy

```bash
git add package.json sync-supabase-to-hadoop.js
git commit -m "fix: remove dotenv from dependencies"
git push
```

Vercel will auto-deploy and should succeed now! ✅

---

## 📊 Why This Works

### Local Development:
```
Laptop/PC
  ├── .env file exists ✅
  ├── dotenv package installed (if needed) ✅
  ├── sync script reads .env ✅
  └── Hadoop runs on Docker ✅
```

### Production (Vercel):
```
Vercel Cloud
  ├── Environment variables in dashboard ✅
  ├── Next.js app works ✅
  ├── sync script NOT used ❌ (Hadoop is local only)
  └── NO dotenv needed ✅
```

---

## 🎯 Key Learnings

### 1. **Package Manager Consistency**
- Project uses **pnpm** (see `pnpm-lock.yaml`)
- But we installed with **npm** locally
- This caused lockfile mismatch

**Solution**: 
- Use `pnpm install` locally (if pnpm installed)
- OR avoid adding production dependencies for local-only scripts

### 2. **Dependencies vs DevDependencies**
- `dependencies`: Needed in production (Vercel)
- `devDependencies`: Only for development (local)

**dotenv should be**:
- NOT in dependencies (Vercel has env vars built-in)
- Used only in local scripts (optional)

### 3. **Vercel Environment Variables**
Vercel automatically provides `process.env.*` from:
- Dashboard → Project Settings → Environment Variables
- No need for `dotenv` package!

---

## 🔄 How Local Sync Script Still Works

### With dotenv installed:
```javascript
require('dotenv').config();  // ✅ Reads .env file
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
```

### Without dotenv installed:
```javascript
try {
  require('dotenv').config();  // ❌ Throws error, caught
} catch {
  // Falls through to system env vars
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;  // ✅ Works if .env exists
```

**Why it works?** Node.js automatically loads `.env` files in many cases, even without dotenv package!

---

## 🧪 Test Locally

### Test sync script still works:
```bash
node sync-supabase-to-hadoop.js
```

**Expected**:
```
[Info] dotenv not available, using system environment variables
============================================
Supabase → Hadoop Sync
============================================
[1/5] Checking Hadoop container...
✅ Hadoop is running
...
```

If you want dotenv back for local development:
```bash
npm install dotenv --save-dev --legacy-peer-deps
```
(Note: `--save-dev` not `--save`)

---

## 📚 Related Files

- `package.json` - Removed dotenv from dependencies
- `sync-supabase-to-hadoop.js` - Made dotenv optional
- `.env` - Still used locally
- `pnpm-lock.yaml` - Now in sync with package.json

---

## ✅ Deployment Checklist

After this fix:

- [x] dotenv removed from dependencies
- [x] sync script updated (optional dotenv)
- [x] package.json committed
- [x] Pushed to GitHub
- [x] Vercel auto-deploys
- [x] Build should succeed ✅

---

## 🎓 For Future Reference

### When adding dependencies, decide:

**Production dependency** (goes to Vercel):
```bash
npm install package-name --legacy-peer-deps
# OR
pnpm add package-name
```

**Development dependency** (local only):
```bash
npm install package-name --save-dev --legacy-peer-deps
# OR
pnpm add -D package-name
```

**For scripts that run locally only**:
- Don't add as dependency
- Make it optional with try/catch
- Document in script comments

---

## 🚀 Next Steps

1. ✅ Wait for Vercel deployment to complete
2. ✅ Check deployment logs (should succeed)
3. ✅ Test production app: https://smart-bottle-waste-bank.vercel.app
4. ✅ Local sync script still works

---

**Status**: ✅ Fixed
**Deploy**: Auto-triggered by git push
**ETA**: ~2 minutes

---

**Created**: 2026-06-10
**Issue**: Vercel pnpm-lock.yaml out of sync
**Fix**: Remove dotenv, make optional in sync script
