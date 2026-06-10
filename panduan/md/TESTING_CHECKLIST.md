# ✅ Unit Testing Checklist & Quick Reference

## 🎯 Pre-Testing Setup

### Installation Checklist

- [ ] Navigate to project root directory
- [ ] Run `pnpm install` (or `npm install`)
- [ ] Wait for all dependencies to install (including Jest and Testing Library)
- [ ] Verify installation: `pnpm test -- --version`

### Configuration Verification

- [ ] Check `jest.config.js` exists in project root
- [ ] Check `jest.setup.js` exists in project root
- [ ] Verify `package.json` has test scripts
- [ ] Verify `tsconfig.json` has path aliases

---

## 📋 Test Files Quick Reference

### ✅ Utilities Layer
- [ ] `src/utils/__tests__/bottle-classifier.test.ts` - 50+ tests
- [ ] `src/lib/__tests__/utils.test.ts` - 40+ tests

### ✅ Authentication Layer  
- [ ] `src/lib/__tests__/auth.test.ts` - 20+ tests
- [ ] `src/hooks/__tests__/use-auth.test.tsx` - 25+ tests

### ✅ Services Layer
- [ ] `src/services/__tests__/nasabah.service.test.ts` - 25+ tests
- [ ] `src/services/__tests__/transactions.service.test.ts` - 30+ tests
- [ ] `src/services/__tests__/iot-devices.service.test.ts` - 25+ tests

---

## 🚀 Running Tests

### Single Commands

```bash
# Run all tests
pnpm test

# Run with watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage

# Debug tests
pnpm test:debug
```

### Specific Test Runs

```bash
# Run specific file
pnpm test -- bottle-classifier.test.ts

# Run specific test by name
pnpm test -- --testNamePattern="classifyBottle"

# Run tests in specific directory
pnpm test -- src/utils/__tests__

# Run with verbose output
pnpm test -- --verbose

# Run and clear cache
pnpm test -- --clearCache
```

---

## 📊 What Each Test File Covers

### 1. Bottle Classifier Tests
**File:** `src/utils/__tests__/bottle-classifier.test.ts`

**What's tested:**
```
✅ BOTTLE_CATEGORIES constant
✅ isValidBottleWeight() function
   - Valid weights for all categories
   - Invalid weights
   - Boundary conditions
   - Error cases
✅ classifyBottle() function
   - KECIL category (12.5-18g)
   - SEDANG category (20-23g)
   - BESAR category (25-28g)
   - Out of range weights
   - Invalid inputs (null, negative, string)
   - Error message formatting
```

**Run:** `pnpm test -- bottle-classifier`

---

### 2. Lib Utils Tests
**File:** `src/lib/__tests__/utils.test.ts`

**What's tested:**
```
✅ cn() function
   - Simple class merging
   - Conditional classes
   - Arrays of classes
   - Null/undefined handling
   - Tailwind override handling
✅ addThousandsSeparator() function
   - Numbers >= 1000
   - Multiple separators
   - Negative numbers
   - Decimal numbers
   - Large numbers
✅ numberToPercentage() function
   - Basic conversion (0.5 → 50%)
   - Boundaries (0 → 0%, 1 → 100%)
   - Decimal percentages
   - Negative numbers
   - Large multipliers
```

**Run:** `pnpm test -- utils.test.ts`

---

### 3. Auth Service Tests
**File:** `src/lib/__tests__/auth.test.ts`

**What's tested:**
```
✅ signInWithEmail() function
   - Successful login
   - Invalid credentials
   - Error message formatting
   - Parameter passing
   - Network errors
✅ signOut() function
   - Successful logout
   - Logout failure handling
✅ getCurrentUser() function
   - Return current user
   - Null when no user
   - Token errors
   - Error handling
```

**Run:** `pnpm test -- auth.test.ts`

---

### 4. useAuth Hook Tests
**File:** `src/hooks/__tests__/use-auth.test.tsx`

**What's tested:**
```
✅ Initial state setup
✅ Session fetching
   - User from session
   - Profile fetching
   - No session handling
✅ Auth state changes
   - SIGNED_IN event
   - SIGNED_OUT event
   - PASSWORD_RECOVERY event
✅ Error handling
   - Session fetch errors
   - Profile fetch errors
✅ Loading state management
✅ Subscription cleanup
```

**Run:** `pnpm test -- use-auth`

---

### 5. Nasabah Service Tests
**File:** `src/services/__tests__/nasabah.service.test.ts`

**What's tested:**
```
✅ getNasabahList() function
   - Fetch all members
   - Handle errors
   - Transaction counting
   - Data mapping
✅ getNasabahById() function
   - Fetch member by ID
   - Handle not found
   - Transaction counting
✅ updateNasabah() function
   - Update member data
   - Update name
   - Update points
   - Error handling
```

**Run:** `pnpm test -- nasabah`

---

### 6. Transactions Service Tests
**File:** `src/services/__tests__/transactions.service.test.ts`

**What's tested:**
```
✅ getTransactions() function
   - Fetch all transactions
   - Data enrichment (user + device)
   - Handle missing user profile
   - Handle missing device data
   - Handle null user/device IDs
✅ getTransactionsByUserId() function
   - Fetch user transactions
   - Filter by user ID
   - Order by created_at
   - Handle errors
✅ Transaction interface validation
```

**Run:** `pnpm test -- transactions`

---

