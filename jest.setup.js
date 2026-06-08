import '@testing-library/jest-dom'

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock next/server for API route testing
jest.mock('next/server', () => ({
  NextRequest: jest.fn((url, init) => ({
    url: new URL(url),
    method: init?.method || 'GET',
    headers: new Map(Object.entries(init?.headers || {})),
    nextUrl: new URL(url),
    json: jest.fn(),
    text: jest.fn(),
    blob: jest.fn(),
    arrayBuffer: jest.fn(),
    clone: jest.fn(),
  })),
  NextResponse: {
    json: jest.fn((data, init) => ({
      status: init?.status || 200,
      json: jest.fn().mockResolvedValue(data),
    })),
    text: jest.fn((text, init) => ({
      status: init?.status || 200,
      text: jest.fn().mockResolvedValue(text),
    })),
  },
}))

// Suppress console errors during tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: useLayoutEffect') ||
        args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('act'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
