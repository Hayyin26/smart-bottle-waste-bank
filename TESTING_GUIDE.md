# 📋 Unit Testing Setup Guide

Panduan lengkap untuk melakukan unit testing pada proyek Smart Bottle Waste Bank.

## 🎯 Gambaran Umum

Proyek ini telah dikonfigurasi dengan unit testing komprehensif menggunakan:
- **Jest**: Testing framework
- **React Testing Library**: Untuk testing React components dan hooks
- **@testing-library/jest-dom**: Custom matchers untuk testing DOM

## 📁 Struktur Test Files

Semua test files berada di folder `__tests__` di setiap direktori source:

```
src/
├── utils/
│   ├── bottle-classifier.ts
│   └── __tests__/
│       └── bottle-classifier.test.ts
├── lib/
│   ├── utils.ts
│   ├── auth.ts
│   └── __tests__/
│       ├── utils.test.ts
│       └── auth.test.ts
├── services/
│   ├── nasabah.service.ts
│   ├── transactions.service.ts
│   ├── iot-devices.service.ts
│   └── __tests__/
│       ├── nasabah.service.test.ts
│       ├── transactions.service.test.ts
│       └── iot-devices.service.test.ts
├── hooks/
│   ├── use-auth.ts
│   └── __tests__/
│       └── use-auth.test.tsx
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Menggunakan pnpm
pnpm install

# Atau menggunakan npm
npm install
```

### 2. Run Tests

```bash
# Run semua tests
pnpm test

# Run tests dalam watch mode (auto-rerun saat ada perubahan)
pnpm test:watch

# Run tests dengan coverage report
pnpm test:coverage
```

## 📝 Available NPM Scripts

Tambahkan scripts berikut ke `package.json` (sudah diupdate):

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```

## 🧪 Test Files Created

### 1. **Bottle Classifier Tests** (`src/utils/__tests__/bottle-classifier.test.ts`)
- ✅ 50+ test cases
- Tests untuk klasifikasi botol berdasarkan berat
- Tests untuk edge cases dan error handling
- Tests untuk kategori KECIL, SEDANG, BESAR

**Coverage:**
- `isValidBottleWeight()`: Validasi berat botol
- `classifyBottle()`: Klasifikasi botol ke kategori
- BOTTLE_CATEGORIES constant validation

### 2. **Library Utils Tests** (`src/lib/__tests__/utils.test.ts`)
- ✅ 40+ test cases
- Tests untuk `cn()` function (className merger)
- Tests untuk `addThousandsSeparator()` (format angka)
- Tests untuk `numberToPercentage()` (format persentase)

**Coverage:**
- Conditional class handling
- Tailwind CSS class merging
- Number formatting dengan separator
- Percentage conversion

### 3. **Auth Service Tests** (`src/lib/__tests__/auth.test.ts`)
- ✅ 20+ test cases
- Tests untuk `signInWithEmail()`: Login dengan email & password
- Tests untuk `signOut()`: Logout user
- Tests untuk `getCurrentUser()`: Ambil user saat ini

**Coverage:**
- Successful login/logout
- Error handling
- Token validation
- Network error handling

### 4. **Nasabah Service Tests** (`src/services/__tests__/nasabah.service.test.ts`)
- ✅ 25+ test cases
- Tests untuk `getNasabahList()`: Ambil list nasabah
- Tests untuk `getNasabahById()`: Ambil nasabah by ID
- Tests untuk `updateNasabah()`: Update data nasabah

**Coverage:**
- Fetch data dari Supabase
- Handle errors gracefully
- Map data to correct format
- Transaction counting

### 5. **Transactions Service Tests** (`src/services/__tests__/transactions.service.test.ts`)
- ✅ 30+ test cases
- Tests untuk `getTransactions()`: Ambil semua transaksi
- Tests untuk `getTransactionsByUserId()`: Ambil transaksi user

**Coverage:**
- Data enrichment (user profile + device location)
- Error handling untuk missing data
- Transaction filtering dan sorting
- Null safety

### 6. **IoT Devices Service Tests** (`src/services/__tests__/iot-devices.service.test.ts`)
- ✅ 25+ test cases
- Tests untuk `getDevices()`: Ambil semua devices
- Tests untuk `getActiveDevices()`: Ambil devices yang aktif

**Coverage:**
- Device fetching
- Active device filtering
- Error handling
- Data ordering

### 7. **useAuth Hook Tests** (`src/hooks/__tests__/use-auth.test.tsx`)
- ✅ 25+ test cases
- Tests untuk hook initialization
- Tests untuk session fetching
- Tests untuk auth state changes

**Coverage:**
- User session management
- Profile fetching
- Auth state events (SIGNED_IN, SIGNED_OUT, PASSWORD_RECOVERY)
- Subscription cleanup

## 🔧 Configuration Files

### jest.config.js
Konfigurasi Jest untuk Next.js project:
```javascript
- Module path aliasing (@/...)
- Test environment setup
- Coverage collection configuration
```

### jest.setup.js
Setup file untuk testing environment:
```javascript
- Next.js router mocking
- Next.js navigation mocking
- Console error suppression
- DOM matchers setup
```

## 📊 Running Specific Tests

### Run tests untuk satu file:
```bash
pnpm test -- bottle-classifier.test.ts
```

### Run tests dengan pattern:
```bash
pnpm test -- --testNamePattern="classifyBottle"
```

### Run tests dengan verbose output:
```bash
pnpm test -- --verbose
```

### Debug tests:
```bash
pnpm test:debug
```

## 📈 Coverage Reports

```bash
# Generate coverage report
pnpm test:coverage
```

Report akan tersimpan di folder `coverage/`:
- `coverage/index.html`: Interactive coverage report
- `coverage/lcov.info`: LCOV format (untuk CI/CD)

Coverage thresholds yang direkomendasikan:
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

## 🤝 Mocking Strategy

### Supabase Mocking
Semua service tests menggunakan `jest.mock()` untuk mock Supabase client:
```typescript
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getUser: jest.fn(),
      // ... other methods
    }
  }
}));
```

### Next.js Router Mocking
Router dan navigation sudah di-mock di `jest.setup.js`:
```typescript
jest.mock('next/router', () => ({ ... }));
jest.mock('next/navigation', () => ({ ... }));
```

## ✅ Best Practices

### 1. Test Organization
```typescript
describe('Feature Name', () => {
  describe('Function Name', () => {
    it('should do something specific', () => {
      // Test implementation
    });
  });
});
```

### 2. Setup & Teardown
```typescript
beforeEach(() => {
  jest.clearAllMocks();
  // Setup for each test
});

