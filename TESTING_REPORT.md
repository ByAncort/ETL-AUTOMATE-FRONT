# ETL Automate Frontend — Unit Testing Report

## Overview

This document covers the Jest unit testing setup and execution for the ETL Automate frontend application. The testing suite validates the core business logic, hooks, services, context, and UI components.

## Test Summary

- **Test Suites**: 17 passed (17 total)
- **Tests**: 96 passed (96 total)
- **Time**: ~6s
- **Framework**: Jest 30 + ts-jest + @testing-library/react
- **Environment**: jsdom

## Files Tested

### Utils (`src/lib/`)
| File | Coverage | Tests |
|------|----------|-------|
| `utils.ts` (cn function) | 100% | 7 tests |

### Services (`src/services/`)
| File | Coverage | Tests | Description |
|------|----------|-------|-------------|
| `notificationService.ts` | 100% | 8 | Notification CRUD, subscription pub/sub pattern |
| `schemaMatchService.ts` | 100% | 3 | Schema matching API calls |
| `etlService.ts` | 64% | 3 | ETL execution API calls |
| `logService.ts` | 60% | 2 | Log fetching API calls |

### Hooks (`src/hooks/`)
| File | Coverage | Tests | Description |
|------|----------|-------|-------------|
| `useEtlExecution.ts` | 100% | 6 | ETL execution state machine (idle → extracting → transforming → loading → done/error) |
| `useUnifiedRecords.ts` | 100% | 5 | Schema match data fetching and mapping |
| `useUsers.ts` | 96% | 4 | User CRUD operations |
| `useIntegrations.ts` | 91% | 7 | Integration CRUD with error handling |
| `useApiConnections.ts` | 88% | 7 | API connection CRUD + test connection |
| `useLlmConfigs.ts` | 85% | 6 | LLM config CRUD + set default |

### Context (`src/context/`)
| File | Coverage | Tests | Description |
|------|----------|-------|-------------|
| `AuthContext.tsx` | 90% | 9 | Auth state, token decode, login/logout, role checks |

### UI Components (`src/components/ui/`)
| Component | Coverage | Tests | Description |
|-----------|----------|-------|-------------|
| `LoadingState` | 100% | 4 | Default/custom message, custom icon, default spinner |
| `ErrorState` | 100% | 5 | Error message, retry button visibility/action |
| `EmptyState` | 100% | 6 | Title, description, icon, action button behavior |
| `Modal` | 100% | 9 | Open/close, backdrop click, sizes, icon, subtitle, footer |
| `PageHeader` | 100% | 5 | Title, description, icon, children rendering |

## Test Patterns Used

### Service Tests
- Axios mocked via manual mock (`__mocks__/axios.js` and `jest.mock('axios')`)
- Test both success and error paths
- Verify correct HTTP method, URL, and payload

### Hook Tests
- `@testing-library/react` `renderHook` + `waitFor` + `act`
- Mock API service calls via `jest.mock`
- Test loading states, success states, error states
- Verify state mutations (create/update/delete)

### Context Tests
- `renderHook` with `wrapper: AuthProvider`
- Mock localStorage
- JWT token simulation with `btoa`
- Test auth flow (login, logout, admin role, viewAdmin)

### UI Component Tests
- `@testing-library/react` `render`, `screen`, `fireEvent`
- Jest DOM matchers (`toBeInTheDocument`, `toHaveClass`)
- Test conditional rendering, click handlers, prop variations

## Running Tests

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report
npm run test:verbose     # Detailed output
npx jest src/services    # Run tests in a directory
npx jest --testPathPattern="Auth"  # Pattern matching
```

## Configuration

- **Preset**: ts-jest with tsconfig.app.json
- **Environment**: jsdom
- **Transform**: TypeScript + JSX via ts-jest
- **Module mapping**: `@/` → `src/`, CSS → identity-obj-proxy
- **Mock auto-cleanup**: clearMocks + restoreMocks enabled

## Notes

- The `api.ts` service has low coverage (27%) because it's an Axios configuration/interceptor module, not business logic. Integration tests would be more appropriate.
- Large page components and complex UI (AdminPanel, Sidebar, etc.) are not yet tested due to their visual nature.
- The coverage threshold is set at 60% globally; this is expected to be met as more component tests are added.
