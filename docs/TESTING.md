# Testing Guide

Comprehensive testing strategy and recommendations for the Discovery SearchUI application.

## Table of Contents

- [Current Testing State](#current-testing-state)
- [Testing Strategy](#testing-strategy)
- [Quick Start](#quick-start)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [E2E Testing](#e2e-testing)
- [Visual Regression Testing](#visual-regression-testing)
- [Testing Priority Matrix](#testing-priority-matrix)
- [Recommended Tools](#recommended-tools)
- [Coverage Goals](#coverage-goals)
- [CI/CD Integration](#cicd-integration)

---

## Current Testing State

**What we have:**
- ✅ Jasmine + Karma configured
- ✅ 5 service tests (hyp3, product, frame-map services)
- ✅ Ghost Inspector for E2E testing
- ✅ jasmine-marbles for RxJS testing

**What's missing:**
- ❌ No component tests
- ❌ No NgRx store/effects/reducer tests
- ❌ Low test coverage overall

---

## Testing Strategy

### Philosophy

Focus on **high-value tests** over coverage percentage. This application's complex state management (NgRx) and API interactions need testing more than simple presentational components.

### Layered Approach

1. **Unit Tests** - Individual pieces (services, reducers, pipes)
2. **Integration Tests** - Component + service + store interactions
3. **E2E Tests** - Full user workflows
4. **Visual Tests** - UI consistency and regression detection

---

## Quick Start

### Week-by-Week Plan

#### Week 1: Setup + Store Tests
```bash
# Add testing utilities
npm install --save-dev @ngrx/store/testing

# Create tests for:
# 1. One reducer (e.g., search.reducer.spec.ts)
# 2. One effect (e.g., search.effects.spec.ts)
# 3. One selector (e.g., search.selectors.spec.ts)
```

#### Week 2: Service Tests
```bash
# Test critical services:
# - asf-api.service.spec.ts
# - search.service.spec.ts
# - map.service.spec.ts
```

#### Week 3: Component Tests
```bash
# Test 3 critical components:
# - header.component.spec.ts
# - search-selector.component.spec.ts
# - results-menu.component.spec.ts
```

### Run Tests

```bash
# Interactive mode (watch for changes)
npm test

# Headless mode (CI)
npm run test:headless

# With coverage report
npm run test:coverage

# Debug mode
npm run test:debug
```

---

## Unit Testing

### 1. NgRx Store Testing (CRITICAL PRIORITY)

This app heavily uses NgRx, so store testing is the highest priority.

#### Testing Reducers

```typescript
// src/app/store/search/search.reducer.spec.ts
import { searchReducer } from './search.reducer';
import * as searchActions from './search.actions';

describe('Search Reducer', () => {
  it('should set loading state on search', () => {
    const action = searchActions.search({ params });
    const state = searchReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should load search results successfully', () => {
    const results = [/* mock results */];
    const action = searchActions.searchSuccess({ results });
    const state = searchReducer(initialState, action);

    expect(state.results).toEqual(results);
    expect(state.loading).toBe(false);
  });

  it('should handle search errors', () => {
    const error = 'Search failed';
    const action = searchActions.searchFailure({ error });
    const state = searchReducer(initialState, action);

    expect(state.error).toBe(error);
    expect(state.loading).toBe(false);
  });
});
```

#### Testing Effects

```typescript
// src/app/store/search/search.effects.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

describe('Search Effects', () => {
  let actions$: Observable<any>;
  let effects: SearchEffects;
  let asfApiService: jasmine.SpyObj<AsfApiService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchEffects,
        provideMockActions(() => actions$),
        {
          provide: AsfApiService,
          useValue: jasmine.createSpyObj('AsfApiService', ['search'])
        }
      ]
    });

    effects = TestBed.inject(SearchEffects);
    asfApiService = TestBed.inject(AsfApiService) as jasmine.SpyObj<AsfApiService>;
  });

  it('should load search results on search action', () => {
    const params = { query: 'test' };
    const results = [/* mock results */];
    const action = searchActions.search({ params });
    const outcome = searchActions.searchSuccess({ results });

    actions$ = hot('-a', { a: action });
    const response = cold('-a|', { a: results });
    asfApiService.search.and.returnValue(response);

    const expected = cold('--b', { b: outcome });
    expect(effects.search$).toBeObservable(expected);
  });

  it('should handle search errors', () => {
    const params = { query: 'test' };
    const error = new Error('API error');
    const action = searchActions.search({ params });
    const outcome = searchActions.searchFailure({ error: error.message });

    actions$ = hot('-a', { a: action });
    const response = cold('-#|', {}, error);
    asfApiService.search.and.returnValue(response);

    const expected = cold('--b', { b: outcome });
    expect(effects.search$).toBeObservable(expected);
  });
});
```

#### Testing Selectors

```typescript
// src/app/store/search/search.selectors.spec.ts
import { selectSearchResults, selectSearchLoading } from './search.selectors';

describe('Search Selectors', () => {
  const initialState = {
    search: {
      results: [],
      loading: false,
      error: null
    }
  };

  it('should select search results', () => {
    const results = [/* mock results */];
    const state = { ...initialState, search: { ...initialState.search, results } };

    expect(selectSearchResults(state)).toEqual(results);
  });

  it('should select loading state', () => {
    const state = { ...initialState, search: { ...initialState.search, loading: true } };

    expect(selectSearchLoading(state)).toBe(true);
  });
});
```

**Files to prioritize:**
- `src/app/store/scenes/*.ts` - Scene management
- `src/app/store/search/*.ts` - Search functionality
- `src/app/store/filters/*.ts` - Filter state
- `src/app/store/map/*.ts` - Map state
- `src/app/store/user/*.ts` - User/auth state

---

### 2. Service Testing

#### Testing HTTP Services

```typescript
// src/app/services/asf-api.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AsfApiService } from './asf-api.service';

describe('AsfApiService', () => {
  let service: AsfApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AsfApiService]
    });

    service = TestBed.inject(AsfApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should search for scenes', () => {
    const mockResults = {
      features: [
        { id: '1', properties: { name: 'Scene 1' } }
      ]
    };
    const searchParams = { platform: 'Sentinel-1' };

    service.search(searchParams).subscribe(results => {
      expect(results).toEqual(mockResults);
      expect(results.features.length).toBe(1);
    });

    const req = httpMock.expectOne(req => req.url.includes('/services/search'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(searchParams);
    req.flush(mockResults);
  });

  it('should handle search errors', () => {
    const searchParams = { platform: 'Invalid' };
    const errorMessage = 'Search failed';

    service.search(searchParams).subscribe(
      () => fail('should have failed'),
      error => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne(req => req.url.includes('/services/search'));
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });
});
```

#### Testing Utility Services

```typescript
// src/app/services/map.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { MapService } from './map.service';

describe('MapService', () => {
  let service: MapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapService]
    });
    service = TestBed.inject(MapService);
  });

  it('should convert coordinates correctly', () => {
    const latLon = { lat: 64.8, lon: -147.7 };
    const result = service.convertToProjection(latLon);

    expect(result).toBeDefined();
    expect(result.x).toBeCloseTo(-16452000, 0);
    expect(result.y).toBeCloseTo(9600000, 0);
  });

  it('should calculate bounding box', () => {
    const polygon = [
      [-148, 65],
      [-147, 65],
      [-147, 64],
      [-148, 64],
      [-148, 65]
    ];

    const bbox = service.calculateBoundingBox(polygon);

    expect(bbox).toEqual({
      minLon: -148,
      maxLon: -147,
      minLat: 64,
      maxLat: 65
    });
  });
});
```

---

### 3. Component Testing

#### Smart Components (Connected to Store)

```typescript
// src/app/components/header/header.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HeaderComponent } from './header.component';
import * as searchActions from '@store/search/search.actions';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let store: MockStore;
  const initialState = { search: { query: '', loading: false } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent], // Standalone component
      providers: [
        provideMockStore({ initialState })
      ],
      schemas: [NO_ERRORS_SCHEMA] // Skip child component errors
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch search action on submit', () => {
    spyOn(store, 'dispatch');

    component.searchForm.setValue({ query: 'Alaska' });
    component.onSearch();

    expect(store.dispatch).toHaveBeenCalledWith(
      searchActions.search({ params: { query: 'Alaska' } })
    );
  });

  it('should display loading state', () => {
    store.setState({ search: { query: 'test', loading: true } });
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('.loading-spinner');
    expect(spinner).toBeTruthy();
  });
});
```

#### Presentational Components

```typescript
// src/app/components/shared/scene-card/scene-card.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SceneCardComponent } from './scene-card.component';

describe('SceneCardComponent', () => {
  let component: SceneCardComponent;
  let fixture: ComponentFixture<SceneCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SceneCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SceneCardComponent);
    component = fixture.componentInstance;
  });

  it('should display scene name', () => {
    component.scene = {
      id: '1',
      name: 'Test Scene',
      platform: 'Sentinel-1'
    };
    fixture.detectChanges();

    const name = fixture.nativeElement.querySelector('.scene-name');
    expect(name.textContent).toContain('Test Scene');
  });

  it('should emit select event on click', () => {
    spyOn(component.select, 'emit');
    component.scene = { id: '1', name: 'Test' };

    component.onSelect();

    expect(component.select.emit).toHaveBeenCalledWith(component.scene);
  });
});
```

---

## Integration Testing

Test component + service + store interactions together:

```typescript
// src/app/components/search/search.integration.spec.ts
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { searchReducer } from '@store/search/search.reducer';
import { SearchEffects } from '@store/search/search.effects';
import { SearchComponent } from './search.component';

describe('Search Integration', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({ search: searchReducer }),
        EffectsModule.forRoot([SearchEffects]),
        SearchComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should load and display search results', fakeAsync(() => {
    const mockResults = {
      features: [
        { id: '1', properties: { name: 'Scene 1' } },
        { id: '2', properties: { name: 'Scene 2' } }
      ]
    };

    // Trigger search
    component.search('Alaska');
    tick();

    // Respond to HTTP request
    const req = httpMock.expectOne(req => req.url.includes('/search'));
    req.flush(mockResults);
    tick();

    fixture.detectChanges();

    // Verify results are displayed
    const resultElements = fixture.nativeElement.querySelectorAll('.result-item');
    expect(resultElements.length).toBe(2);
    expect(resultElements[0].textContent).toContain('Scene 1');
  }));

  afterEach(() => {
    httpMock.verify();
  });
});
```

---

## E2E Testing

### Current: Ghost Inspector

Continue using Ghost Inspector for critical user workflows:
- User authentication
- Search and filter workflows
- Map interactions
- Download queue
- HyP3 processing jobs

### Recommended Addition: Playwright

Add Playwright for faster local development and CI/CD:

#### Installation

```bash
npm install --save-dev @playwright/test
npx playwright install
```

#### Basic Test

```typescript
// e2e/search.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
  });

  test('should search for scenes', async ({ page }) => {
    // Fill search input
    await page.fill('[data-testid="search-input"]', 'Alaska');
    await page.click('[data-testid="search-button"]');

    // Wait for results
    await expect(page.locator('.results-list')).toBeVisible();

    // Verify results count
    const results = page.locator('.result-item');
    await expect(results).toHaveCount(10);
  });

  test('should filter by platform', async ({ page }) => {
    await page.click('[data-testid="filter-menu"]');
    await page.check('[data-testid="filter-sentinel"]');

    // Verify filtered results
    const sentinelResults = page.locator('.result-item[data-platform="Sentinel-1"]');
    await expect(sentinelResults).toHaveCount(10);
  });

  test('should display scene on map when clicked', async ({ page }) => {
    await page.click('.result-item:first-child');

    // Verify map updates
    await expect(page.locator('.map-popup')).toBeVisible();
    await expect(page.locator('.scene-footprint')).toBeVisible();
  });
});
```

#### Map Interaction Tests

```typescript
// e2e/map.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Map Interactions', () => {
  test('should draw polygon search area', async ({ page }) => {
    await page.goto('http://localhost:4200');

    // Enable draw mode
    await page.click('[data-testid="draw-polygon-button"]');

    // Draw polygon (simulate clicks)
    const map = page.locator('#map');
    await map.click({ position: { x: 100, y: 100 } });
    await map.click({ position: { x: 200, y: 100 } });
    await map.click({ position: { x: 200, y: 200 } });
    await map.click({ position: { x: 100, y: 200 } });
    await map.dblclick({ position: { x: 100, y: 100 } });

    // Verify search triggered
    await expect(page.locator('.results-list')).toBeVisible();
  });

  test('should switch base layers', async ({ page }) => {
    await page.goto('http://localhost:4200');

    await page.click('[data-testid="layer-selector"]');
    await page.click('[data-testid="layer-satellite"]');

    // Verify layer changed
    const mapContainer = page.locator('#map');
    await expect(mapContainer).toHaveAttribute('data-layer', 'satellite');
  });
});
```

#### User Workflow Tests

```typescript
// e2e/workflows/download-queue.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Download Queue Workflow', () => {
  test('should add scenes to download queue', async ({ page }) => {
    await page.goto('http://localhost:4200');

    // Search for scenes
    await page.fill('[data-testid="search-input"]', 'Alaska');
    await page.click('[data-testid="search-button"]');
    await page.waitForSelector('.result-item');

    // Add first 3 scenes to queue
    for (let i = 0; i < 3; i++) {
      await page.click(`.result-item:nth-child(${i + 1}) [data-testid="add-to-queue"]`);
    }

    // Open download queue
    await page.click('[data-testid="download-queue-button"]');

    // Verify scenes in queue
    const queueItems = page.locator('.queue-item');
    await expect(queueItems).toHaveCount(3);

    // Download
    await page.click('[data-testid="download-all"]');

    // Verify download started
    await expect(page.locator('.download-progress')).toBeVisible();
  });
});
```

---

## Visual Regression Testing

Use Playwright's screenshot capabilities:

```typescript
// e2e/visual/map-view.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('map view should match baseline', async ({ page }) => {
    await page.goto('http://localhost:4200');
    await page.waitForSelector('#map');

    // Wait for map to fully load
    await page.waitForTimeout(2000);

    // Take screenshot and compare
    await expect(page).toHaveScreenshot('map-view.png', {
      maxDiffPixels: 100 // Allow small differences
    });
  });

  test('search results should match baseline', async ({ page }) => {
    await page.goto('http://localhost:4200');

    await page.fill('[data-testid="search-input"]', 'Alaska');
    await page.click('[data-testid="search-button"]');
    await page.waitForSelector('.results-list');

    await expect(page.locator('.results-list')).toHaveScreenshot('search-results.png');
  });
});
```

---

## Testing Priority Matrix

| Priority | What to Test | Tool | Estimated Effort | Why |
|----------|--------------|------|------------------|-----|
| 🔴 **Critical** | NgRx effects/reducers | Jasmine + jasmine-marbles | 2-3 weeks | Core state management - bugs here affect entire app |
| 🔴 **Critical** | API services (asf-api, search) | Jasmine + HttpClientTestingModule | 1 week | Data integrity - incorrect data is worse than no data |
| 🟡 **High** | Search components | Jasmine + TestBed | 1-2 weeks | Primary user feature - most used functionality |
| 🟡 **High** | Map interactions | Playwright | 1 week | Complex UI - many edge cases and user interactions |
| 🟡 **High** | User workflows (E2E) | Playwright + Ghost Inspector | 2 weeks | Critical user paths - search → filter → download |
| 🟢 **Medium** | Filter components | Jasmine + TestBed | 1 week | Important for search refinement |
| 🟢 **Medium** | Forms (upload, preferences) | Jasmine + ReactiveFormsModule | 1 week | Data validation - prevent bad user input |
| 🟢 **Medium** | HyP3 services/components | Jasmine + TestBed | 1 week | Complex feature but used less frequently |
| ⚪ **Low** | Presentational components | Jasmine (shallow tests) | 1 week | Less critical - mostly display logic |
| ⚪ **Low** | Utility functions/pipes | Jasmine | 2-3 days | Simple logic - easy to test, low risk |

---

## Recommended Tools

### Already Installed ✅

- **Jasmine** - Testing framework
- **Karma** - Test runner
- **jasmine-marbles** - RxJS testing utilities
- **Ghost Inspector** - E2E testing

### Recommended Additions

```bash
# Better component testing
npm install --save-dev @testing-library/angular

# Mock Angular dependencies
npm install --save-dev ng-mocks

# E2E testing (complement Ghost Inspector)
npm install --save-dev @playwright/test

# Visual regression
# (included with Playwright)

# Code coverage reporting
npm install --save-dev codecov
```

### Optional but Useful

```bash
# Mutation testing (advanced)
npm install --save-dev stryker-mutator

# Performance testing
npm install --save-dev lighthouse-ci
```

---

## Coverage Goals

### Run Coverage Report

```bash
npm run test:coverage
open coverage/index.html
```

### Realistic Targets

| Timeframe | Coverage Target | Focus Areas |
|-----------|----------------|-------------|
| **Start (Week 1)** | 15% | NgRx store tests |
| **Month 1** | 40% | + Critical services |
| **Month 3** | 55% | + Main components |
| **Month 6** | 65% | + User workflows |
| **Year 1** | 75% | + Edge cases |

### Coverage by Type

**Don't aim for 100% coverage.** Focus on:

| Code Type | Target | Why |
|-----------|--------|-----|
| Effects | 90%+ | Critical async logic |
| Reducers | 95%+ | Pure functions, easy to test |
| Selectors | 90%+ | Data transformation logic |
| Services | 80%+ | Business logic and API calls |
| Components | 60%+ | Focus on logic, not template |
| Pipes | 100% | Simple, pure functions |
| Guards | 90%+ | Security-critical |
| Interceptors | 85%+ | Request/response handling |

### What NOT to Test (or test lightly)

- Simple getters/setters
- Angular Material components (already tested)
- Third-party library wrappers
- Pure HTML templates with no logic
- Configuration files
- Constants/enums

---

## Recommended npm Scripts

Add these to `package.json`:

```json
{
  "scripts": {
    "test": "ng test",
    "test:ci": "ng test --browsers=ChromeHeadless --watch=false --code-coverage",
    "test:coverage": "ng test --code-coverage --watch=false",
    "test:debug": "ng test --browsers=Chrome --watch=true",
    "test:headless": "ng test --browsers=ChromeHeadless --watch=false",
    "test:single": "ng test --include='**/*.spec.ts' --watch=false",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "e2e:debug": "playwright test --debug",
    "e2e:headed": "playwright test --headed",
    "e2e:report": "playwright show-report"
  }
}
```

### Usage Examples

```bash
# Run all tests with coverage
npm run test:coverage

# Run single test file
npm test -- --include='**/search.service.spec.ts'

# Run E2E tests with UI
npm run e2e:ui

# Debug specific E2E test
npm run e2e:debug -- search.spec.ts
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, test]
  pull_request:
    branches: [main, test]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Build app
        run: npm run build

      - name: Run E2E tests
        run: npm run e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### Quality Gates

Set minimum coverage thresholds in `karma.conf.js`:

```javascript
coverageIstanbulReporter: {
  reports: ['html', 'lcovonly', 'text-summary'],
  fixWebpackSourcePaths: true,
  thresholds: {
    emitWarning: false,
    global: {
      statements: 60,
      branches: 55,
      functions: 60,
      lines: 60
    }
  }
}
```

---

## Testing Best Practices

### General Principles

1. **AAA Pattern**: Arrange, Act, Assert
2. **One assertion per test** (or closely related assertions)
3. **Descriptive test names**: "should do X when Y"
4. **Test behavior, not implementation**
5. **Keep tests isolated** (no shared state)
6. **Mock external dependencies**

### Naming Conventions

```typescript
describe('ComponentName', () => {
  describe('methodName()', () => {
    it('should return X when Y', () => {
      // Test
    });

    it('should throw error when invalid input', () => {
      // Test
    });
  });
});
```

### Common Patterns

#### Testing Async Code

```typescript
// Using fakeAsync
it('should load data after delay', fakeAsync(() => {
  component.loadData();
  tick(1000); // Advance time
  expect(component.data).toBeDefined();
}));

// Using async/await
it('should load data', async () => {
  await component.loadDataAsync();
  expect(component.data).toBeDefined();
});

// Using done callback
it('should emit value', (done) => {
  service.getData().subscribe(data => {
    expect(data).toBeDefined();
    done();
  });
});
```

#### Testing Error Cases

```typescript
it('should handle API errors gracefully', () => {
  const error = new Error('API Error');
  spyOn(apiService, 'getData').and.returnValue(throwError(() => error));

  component.loadData();

  expect(component.error).toBe('API Error');
  expect(component.loading).toBe(false);
});
```

#### Testing Forms

```typescript
it('should validate email format', () => {
  const emailControl = component.form.get('email');

  emailControl.setValue('invalid-email');
  expect(emailControl.hasError('email')).toBe(true);

  emailControl.setValue('valid@email.com');
  expect(emailControl.valid).toBe(true);
});
```

---

## Troubleshooting

### Common Issues

#### "Cannot read property of undefined"
**Problem**: Component dependency not mocked
**Solution**: Add all dependencies to TestBed providers

```typescript
providers: [
  {
    provide: ServiceName,
    useValue: jasmine.createSpyObj('ServiceName', ['method1', 'method2'])
  }
]
```

#### "No provider for Store"
**Problem**: NgRx store not configured
**Solution**: Use `provideMockStore`

```typescript
providers: [provideMockStore({ initialState: {} })]
```

#### "Timeout - Async callback was not invoked"
**Problem**: Async operation didn't complete
**Solution**: Increase timeout or check async handling

```typescript
it('should load data', (done) => {
  service.getData().subscribe(
    data => {
      expect(data).toBeDefined();
      done(); // Don't forget this!
    },
    error => done.fail(error)
  );
}, 10000); // Increase timeout
```

---

## Resources

### Documentation

- [Angular Testing Guide](https://angular.io/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Documentation](https://karma-runner.github.io/)
- [Playwright Documentation](https://playwright.dev/)
- [jasmine-marbles](https://github.com/synapse-wireless-labs/jasmine-marbles)
- [NgRx Testing Guide](https://ngrx.io/guide/store/testing)

### Internal Docs

- [THEMING.md](./THEMING.md) - Theme testing considerations
- [component_mixins_guide.md](./component_mixins_guide.md) - Testing components with mixins
- [README.md](../README.md) - Project setup

---

## Next Steps

### Immediate Actions (This Week)

1. ✅ Read this guide
2. ✅ Run `npm test` to see current state
3. ✅ Write first reducer test
4. ✅ Write first effect test
5. ✅ Write first selector test

### Short Term (Month 1)

- [ ] Test all reducers
- [ ] Test critical effects (search, scenes)
- [ ] Test main API services
- [ ] Set up coverage reporting
- [ ] Achieve 40% coverage

### Medium Term (Months 2-3)

- [ ] Install Playwright
- [ ] Write 10 E2E tests
- [ ] Test critical components
- [ ] Add visual regression tests
- [ ] Achieve 55% coverage

### Long Term (Months 4-6)

- [ ] Complete component test coverage
- [ ] Add mutation testing
- [ ] Set up CI/CD pipelines
- [ ] Achieve 65% coverage
- [ ] Document testing patterns

---

## Questions?

For testing-specific questions:
1. Check this guide first
2. Review Angular testing docs
3. Ask the team in #testing channel
4. Review existing test files for patterns

**Remember**: Perfect is the enemy of good. Start small, test critical paths first, and build up coverage over time.