### 7. IoT Devices Service Tests
**File:** `src/services/__tests__/iot-devices.service.test.ts`

**What's tested:**
```
✅ getDevices() function
   - Fetch all devices
   - Include active and inactive
   - Order by created_at
   - Error handling
✅ getActiveDevices() function
   - Fetch active devices only
   - Filter by is_active=true
   - Order correctly
   - Handle errors
✅ IoTDevice interface validation
✅ Null location handling
```

**Run:** `pnpm test -- iot-devices`

---

## 🔍 Coverage Verification

### Check Coverage For Specific Files

```bash
# All coverage
pnpm test:coverage

# Specific test coverage
pnpm test:coverage -- bottle-classifier

# Open coverage report
# Windows: start coverage/index.html
# Mac: open coverage/index.html
# Linux: xdg-open coverage/index.html
```

### Coverage Targets
- **Statements:** 80%+
- **Branches:** 75%+
- **Functions:** 80%+
- **Lines:** 80%+

---

## 🎓 How to Write New Tests

### Template for New Test File

```typescript
/**
 * Unit Tests for [Feature/Module]
 * Tests [what this file tests]
 */

import { functionToTest } from '@/path/to/module';
import * as dependencyLib from '@/lib/dependency';

// Mock external dependencies
jest.mock('@/lib/dependency', () => ({
  dependency: {
    method: jest.fn(),
  },
}));

describe('Feature Name', () => {
  const mockDependency = dependencyLib.dependency as jest.Mocked<typeof dependencyLib.dependency>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Function Name', () => {
    it('should do something specific', () => {
      // Arrange - setup test data
      const input = { /* ... */ };

      // Act - call the function
      const result = functionToTest(input);

      // Assert - verify results
      expect(result).toBe(expectedValue);
    });
  });
});
```

### Key Points for New Tests

1. **Clear naming:** Describe what should happen
2. **AAA pattern:** Arrange, Act, Assert
3. **One assertion focus:** Test one thing per test
4. **Mock external deps:** Use jest.mock() for Supabase, API calls, etc.
5. **Test edge cases:** null, undefined, empty, boundary values
6. **Handle errors:** Test error paths, not just happy path

---

## 🐛 Common Test Failures & Fixes

### Error: "Cannot find module '@/...'"
**Fix:**
- Verify path alias in `tsconfig.json` and `jest.config.js`
- Ensure both files have matching alias configuration

### Error: "Supabase is not defined"
**Fix:**
- Ensure mock is defined BEFORE import
- Correct order: `jest.mock()` → `import {}`

### Error: "Test timeout"
**Fix:**
- Increase Jest timeout: `jest.setTimeout(10000)`
- Check for unresolved promises
- Ensure async/await is used correctly

### Error: "Tests pass locally but fail in CI"
**Fix:**
- Check for environment variables
- Ensure all mocks are setup in jest.setup.js
- Check Node version compatibility

---

## 📚 Documentation Files

### Important Files to Read

1. **TESTING_GUIDE.md**
   - Comprehensive guide
   - Setup instructions
   - Best practices
   - Troubleshooting

2. **UNIT_TESTING_SUMMARY.md**
   - Test statistics
   - Feature overview
   - Integration guide

3. **This file (TESTING_CHECKLIST.md)**
   - Quick reference
   - Test file mapping
   - Common issues

---

## 🚀 Getting Started (5 Minutes)

### Step 1: Install (2 min)
```bash
pnpm install
```

### Step 2: Run Tests (1 min)
```bash
pnpm test
```

### Step 3: View Results (1 min)
```bash
pnpm test:coverage
# Open coverage/index.html in browser
```

### Step 4: Explore (1 min)
- Open test files in IDE
- Read test structure
- Understand mocking approach

---

## ✨ Next Steps After Setup

1. **Run all tests:** Ensure everything passes
2. **Check coverage:** `pnpm test:coverage`
3. **Write component tests:** Add tests for React components
4. **Add integration tests:** Test full workflows
5. **Setup CI/CD:** Automate testing on push
6. **Monitor coverage:** Track improvements over time

---

## 📞 Quick Help

### Get Test Status
```bash
pnpm test
```

### Run Tests Continuously
```bash
pnpm test:watch
```

### Generate Coverage Report
```bash
pnpm test:coverage
```

### Debug Single Test
```bash
pnpm test:debug -- [filename]
```

### Run Tests Matching Pattern
```bash
pnpm test -- --testNamePattern="pattern"
```

---

## 📋 Final Verification Checklist

Before considering testing setup complete:

- [ ] Jest is installed
- [ ] All test files exist in `__tests__` directories
- [ ] `jest.config.js` is in project root
- [ ] `jest.setup.js` is in project root
- [ ] `package.json` has test scripts
- [ ] `pnpm test` runs without errors
- [ ] Coverage report generates successfully
- [ ] All 215+ tests pass
- [ ] Can run specific test files
- [ ] Mock setup is working correctly

---

## 🎉 You're All Set!

Your project now has comprehensive unit testing setup with:
- ✅ 215+ test cases
- ✅ 7 test files
- ✅ Full utilities coverage
- ✅ Authentication testing
- ✅ Service testing
- ✅ Hook testing
- ✅ Proper mocking strategy
- ✅ Configuration files ready

**Start testing:** `pnpm test`

---

**Last Updated:** January 2024
**Test Framework:** Jest 29.7.0
**Testing Library:** React Testing Library 14.1.2
**Status:** ✅ Production Ready