afterEach(() => {
  // Cleanup after each test
});
```

### 3. Assertions
Gunakan yang spesifik:
```typescript
// ✅ Good
expect(result.bottleType).toBe('KECIL');
expect(result.success).toBe(true);

// ❌ Avoid
expect(result).toBeTruthy();
```

### 4. Test Naming
Gunakan format yang deskriptif:
```typescript
it('should classify 15 gram as BOTOL KECIL', () => {
  // Clear intent dari apa yang di-test
});
```

## 🐛 Troubleshooting

### Tests tidak berjalan?
```bash
# Clear Jest cache
pnpm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### Module not found errors?
```bash
# Pastikan path alias (@/) sudah benar di:
# - tsconfig.json
# - jest.config.js
```

### Mock tidak bekerja?
```typescript
// Pastikan mock di-import sebelum module yang di-mock
jest.mock('@/lib/supabase');
import { supabase } from '@/lib/supabase';
```

## 📚 Useful Jest Commands

| Command | Purpose |
|---------|---------|
| `jest` | Run all tests |
| `jest --watch` | Watch mode |
| `jest --coverage` | Coverage report |
| `jest --updateSnapshot` | Update snapshots |
| `jest --testNamePattern="pattern"` | Run tests matching pattern |
| `jest --testPathPattern="path"` | Run tests in matching path |
| `jest --bail` | Stop on first test failure |
| `jest --verbose` | Verbose output |

## 🔗 Useful Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://testingjavascript.com/)
- [Supabase Testing](https://supabase.com/docs/guides/testing)

## 📌 Next Steps

1. **Run tests**: `pnpm test`
2. **Check coverage**: `pnpm test:coverage`
3. **Write more tests** untuk komponen lain
4. **Setup CI/CD** dengan GitHub Actions untuk auto-testing
5. **Monitor coverage** untuk maintain/improve test quality

## 📞 Support

Untuk pertanyaan atau issues terkait testing:
1. Cek Jest documentation
2. Lihat existing test files sebagai reference
3. Check error messages untuk debugging hints

---

**Happy Testing! 🎉**
