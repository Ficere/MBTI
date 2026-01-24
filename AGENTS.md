# AGENTS.md - AI Coding Agent Guidelines

This document provides essential information for AI coding agents working on this MBTI personality test application.

## Project Overview

A React-based MBTI (Myers-Briggs Type Indicator) personality test web application built with Vite. The project includes both a main web app and a WeChat miniapp version in the `miniapp/` directory.

**Tech Stack:**
- React 19 with JavaScript (JSX)
- Vite 7 for build tooling
- Vitest for testing
- CSS modules (plain CSS, no preprocessors in main app)
- localStorage for data persistence

## Build/Lint/Test Commands

```bash
# Development
npm run dev              # Start dev server (localhost:5173)
npm run dev:safe         # Start with Python script wrapper

# Build
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm run test             # Run all tests once
npm run test:watch       # Run tests in watch mode

# Run a single test file
npx vitest run src/utils/mbti/calculator.test.js

# Run tests matching a pattern
npx vitest run -t "calculateScores"
```

### Miniapp Commands (run from `miniapp/` directory)
```bash
npm run dev:weapp        # WeChat miniapp dev
npm run build:weapp      # WeChat miniapp build
npm run dev:h5           # H5 version dev
npm run build:h5         # H5 version build
```

## Project Structure

```
src/
├── App.jsx              # Main app component, page routing
├── main.jsx             # Entry point
├── components/          # React components
│   ├── WelcomePage.jsx
│   ├── TestPage.jsx
│   ├── ResultPage.jsx
│   ├── ResultPage/      # Sub-components for results
│   │   ├── TypeHeader.jsx
│   │   ├── TypeOverview.jsx
│   │   ├── TypeDetailTabs.jsx
│   │   ├── DimensionCard.jsx
│   │   └── ActionButtons.jsx
│   ├── HistoryPage.jsx
│   ├── TypeBrowserPage.jsx
│   └── DemoPage.jsx
├── constants/
│   ├── options.js       # Answer option configurations
│   └── mbti/
│       ├── index.js     # Type description loader (async)
│       ├── dimensions.js # MBTI dimension definitions
│       └── types/       # Individual type descriptions (INTJ.js, etc.)
├── utils/
│   ├── helpers.js       # General utility functions
│   ├── storage.js       # localStorage operations
│   └── mbti/
│       ├── index.js     # MBTI utilities export
│       ├── calculator.js     # Score calculation logic
│       ├── calculator.test.js
│       └── test-helpers.js
└── data/
    └── questions.json   # Test questions
```

## Code Style Guidelines

### File & Naming Conventions

- **Components**: PascalCase for files and component names (`TestPage.jsx`, `TypeHeader.jsx`)
- **Utilities/Constants**: camelCase for files (`calculator.js`, `helpers.js`)
- **CSS**: Match component name or use `index.css` in component folders
- **Functions**: camelCase (`calculateScores`, `getMBTIType`)
- **Constants**: UPPER_SNAKE_CASE for config objects (`ANSWER_OPTIONS`, `DIMENSIONS`)
- **Variables**: camelCase (`currentQuestion`, `typeDescription`)

### Import Organization

Order imports as follows:
1. React and framework imports
2. Component imports
3. Utility/helper imports
4. Constant imports
5. Data/JSON imports
6. CSS imports

```javascript
import React, { useState, useEffect } from 'react'
import WelcomePage from './components/WelcomePage'
import { calculateMBTI } from './utils/mbti/calculator'
import { DIMENSIONS } from './constants/mbti'
import questions from '../data/questions.json'
import './App.css'
```

### Component Structure

- Use function components with hooks (no class components)
- Define helper functions inside component when they use component state
- Extract reusable logic to `utils/`
- Keep components focused; split into sub-components when >200 lines

```javascript
function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue)
  
  // Effects
  useEffect(() => { /* ... */ }, [dependencies])
  
  // Event handlers
  const handleEvent = () => { /* ... */ }
  
  // Render helpers (if needed)
  const renderItem = (item) => { /* ... */ }
  
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  )
}

export default ComponentName
```

### JSDoc Comments

Use JSDoc for utility functions with clear parameter and return types:

```javascript
/**
 * Calculate MBTI scores from answers
 * @param {Array} answers - Answer array [{ questionId, value, weight }]
 * @param {Array} questions - Question array
 * @returns {Object} Score object { E, I, S, N, T, F, J, P }
 */
export function calculateScores(answers, questions) {
  // ...
}
```

### Error Handling

Use try-catch for localStorage operations and return sensible defaults:

```javascript
export const loadProgress = () => {
  try {
    const data = localStorage.getItem(PROGRESS_KEY)
    if (!data) return null
    return JSON.parse(data)
  } catch (error) {
    console.error('Failed to load progress:', error)
    return null
  }
}
```

### CSS Conventions

- Use BEM-like naming: `.component-name`, `.component-name-element`, `.component-name--modifier`
- CSS custom properties for theming via `--variable-name`
- Component-scoped styles in dedicated CSS files
- Responsive styles in separate `Responsive.css` files when needed

## Testing Patterns

Tests use Vitest with Chinese descriptions (project is bilingual):

```javascript
import { describe, it, expect } from 'vitest'
import { calculateScores, getMBTIType } from './calculator'
import { mockQuestions, createAnswer } from './test-helpers'

describe('calculateScores', () => {
  it('should give full score to dimension A when weight is 1.0', () => {
    const answers = [createAnswer(0, 1.0)]
    const scores = calculateScores(answers, mockQuestions)
    expect(scores.E).toBe(1.0)
    expect(scores.I).toBe(0.0)
  })
})
```

Use test helpers from `test-helpers.js`:
- `mockQuestions` - minimal question set (4 questions)
- `extendedQuestions` - larger set (12 questions, 3 per dimension)
- `createAnswer(questionId, weight)` - create answer object
- `createTypedAnswers(typeString)` - create answers for specific type like 'INTJ'

## Key Domain Concepts

- **MBTI Dimensions**: E/I (Energy), S/N (Perception), T/F (Decision), J/P (Lifestyle)
- **Answer Weight**: 1.0 = fully A, 0.75 = lean A, 0.5 = neutral, 0.25 = lean B, 0.0 = fully B
- **Type Descriptions**: Loaded dynamically from `constants/mbti/types/` via `getTypeDescription()`

## Important Notes

- The app uses Chinese (Simplified) for UI text and comments
- State management is via React useState (no external state library)
- Navigation is handled by `currentPage` state in App.jsx (no router)
- Type descriptions are lazy-loaded and cached for performance
- The miniapp (`miniapp/`) uses Taro framework and has its own package.json
