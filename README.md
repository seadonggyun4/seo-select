# SeoSelect

<img width="300" height="300" alt="logo" src="https://github.com/user-attachments/assets/8ea33832-77b7-43d6-acdb-b622b20ea17b" />

A lightweight and extensible select component built with pure Web Components, designed to operate seamlessly across frameworks. This library provides search functionality, virtual scrolling, multiple selection, internationalization, and flexible theming capabilities without external dependencies.

[![NPM](https://img.shields.io/npm/dt/seo-select.svg?label=NPM)](https://www.npmjs.com/package/seo-select)
[![GitHub stars](https://img.shields.io/github/stars/seadonggyun4/seo-select.svg)](https://github.com/seadonggyun4/seo-select/stargazers)

- **[GitHub Repository](https://github.com/seadonggyun4/seo-select)**
- **[Documentation Site](https://seo-select.netlify.app/)**

---

## Features

- **Multiple Themes**: Support for basic and float themes with dark mode compatibility
- **Internationalization**: Built-in localization for English, Korean, Japanese, and Chinese
- **Search Functionality**: Advanced multilingual search with fuzzy matching algorithms
- **Accessibility**: Complete keyboard navigation and screen reader compatibility
- **Virtual Scrolling**: Optimized performance for large-scale datasets
- **Auto Width**: Automatic width calculation based on content dimensions
- **Multiple Selection**: Tag-based multi-select interface with individual removal controls
- **Zero Dependencies**: Implemented with native Web Components for minimal bundle size and maximum compatibility
- **Modern Event System**: Standard addEventListener with type-safe helper methods

---

## Comparative Analysis

SeoSelect addresses common limitations found in existing select component libraries. The following table presents a comparative analysis with established alternatives:

| Feature            | SeoSelect                      | react-select      | headlessui      | antd / prime     |
| ------------------ | ----------------------------- | ---------------- | -------------- | --------------- |
| Framework Agnostic | Web Component                  | React only        | React/Vue       | Framework-bound  |
| Bundle Size        | Minimal (0 dependencies)       | Large (~700KB+)   | Moderate        | Large            |
| Dependencies       | None                           | Multiple          | Moderate        | Multiple         |
| Virtual Scroll     | Built-in                       | Requires setup    | Not available   | Limited          |
| Multilingual Search| Korean/Japanese/Chinese        | Not available     | Not available   | Not available    |
| Search Accuracy    | Fuzzy + Multilingual           | Basic filter      | Not available   | Moderate         |
| Keyboard Access    | Full support                   | Partial           | Partial         | Partial          |
| Type Safety        | Global type extension          | Partial           | Partial         | Complex          |
| Event Design       | Standard + type helpers        | React props       | Not available   | Not available    |
| Multi-Framework    | React/Vue/Angular/Qwik/Solid   | Not available     | Not available   | Not available    |
| Customization      | CSS Variables                  | Partial           | Partial         | Theme-locked     |
| SSR Safe           | Yes                            | No                | Partial         | No               |

### Key Advantages

- **Framework Independence**: Compatible with React, Vue, Angular, Svelte, Qwik, and plain HTML without vendor lock-in
- **Minimal Footprint**: Zero runtime dependencies resulting in minimal bundle size and optimized load times
- **Advanced Search Capabilities**: Native support for Korean initial consonant search, Japanese romaji conversion, and Chinese pinyin matching with fuzzy matching for all languages
- **Virtual Scrolling**: Efficient handling of large option sets without additional configuration
- **Accessibility Compliance**: Comprehensive keyboard navigation and screen reader support
- **TypeScript Integration**: Global type extensions for type-safe event handling across environments
- **Customization**: Complete styling control through CSS variables without theme restrictions
- **SSR Compatibility**: Functions correctly in server-side rendering environments including Next.js, Nuxt, and SvelteKit
- **Modern Event System**: Standard `addEventListener` implementation with type-safe helper methods

---

## Installation

### Module Bundlers (Recommended)

```bash
npm install seo-select
```

```javascript
// Import basic select component
import 'seo-select';

// Import search-enabled select component
import 'seo-select/components/seo-select-search';

// Import stylesheet
import 'seo-select/styles'

// Import type definitions
import 'seo-select/types';
```

### Direct Browser Usage

```html
<link rel="stylesheet" href="./min/index.css">
<script type="module" src="./min/index.js"></script>
```

Pre-built files are available from [GitHub Releases](https://github.com/seadonggyun4/seo-select/releases).

---

## Component Overview

### seo-select

The basic select component provides standard dropdown functionality with virtual scrolling, multiple selection, theme support, and form integration.

### seo-select-search

The search-enhanced select component extends the basic component with real-time multilingual search capabilities, including Korean initial consonant matching, Japanese romaji conversion, and Chinese pinyin search.

---

## Usage Examples

### Basic Implementation

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import 'seo-select';
  </script>
</head>
<body>
  <seo-select name="country" required>
    <option value="us">United States</option>
    <option value="kr">South Korea</option>
    <option value="jp">Japan</option>
  </seo-select>
</body>
</html>
```

### Search-Enabled Implementation

```html
<script type="module">
  import 'seo-select/components/seo-select-search';
</script>

<seo-select-search
  name="city"
  theme="float"
  language="en"
  show-reset>
  <option value="seoul">Seoul</option>
  <option value="tokyo">Tokyo</option>
  <option value="beijing">Beijing</option>
</seo-select-search>
```

### Multiple Selection Implementation

```html
<seo-select-search
  multiple
  name="skills"
  theme="float"
  show-reset>
  <option value="js">JavaScript</option>
  <option value="ts">TypeScript</option>
  <option value="python">Python</option>
</seo-select-search>
```

---

## Event System

### Standard addEventListener (Recommended)

```typescript
// Event listeners for custom events emitted by the component
// All event payloads are provided in event.detail

searchSelect.addEventListener('onSelect', (event: CustomEvent<{ label: string; value: string }>) => {
  console.log('Selected:', event.detail.label, event.detail.value);
});

searchSelect.addEventListener('onDeselect', (event: CustomEvent<{ label: string; value: string }>) => {
  console.log('Deselected:', event.detail.label, event.detail.value);
});

searchSelect.addEventListener(
  'onReset',
  (event: CustomEvent<{ value: string; label: string } | { values: string[]; labels: string[] }>) => {
    if ('values' in event.detail) {
      console.log('Reset multiple:', event.detail.values, event.detail.labels);
    } else {
      console.log('Reset single:', event.detail.value, event.detail.label);
    }
  }
);

searchSelect.addEventListener('onChange', () => {
  console.log('Value changed');
});

searchSelect.addEventListener('onOpen', (event: CustomEvent<{ selectInstance?: any }>) => {
  console.log('Dropdown opened', event.detail);
});

// Search-specific events (seo-select-search only)
searchSelect.addEventListener(
  'onSearchChange',
  (event: CustomEvent<{ searchText: string } | { searchText: string; previousSearchText: string }>) => {
    console.log('Search text changed:', event.detail.searchText);
  }
);

searchSelect.addEventListener(
  'onSearchFilter',
  (event: CustomEvent<{
    filteredOptions: VirtualSelectOption[];
    searchText: string;
    hasResults: boolean;
  }>) => {
    console.log(
      `Search filtered: ${event.detail.filteredOptions.length} results for "${event.detail.searchText}"`
    );
  }
);
```

### Type-Safe Helper Methods

```typescript
// Helper methods provide typed callbacks and cleaner syntax

searchSelect.onSelect(({ label, value }) => {
  console.log('Selected:', label, value);
});

searchSelect.onDeselect(({ label, value }) => {
  console.log('Deselected:', label, value);
});

searchSelect.onReset((detail) => {
  console.log('Reset event:', detail);
});

searchSelect.onChange(() => {
  console.log('Value changed');
});

searchSelect.onOpen(() => {
  console.log('Dropdown opened');
});

// Search-specific helper methods
searchSelect.onSearchChange((searchText) => {
  console.log('Search text changed:', searchText);
});

searchSelect.onSearchFilter((filteredOptions) => {
  console.log('Filtered results count:', filteredOptions.length);
});
```

### Programmatic Usage

```typescript
import 'seo-select/components/seo-select-search';

const select = document.createElement('seo-select-search');
select.optionItems = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' }
];
select.multiple = true;
select.theme = 'float';
select.language = 'ko';

document.body.appendChild(select);

select.addEventListener('onSelect', (event: CustomEvent<{ label: string; value: string }>) => {
  console.log('Selected:', event.detail.label, event.detail.value);
});

select.onSelect(({ label, value }) => {
  console.log('Selected:', label, value);
});
```

---

## Event Reference

### Common Events

| Event Name | Properties | Description |
|------------|------------|-------------|
| `onSelect` | `{ label, value }` | Triggered when an option is selected |
| `onDeselect` | `{ label, value }` | Triggered when an option is removed (multiple mode) |
| `onChange` | - | Triggered when the form value changes |
| `onReset` | `{ value, label }` or `{ values, labels }` | Triggered when the component resets to default |
| `onOpen` | - | Triggered when the dropdown opens |

### Search Component Events

| Event Name | Properties | Description |
|------------|------------|-------------|
| `onSearchChange` | `searchText: string` | Triggered when search text changes |
| `onSearchFilter` | `filteredOptions: VirtualSelectOption[]` | Triggered when search results are filtered |

---

## Component Properties

### Common Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | - | Form field name |
| `required` | `boolean` | `false` | Indicates whether the field is required |
| `multiple` | `boolean` | `false` | Enables multiple selection mode |
| `theme` | `'basic' \| 'float'` | `'float'` | Visual theme selection |
| `dark` | `boolean` | `false` | Enables dark mode |
| `language` | `'en' \| 'ko' \| 'ja' \| 'zh'` | `'en'` | Interface language |
| `showReset` | `boolean` | `true` | Displays reset button |
| `width` | `string` | `null` | Custom width (auto-calculated if not specified) |

### SeoSelectSearch Additional Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `searchTexts` | `Partial<SearchLocalizedTexts>` | `{}` | Custom search-related localization texts |

---

## Methods

### SeoSelect (Basic Component)

#### Value Management

```typescript
// Get/Set single value
const currentValue = select.value;
select.value = 'option1';

// Get/Set multiple values (when multiple=true)
const selectedValues = select.selectedValues;
select.selectedValues = ['opt1', 'opt3'];

// Reset to default value
select.resetToDefaultValue();
```

#### Dynamic Option Management

```typescript
// Replace existing options with new set
select.addOptions([
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' }
], preserveSelection);

// Add single option at specified position
select.addOption({ value: 'new', label: 'New Option' }, index);

// Remove specific option by value
select.clearOption('option-value-to-remove');

// Remove all options
select.clearAllOptions();

// Batch update operations (optimized for performance)
select.batchUpdateOptions([
  { action: 'add', option: { value: 'new1', label: 'New 1' } },
  { action: 'remove', value: 'old-option' },
  { action: 'update', value: 'existing', option: { value: 'existing', label: 'Updated Label' } }
]);
```

#### Customization Methods

```typescript
// Change language dynamically
select.setLanguage('ko');

// Set custom localized texts
select.setTexts({
  placeholder: 'Custom placeholder...',
  required: 'This field is required',
  resetToDefault: 'Reset selection'
});

// Enable/disable auto-width calculation
select.setAutoWidth(true);

// Clear internal caches (for memory optimization)
select.clearCaches();
```

#### Utility Methods

```typescript
// Get current option count
const optionCount = select.options.length;

// Get selected index (single mode only)
const selectedIndex = select.selectedIndex;

// Get default value
const defaultValue = select.defaultValue;

// Check if component has options
const hasOptions = !select.hasNoOptions();
```

### SeoSelectSearch (Search-Enhanced Component)

#### Search-Specific Methods

```typescript
// Set search text programmatically
searchSelect.onOpen(() => {
  searchSelect.searchText = 'Seoul';
  // Or clear previous search
  searchSelect.clearSearchText();
});

// Conditional search based on previous selection
let lastSelected = '';
searchSelect.onSelect((event) => {
  lastSelected = event.value;
});

searchSelect.onOpen(() => {
  if (lastSelected.startsWith('kr')) {
    searchSelect.searchText = 'Korean';
  }
});
```

#### Advanced Option Management

```typescript
// Update options while preserving search state
searchSelect.updateOptionsWithSearch([
  { value: 'opt1', label: 'Searchable Option 1' },
  { value: 'opt2', label: 'Searchable Option 2' }
], preserveSearch);

// Load options dynamically based on search
await searchSelect.loadOptionsForSearch('search term', async (searchText) => {
  const response = await fetch(`/api/search?q=${searchText}`);
  return await response.json();
});
```

#### Search Event Handling

```typescript
searchSelect.onSearchChange((searchText) => {
  console.log('User typed:', searchText);
});

searchSelect.onSearchFilter((filteredOptions) => {
  console.log(`Found ${filteredOptions.length} results`);
});
```

#### Custom Search Texts

```typescript
searchSelect.setSearchTexts({
  searchPlaceholder: 'Type to search...',
  noMatchText: 'No results found'
});
```

#### Performance Optimization

```typescript
// Use batch operations for large datasets
searchSelect.batchUpdateOptions(largeUpdateArray);

// Clear caches for frequent option updates
searchSelect.clearCaches();

// Preserve selection when updating options
searchSelect.addOptions(newOptions, true);
```

---

## Framework Integration

SeoSelect provides official wrapper components for major frameworks with native APIs, proper event handling, and TypeScript support.

### Supported Frameworks

| Framework | Import Path | Minimum Version |
|-----------|-------------|-----------------|
| React | `seo-select/react` | 17.0.0 |
| Vue | `seo-select/vue` | 3.0.0 |
| Angular | `seo-select/angular` | 14.0.0 |
| Solid.js | `seo-select/solid` | 1.0.0 |
| Qwik | `seo-select/qwik` | 1.0.0 |

All framework dependencies are optional peer dependencies.

---

### React

```tsx
import { SeoSelect, SeoSelectSearch } from 'seo-select/react';
import 'seo-select/styles';

export default function MyComponent() {
  const options = [
    { value: 'react', label: 'React' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'remix', label: 'Remix' }
  ];

  return (
    <SeoSelect
      name="framework"
      theme="float"
      language="ko"
      optionItems={options}
      onSelect={(e) => console.log('Selected:', e.detail)}
      onReset={(e) => console.log('Reset:', e.detail)}
    />
  );
}
```

#### With Search and Ref

```tsx
import { SeoSelectSearch, type SeoSelectRef } from 'seo-select/react';
import { useRef } from 'react';

export default function SearchExample() {
  const selectRef = useRef<SeoSelectRef>(null);

  const handleReset = () => {
    selectRef.current?.reset();
  };

  return (
    <>
      <SeoSelectSearch
        ref={selectRef}
        name="city"
        multiple
        showReset
        optionItems={[
          { value: 'seoul', label: 'Seoul' },
          { value: 'tokyo', label: 'Tokyo' },
          { value: 'beijing', label: 'Beijing' }
        ]}
        onSelect={(e) => console.log('Selected:', e.detail)}
        onSearchChange={(e) => console.log('Search:', e.detail.searchText)}
      />
      <button onClick={handleReset}>Reset</button>
    </>
  );
}
```

---

### Vue 3

```vue
<script setup lang="ts">
import { SeoSelect, SeoSelectSearch } from 'seo-select/vue';
import 'seo-select/styles';

const options = [
  { value: 'vue', label: 'Vue 3' },
  { value: 'nuxt', label: 'Nuxt 3' },
  { value: 'vite', label: 'Vite' }
];

const handleSelect = (detail: { label: string; value: string }) => {
  console.log('Selected:', detail);
};
</script>

<template>
  <SeoSelect
    name="framework"
    theme="float"
    :optionItems="options"
    @select="handleSelect"
  />
</template>
```

#### With Search and Multiple Selection

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { SeoSelectSearch } from 'seo-select/vue';

const selectRef = ref();

const handleReset = () => {
  selectRef.value?.reset();
};
</script>

<template>
  <SeoSelectSearch
    ref="selectRef"
    name="city"
    multiple
    showReset
    :optionItems="[
      { value: 'seoul', label: 'Seoul' },
      { value: 'tokyo', label: 'Tokyo' }
    ]"
    @select="(detail) => console.log('Selected:', detail)"
    @searchChange="(detail) => console.log('Search:', detail.searchText)"
  />
  <button @click="handleReset">Reset</button>
</template>
```

---

### Angular

```typescript
import { Component } from '@angular/core';
import { SeoSelectComponent, SeoSelectSearchComponent } from 'seo-select/angular';
import 'seo-select/styles';

@Component({
  selector: 'app-select-demo',
  standalone: true,
  imports: [SeoSelectComponent, SeoSelectSearchComponent],
  template: `
    <app-seo-select
      name="framework"
      theme="float"
      [optionItems]="options"
      (selectEvent)="onSelect($event)"
      (resetEvent)="onReset($event)"
    />
  `
})
export class SelectDemoComponent {
  options = [
    { value: 'angular', label: 'Angular' },
    { value: 'ionic', label: 'Ionic' },
    { value: 'ngrx', label: 'NgRx' }
  ];

  onSelect(detail: { label: string; value: string }) {
    console.log('Selected:', detail);
  }

  onReset(detail: any) {
    console.log('Reset:', detail);
  }
}
```

#### With Search

```typescript
@Component({
  selector: 'app-search-demo',
  standalone: true,
  imports: [SeoSelectSearchComponent],
  template: `
    <app-seo-select-search
      name="city"
      [multiple]="true"
      [showReset]="true"
      [optionItems]="options"
      (selectEvent)="onSelect($event)"
      (searchChangeEvent)="onSearchChange($event)"
    />
  `
})
export class SearchDemoComponent {
  options = [
    { value: 'seoul', label: 'Seoul' },
    { value: 'tokyo', label: 'Tokyo' }
  ];

  onSelect(detail: { label: string; value: string }) {
    console.log('Selected:', detail);
  }

  onSearchChange(detail: { searchText: string }) {
    console.log('Search:', detail.searchText);
  }
}
```

---

### Solid.js

```tsx
import { SeoSelect, SeoSelectSearch } from 'seo-select/solid';
import 'seo-select/styles';

export default function MyComponent() {
  const options = [
    { value: 'solid', label: 'Solid.js' },
    { value: 'start', label: 'SolidStart' }
  ];

  return (
    <SeoSelect
      name="framework"
      theme="float"
      optionItems={options}
      onSelect={(e) => console.log('Selected:', e.detail)}
    />
  );
}
```

#### With Ref

```tsx
import { SeoSelectSearch } from 'seo-select/solid';

export default function SearchExample() {
  let selectEl: HTMLElement | undefined;

  const handleReset = () => {
    (selectEl as any)?.reset?.();
  };

  return (
    <>
      <SeoSelectSearch
        ref={(el) => { selectEl = el; }}
        name="city"
        multiple
        optionItems={[
          { value: 'seoul', label: 'Seoul' },
          { value: 'tokyo', label: 'Tokyo' }
        ]}
        onSelect={(e) => console.log('Selected:', e.detail)}
        onSearchChange={(e) => console.log('Search:', e.detail.searchText)}
      />
      <button onClick={handleReset}>Reset</button>
    </>
  );
}
```

---

### Qwik

```tsx
import { component$ } from '@builder.io/qwik';
import { SeoSelect, SeoSelectSearch } from 'seo-select/qwik';
import 'seo-select/styles';

export const SelectDemo = component$(() => {
  const options = [
    { value: 'qwik', label: 'Qwik' },
    { value: 'qwikcity', label: 'QwikCity' }
  ];

  return (
    <SeoSelect
      name="framework"
      theme="float"
      optionItems={options}
      onSelect$={(e) => console.log('Selected:', e.detail)}
    />
  );
});
```

#### With Search

```tsx
import { component$ } from '@builder.io/qwik';
import { SeoSelectSearch } from 'seo-select/qwik';

export const SearchDemo = component$(() => {
  return (
    <SeoSelectSearch
      name="city"
      multiple
      showReset
      optionItems={[
        { value: 'seoul', label: 'Seoul' },
        { value: 'tokyo', label: 'Tokyo' }
      ]}
      onSelect$={(e) => console.log('Selected:', e.detail)}
      onSearchChange$={(e) => console.log('Search:', e.detail.searchText)}
    />
  );
});
```

---

### Vanilla JavaScript / Web Component

```typescript
import 'seo-select/types';
import 'seo-select/styles';
import 'seo-select/components/seo-select-search';

const select = document.createElement('seo-select-search');

select.optionItems = [
  { value: 'vanilla', label: 'Vanilla JS' },
  { value: 'typescript', label: 'TypeScript' }
];
select.theme = 'float';
select.multiple = true;

select.addEventListener('onSelect', (event) => {
  console.log('Selected:', event.detail);
});

document.body.appendChild(select);
```

---

## TypeScript Support

### Type Definitions

Import type definitions to enable full type safety and IntelliSense support:

```typescript
// Import type definitions (required once per project)
import 'seo-select/types';

// Import components
import 'seo-select';
import 'seo-select/components/seo-select-search';
```

This import provides:

- Full type safety for all event listeners (`addEventListener`)
- IntelliSense support for event properties (`event.label`, `event.value`)
- Global type extensions for `HTMLElementEventMap`
- Zero configuration requirement

### Basic Usage with Type Safety

```typescript
import 'seo-select/types';
import 'seo-select';

const select = document.createElement('seo-select');

select.addEventListener('onSelect', (event) => {
  console.log('Selected:', event.label, event.value);
});

select.addEventListener('onReset', (event) => {
  if (event.values) {
    console.log('Multiple reset:', event.values, event.labels);
  } else {
    console.log('Single reset:', event.value, event.label);
  }
});
```

### Advanced Usage with Specific Types

```typescript
import 'seo-select/types';
import type {
  VirtualSelectOption,
  SeoSelectElement,
  SeoSelectSearchElement,
  SupportedLanguage,
  BatchUpdateOption
} from 'seo-select/types';

const options: VirtualSelectOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'kr', label: 'South Korea' }
];

const selectElement = document.createElement('seo-select') as SeoSelectElement;
selectElement.optionItems = options;
selectElement.language = 'ko' as SupportedLanguage;

const updates: BatchUpdateOption[] = [
  { action: 'add', option: { value: 'jp', label: 'Japan' } },
  { action: 'remove', value: 'us' }
];
selectElement.batchUpdateOptions(updates);
```

### Available Types

| Category | Types |
|----------|-------|
| Component Elements | `SeoSelectElement`, `SeoSelectSearchElement` |
| Options and Data | `VirtualSelectOption`, `OptionItem`, `BatchUpdateOption` |
| Configuration | `SupportedLanguage`, `SelectTheme`, `LocalizedTexts`, `SearchLocalizedTexts` |
| Component Props | `SeoSelectProps`, `SeoSelectSearchProps` |
| Events | `ResetEventData`, `SeoSelectEventType`, `SeoSelectEvents` |

### Event Constants

```typescript
import { SeoSelectEvents } from 'seo-select/types';

select.addEventListener(SeoSelectEvents.SELECT, (event) => {
  console.log('Selected:', event.label);
});

select.addEventListener(SeoSelectEvents.SEARCH_CHANGE, (event) => {
  console.log('Search text:', event.detail);
});
```

---

## Styling and Customization

### Basic Styling Example

```css
seo-select {
  --select-border-color: #ccc;
  --select-focus-color: #007bff;
  --select-background: white;
  --select-text-color: #333;
}

/* Dark mode */
seo-select[dark] {
  --select-background: #374151;
  --select-text-color: #f3f4f6;
  --select-border-color: #6b7280;
}
```

### CSS Variables Reference

<details>
<summary><strong>Basic Layout and Sizing Variables</strong></summary>

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--select-padding` | `0.5rem 0.8rem` | Internal padding of select box |
| `--select-min-height` | `35px` | Minimum height of select component |
| `--select-min-width` | `150px` | Minimum width of select component |
| `--select-border-width` | `1px` | Border thickness |
| `--select-transition-duration` | `0.3s` | Animation transition duration |
| `--select-transition-easing` | `ease` | Animation easing function |
| `--select-font-size` | `12px` | Font size of select text |
| `--select-font-color` | `#1f1b25` | Font color of select text |

</details>

<details>
<summary><strong>Theme Styles</strong></summary>

**Basic Theme:**
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--select-basic-border-radius` | `0` | Border radius for basic theme |
| `--select-basic-box-shadow` | `none` | Box shadow for basic theme |
| `--select-basic-margin-bottom` | `0` | Bottom margin for basic theme |

**Float Theme:**
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--select-float-border-radius` | `5px` | Border radius for float theme |
| `--select-float-box-shadow` | `0 2px 4px rgba(0, 0, 0, 0.1)` | Box shadow for float theme |
| `--select-float-margin-bottom` | `0` | Bottom margin for float theme |

</details>

<details>
<summary><strong>Multiple Selection and Tags Variables</strong></summary>

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--select-multi-padding-right` | `3rem` | Right padding for multiple selection |
| `--select-tags-gap` | `0.25rem` | Gap between tags in multiple mode |
| `--select-tags-padding` | `0.25rem 0` | Padding around tags container |
| `--select-tags-min-height` | `1.5rem` | Minimum height of tags area |
| `--tag-padding` | `0.2rem 0.3rem` | Internal padding of tags |
| `--tag-gap` | `0.5rem` | Gap between individual tags |
| `--tag-border-radius` | `25rem` | Border radius of tags (pill shape) |
| `--tag-border-width` | `1px` | Border thickness of tags |
| `--tag-remove-size` | `1rem` | Size of tag remove button |
| `--tag-remove-border-radius` | `50%` | Border radius of remove button |
| `--tag-remove-transition` | `all 0.2s ease` | Transition for remove button |

</details>

<details>
<summary><strong>Dropdown Variables</strong></summary>

**Basic Dropdown:**
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--dropdown-box-shadow` | `0 5px 10px rgba(0, 0, 0, 0.1)` | Box shadow of dropdown |
| `--dropdown-border-width` | `1px` | Border thickness of dropdown |
| `--dropdown-z-index` | `1000` | Z-index stacking order |
| `--dropdown-basic-border-radius` | `0` | Border radius for basic theme dropdown |

**Float Theme Dropdown:**
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--dropdown-float-border-radius` | `5px` | Border radius for float theme dropdown |
| `--dropdown-float-box-shadow` | `0 8px 16px rgba(0, 0, 0, 0.15)` | Enhanced shadow for float theme |
| `--dropdown-float-top` | `130%` | Dropdown position from select box |
| `--dropdown-float-animation-duration` | `0.2s` | Animation duration for float theme |
| `--dropdown-float-animation-easing` | `ease-out` | Animation easing for float theme |
| `--dropdown-float-slide-distance` | `-20px` | Slide distance for animation |

</details>

<details>
<summary><strong>Search Input Variables</strong></summary>

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--search-input-padding` | `0.3rem` | Internal padding of search input |
| `--search-input-text-indent` | `1.5rem` | Text indentation for search icon space |
| `--search-icon-left` | `0.7rem` | Left position of search icon |
| `--search-icon-size` | `1rem` | Size of search icon |

</details>

<details>
<summary><strong>Loading State Variables</strong></summary>

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--loading-container-padding` | `1rem 2rem` | Padding around loading container |
| `--loading-dots-gap` | `0.5rem` | Gap between loading dots |
| `--loading-dots-margin-bottom` | `1rem` | Bottom margin of dots container |
| `--loading-dot-size` | `0.5rem` | Size of individual loading dots |
| `--loading-animation-duration` | `1.4s` | Duration of loading animation |
| `--loading-text-font-size` | `0.9rem` | Font size of loading text |
| `--loading-dot-delay-1` | `-0.32s` | Animation delay for first dot |
| `--loading-dot-delay-2` | `-0.16s` | Animation delay for second dot |
| `--loading-dot-delay-3` | `0s` | Animation delay for third dot |

</details>

<details>
<summary><strong>Empty State Variables</strong></summary>

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--no-data-container-padding` | `1rem 2rem` | Padding of "no data" container |
| `--no-data-text-font-size` | `0.9rem` | Font size of "no data" text |

</details>

<details>
<summary><strong>Option Items Variables</strong></summary>

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--option-padding` | `0 0.8rem` | Internal padding of option items |
| `--option-line-height` | `300%` | Line height of option items |
| `--option-check-mark-margin` | `0.5rem` | Margin of checkmark in options |

</details>

<details>
<summary><strong>Reset Button Variables</strong></summary>

**Single Select Reset:**
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--reset-button-right` | `3rem` | Right position of reset button |
| `--reset-button-padding` | `0 0.5rem` | Internal padding of reset button |
| `--reset-button-height` | `80%` | Height of reset button |
| `--reset-button-font-size` | `0.9rem` | Font size of reset button |
| `--reset-button-transition` | `all 0.2s ease` | Transition for reset button |

**Multiple Select Reset:**
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--multi-reset-button-size` | `1.5rem` | Size of multi-select reset button |
| `--multi-reset-button-position` | `-0.6rem` | Position adjustment for multi reset |
| `--multi-reset-button-border-radius` | `50%` | Border radius of multi reset button |
| `--multi-reset-button-font-size` | `0.9rem` | Font size of multi reset button |

</details>

<details>
<summary><strong>Dropdown Arrow Variables</strong></summary>

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--arrow-right` | `0.8rem` | Right position of dropdown arrow |
| `--arrow-font-size` | `0.9rem` | Font size of dropdown arrow |
| `--arrow-margin-top` | `-0.1rem` | Top margin adjustment for arrow |
| `--arrow-transition` | `transform 0.2s ease` | Transition for arrow rotation |

</details>

<details>
<summary><strong>Color Palette Variables</strong></summary>

**Primary Colors:**
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--primary-color` | `#3253de` | Main brand color |
| `--primary-hover` | `#003766` | Primary color on hover state |
| `--primary-bg-color` | `#e5f1fbf2` | Primary background color |
| `--secondary-color` | `#5f77ca` | Secondary brand color |
| `--secondary-hover` | `#303c65f2` | Secondary color on hover state |
| `--secondary-bg-color` | `#eff1faf2` | Secondary background color |

**Semantic State Colors:**
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--success-color` | `pick(green, 5)` | Success state color |
| `--success-hover` | `pick(green, 6)` | Success color on hover |
| `--success-bg-color` | `pick(green, 0)` | Success background color |
| `--error-color` | `pick(red, 5)` | Error state color |
| `--error-hover` | `pick(red, 6)` | Error color on hover |
| `--error-bg-color` | `color.mix(#fff, pick(red, 1), 25%)` | Error background color |
| `--warning-color` | `pick(orange, 4)` | Warning state color |
| `--warning-hover` | `pick(orange, 5)` | Warning color on hover |
| `--warning-bg-color` | `color.mix(#fff, pick(orange, 1), 25%)` | Warning background color |
| `--disabled-color` | `color.adjust(pick(gray, 3), $lightness: 5%)` | Disabled element color |

**Typography Colors:**
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--font-color` | `color.mix(#000, pick(indigo, 10), 70%)` | Primary text color |
| `--font-secondary-color` | `pick(gray, 5)` | Secondary text color |

**UI Element Colors:**
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--border-color` | `pick(gray, 3)` | Default border color |
| `--box-head-border-color` | `color.mix(#fff, pick(gray, 2), 35%)` | Box header border color |

**Extended Color Palette (Open Color System):**
The component utilizes a color system based on Open Color with primary color mixing:

| Color Name | Usage | Available Shades |
|------------|-------|------------------|
| `gray` | Neutral elements, borders, backgrounds | 0-10 (lightest to darkest) |
| `red` | Error states, destructive actions | 0-10 |
| `pink` | Accent colors, highlights | 0-10 |
| `grape` | Decorative elements | 0-10 |
| `violet` | Special highlights | 0-10 |
| `indigo` | Primary variants | 0-10 |
| `blue` | Information states, links | 0-10 |
| `cyan` | Cool accents | 0-10 |
| `teal` | Fresh accents | 0-10 |
| `green` | Success states, positive actions | 0-10 |
| `lime` | Fresh highlights | 0-10 |
| `yellow` | Warning states, attention | 0-10 |
| `orange` | Warning states, alerts | 0-10 |

**Color System Usage:**
```scss
.my-element {
  background-color: pick(blue, 2);    // Light blue
  border-color: pick(blue, 5);        // Medium blue
  color: pick(blue, 8);               // Dark blue
}
```

</details>

<details>
<summary><strong>Dark Mode Color Variables</strong></summary>

**Background Colors:**
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--dark-select-bg` | `#374151` | Background color in dark mode |
| `--dark-dropdown-bg` | `#374151` | Dropdown background in dark mode |
| `--dark-tag-bg` | `#4b5563` | Tag background in dark mode |
| `--dark-search-input-bg` | `#374151` | Search input background in dark mode |
| `--dark-accent-bg` | `#1f2937` | Darker background for special elements |
| `--dark-card-bg` | `#374151` | Card/container background |
| `--dark-surface-bg` | `#4b5563` | Surface element background |

**Border Colors:**
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--dark-border-color` | `#6b7280` | Border color in dark mode |
| `--dark-border-hover-color` | `#60a5fa` | Border color on hover in dark mode |
| `--dark-border-focus-color` | `#60a5fa` | Border color on focus in dark mode |

**Text Colors:**
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--dark-text-color` | `#f3f4f6` | Primary text color in dark mode |
| `--dark-text-secondary-color` | `#d1d5db` | Secondary text color in dark mode |
| `--dark-placeholder-color` | `#9ca3af` | Placeholder color in dark mode |
| `--dark-highlight-color` | `#fbbf24` | Highlight/accent color in dark mode |

**Dark Mode State Colors:**
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--dark-success-color` | `#10b981` | Success state color in dark mode |
| `--dark-warning-color` | `#f59e0b` | Warning state color in dark mode |
| `--dark-error-color` | `#ef4444` | Error state color in dark mode |
| `--dark-info-color` | `#3b82f6` | Information state color in dark mode |

**Option Colors:**
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--dark-option-hover-bg` | `#4b5563` | Option background on hover |
| `--dark-option-selected-bg` | `#3b82f6` | Selected option background |
| `--dark-option-focused-bg` | `#4b5563` | Focused option background |
| `--dark-option-disabled-color` | `#9ca3af` | Disabled option text color |

**Tag Colors:**
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--dark-tag-text-color` | `#f3f4f6` | Tag text color in dark mode |
| `--dark-tag-border-color` | `#60a5fa` | Tag border color in dark mode |
| `--dark-tag-remove-hover-bg` | `#ef4444` | Tag remove button hover background |

**Button Colors:**
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--dark-reset-button-color` | `#d1d5db` | Reset button color in dark mode |
| `--dark-reset-button-hover-color` | `#ef4444` | Reset button hover color |
| `--dark-multi-reset-button-bg` | `#6b7280` | Multi reset button background |

**Shadow Effects:**
| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--dark-float-box-shadow` | `0 4px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)` | Float theme shadow in dark mode |
| `--dark-dropdown-box-shadow` | `0 10px 20px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)` | Dropdown shadow in dark mode |
| `--dark-search-input-focus-shadow` | `0 0 0 2px rgba(96, 165, 250, 0.3), 0 4px 12px rgba(0, 0, 0, 0.3)` | Search input focus shadow |

</details>

---

## License

MIT License - Refer to the [LICENSE](LICENSE) file for details.
