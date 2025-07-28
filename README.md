# seo-select
<img width="300" height="300" alt="logo" src="https://github.com/user-attachments/assets/e567ea31-d046-45b3-80d1-9a1e32c7e002" />

A highly customizable and accessible select component with search functionality built with Lit. Supports virtual scrolling, multiple selection, internationalization, and modern theming.

## Features

- 🎨 **Multiple Themes**: Basic, float themes with dark mode support
- 🌍 **Internationalization**: Built-in support for multiple languages (EN, KO, JA, ZH)
- 🔍 **Search Functionality**: Advanced multilingual search with fuzzy matching
- ♿ **Accessibility**: Full keyboard navigation and screen reader support
- 🚀 **Virtual Scrolling**: High performance with large datasets
- 📏 **Auto Width**: Automatic width calculation based on content
- 🎯 **Multiple Selection**: Tag-based multi-select with individual remove buttons
- 💡 **TypeScript**: Full TypeScript support with comprehensive type definitions

## Installation

```bash
npm install seo-select
```

## Import Methods

### ES6 Modules (Recommended)

```javascript
// Import basic select component
import 'seo-select';

// Import search-enabled select component
import 'seo-select/components/seo-select-search';

// Import both components
import 'seo-select';
import 'seo-select/components/seo-select-search';
```

### Script Tags (Browser)

```html
<!-- Via CDN -->
<script type="module" src="https://unpkg.com/seo-select@latest/dist/seo-select.js"></script>
<script type="module" src="https://unpkg.com/seo-select@latest/dist/components/seo-select-search.js"></script>

<!-- Local files -->
<script type="module" src="./node_modules/seo-select/dist/seo-select.js"></script>
<script type="module" src="./node_modules/seo-select/dist/components/seo-select-search.js"></script>
```

### CommonJS (Node.js)

```javascript
// For server-side rendering or Node.js environments
require('seo-select');
require('seo-select/components/seo-select-search');
```

## Components Overview

### `seo-select` - Basic Select Component

The foundational select component with essential features:

- Standard dropdown functionality
- Virtual scrolling for large datasets
- Multiple selection support
- Theme and dark mode support
- Form integration
- Keyboard navigation

### `seo-select-search` - Search-Enhanced Select Component

Extended component with advanced search capabilities:

- All features of `seo-select`
- Real-time multilingual search
- Korean initial consonant search (ㅎㄱㅇ → 한국어)
- Japanese romaji search (nihongo → 日本語)
- Chinese pinyin search (beijing → 北京)
- Fuzzy matching across languages

## Use Cases & When to Use Each Component

### Use `seo-select` when:

#### ✅ Small to Medium Option Lists (< 50 items)
```html
<seo-select name="priority" width="150px">
  <option value="low">Low</option>
  <option value="medium">Medium</option>
  <option value="high">High</option>
  <option value="urgent">Urgent</option>
</seo-select>
```

#### ✅ Form Controls with Known Options
```html
<seo-select name="country" required>
  <option value="">Select Country</option>
  <option value="us">United States</option>
  <option value="kr">South Korea</option>
  <option value="jp">Japan</option>
</seo-select>
```

#### ✅ Settings and Configuration Panels
```html
<seo-select name="theme" theme="float" dark>
  <option value="auto">Auto</option>
  <option value="light">Light Mode</option>
  <option value="dark">Dark Mode</option>
</seo-select>
```

#### ✅ Multi-Select with Limited Options
```html
<seo-select multiple name="permissions" width="300px">
  <option value="read">Read</option>
  <option value="write">Write</option>
  <option value="delete">Delete</option>
  <option value="admin">Admin</option>
</seo-select>
```

### Use `seo-select-search` when:

#### ✅ Large Option Lists (50+ items)
```html
<seo-select-search name="city" width="300px">
  <!-- Hundreds of cities -->
  <option value="seoul">Seoul (서울)</option>
  <option value="tokyo">Tokyo (東京)</option>
  <option value="beijing">Beijing (北京)</option>
  <!-- ... hundreds more -->
</seo-select-search>
```

#### ✅ Multilingual Content
```html
<seo-select-search name="product" language="ko" width="350px">
  <option value="phone">스마트폰 (Smartphone)</option>
  <option value="laptop">노트북 (Laptop)</option>
  <option value="tablet">태블릿 (Tablet)</option>
</seo-select-search>
```

#### ✅ User-Friendly Data Entry
```html
<!-- Users can type "js" or "javascript" to find JavaScript -->
<seo-select-search multiple name="skills" width="400px">
  <option value="javascript">JavaScript</option>
  <option value="typescript">TypeScript</option>
  <option value="python">Python</option>
  <option value="react">React</option>
</seo-select-search>
```

#### ✅ Dynamic Data Loading
```html
<seo-select-search id="async-select" name="users" width="300px">
  <!-- Options loaded via API -->
</seo-select-search>

<script>
  // Load thousands of users from API
  fetch('/api/users')
    .then(response => response.json())
    .then(users => {
      document.getElementById('async-select').optionItems = users.map(user => ({
        value: user.id,
        label: `${user.name} (${user.email})`
      }));
    });
</script>
```

#### ✅ International Applications
```html
<!-- Supports Korean initial consonants, Japanese romaji, Chinese pinyin -->
<seo-select-search name="location" language="en" width="300px">
  <option value="kr-seoul">서울, 대한민국 (Seoul, South Korea)</option>
  <option value="jp-tokyo">東京, 日本 (Tokyo, Japan)</option>
  <option value="cn-beijing">北京, 中国 (Beijing, China)</option>
</seo-select-search>
```

## Performance Guidelines

| Scenario | Component | Reason |
|----------|-----------|---------|
| < 20 options | `seo-select` | Minimal overhead, faster rendering |
| 20-50 options | Either | Personal preference, both perform well |
| 50-1000 options | `seo-select-search` | Search reduces cognitive load |
| 1000+ options | `seo-select-search` | Virtual scrolling + search essential |
| Multilingual | `seo-select-search` | Advanced search algorithms needed |
| Form controls | `seo-select` | Simpler UI, standard behavior |
| Data exploration | `seo-select-search` | Search enhances discoverability |

## Basic Usage Examples

### Simple Select

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

### Search-enabled Select

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

### Multiple Selection

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

## JavaScript/TypeScript Usage

```typescript
import { SeoSelect, SeoSelectSearch } from 'seo-select';

// Create programmatically
const select = new SeoSelectSearch();
select.optionItems = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' }
];
select.multiple = true;
select.theme = 'float';
select.language = 'ko';

document.body.appendChild(select);

// Event handling
select.addEventListener('onSelect', (e) => {
  console.log('Selected:', e.detail);
});

select.addEventListener('onChange', (e) => {
  console.log('Value changed:', select.value);
});
```

## Component Properties

### Common Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | - | Form field name |
| `required` | `boolean` | `false` | Whether the field is required |
| `multiple` | `boolean` | `false` | Enable multiple selection |
| `theme` | `'basic' \| 'float'` | `'float'` | Visual theme |
| `dark` | `boolean` | `false` | Enable dark mode |
| `language` | `'en' \| 'ko' \| 'ja' \| 'zh'` | `'en'` | Interface language |
| `showReset` | `boolean` | `true` | Show reset button |
| `width` | `string` | `null` | Custom width (auto-calculated if not set) |
| `height` | `string` | `'100%'` | Component height |

### SeoSelectSearch Additional Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `searchTexts` | `Partial<SearchLocalizedTexts>` | `{}` | Custom search-related texts |

## Methods

### SeoSelect

```typescript
// Value management
select.value = 'option1';                    // Set single value
select.selectedValues = ['opt1', 'opt2'];    // Set multiple values (multiple mode)

// Language and customization
select.setLanguage('ko');                     // Change language
select.setTexts({ placeholder: 'Custom...' }); // Custom texts

// Options management
select.optionItems = newOptions;              // Set options programmatically

// Utility
select.resetToDefaultValue();                 // Reset to default
```

### SeoSelectSearch

```typescript
// Inherits all SeoSelect methods plus:
select.setSearchTexts({ 
  searchPlaceholder: 'Type to search...',
  noMatchText: 'No results found'
});

// Test search functionality (for debugging)
const matches = select.testMultilingualSearch('search', 'target');
```

## Events

| Event Name | Detail | Description |
|------------|--------|-------------|
| `onSelect` | `{ value, label }` | Item selected |
| `onDeselect` | `{ value, label }` | Item deselected (multiple mode) |
| `onChange` | - | Value changed |
| `onReset` | `{ value, label }` or `{ values, labels }` | Reset to default |

## Styling and Customization

The component comes with built-in themes, but you can extensively customize the appearance using CSS variables.

### Quick Styling Example

```css
seo-select {
  --select-border-color: #ccc;
  --select-focus-color: #007bff;
  --select-background: white;
  --select-text-color: #333;
}

/* Dark mode */
seo-select.dark {
  --select-background: #374151;
  --select-text-color: #f3f4f6;
  --select-border-color: #6b7280;
}
```

### Complete CSS Variables Reference

<details>
<summary><strong>📏 Layout & Sizing Variables</strong></summary>

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--select-padding` | `0.5rem 0.8rem` | Internal padding of select box |
| `--select-min-height` | `2.5rem` | Minimum height of select component |
| `--select-border-width` | `1px` | Border thickness |
| `--select-multi-padding-right` | `3rem` | Right padding for multiple selection |
| `--select-tags-gap` | `0.25rem` | Gap between tags in multiple mode |
| `--select-tags-padding` | `0.25rem 0` | Padding around tags container |
| `--select-tags-min-height` | `1.5rem` | Minimum height of tags area |

</details>

<details>
<summary><strong>🎨 Theme & Visual Variables</strong></summary>

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--select-transition-duration` | `0.3s` | Animation transition duration |
| `--select-transition-easing` | `ease` | Animation easing function |
| `--select-basic-border-radius` | `0` | Border radius for basic theme |
| `--select-float-border-radius` | `5px` | Border radius for float theme |
| `--select-basic-box-shadow` | `none` | Box shadow for basic theme |
| `--select-float-box-shadow` | `0 2px 4px rgba(0, 0, 0, 0.1)` | Box shadow for float theme |

</details>

<details>
<summary><strong>🏷️ Tags & Multiple Selection Variables</strong></summary>

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--tag-padding` | `0.2rem 0.3rem` | Internal padding of tags |
| `--tag-gap` | `0.5rem` | Gap between individual tags |
| `--tag-border-radius` | `25rem` | Border radius of tags (pill shape) |
| `--tag-border-width` | `1px` | Border thickness of tags |
| `--tag-font-size` | `1.2rem` | Font size within tags |
| `--tag-remove-size` | `1rem` | Size of tag remove button |
| `--tag-remove-border-radius` | `50%` | Border radius of remove button |
| `--tag-remove-transition` | `all 0.2s ease` | Transition for remove button |

</details>

<details>
<summary><strong>📋 Dropdown & Options Variables</strong></summary>

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--dropdown-box-shadow` | `0 5px 10px rgba(0, 0, 0, 0.1)` | Box shadow of dropdown |
| `--dropdown-border-width` | `1px` | Border thickness of dropdown |
| `--dropdown-z-index` | `1000` | Z-index stacking order |
| `--dropdown-basic-border-radius` | `0` | Border radius for basic theme dropdown |
| `--dropdown-float-border-radius` | `5px` | Border radius for float theme dropdown |
| `--dropdown-float-box-shadow` | `0 8px 16px rgba(0, 0, 0, 0.15)` | Enhanced shadow for float theme |
| `--dropdown-float-top` | `130%` | Dropdown position from select box |
| `--option-padding` | `0 0.8rem` | Internal padding of option items |
| `--option-line-height` | `300%` | Line height of option items |
| `--option-check-mark-margin` | `0.5rem` | Margin of checkmark in options |

</details>

<details>
<summary><strong>🔍 Search Input Variables</strong></summary>

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--search-input-padding` | `0.3rem` | Internal padding of search input |
| `--search-input-text-indent` | `1.5rem` | Text indentation for search icon space |
| `--search-icon-left` | `0.7rem` | Left position of search icon |
| `--search-icon-size` | `1rem` | Size of search icon |

</details>

<details>
<summary><strong>⏳ Loading & Empty State Variables</strong></summary>

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--loading-container-padding` | `1rem 2rem` | Padding around loading container |
| `--loading-dots-gap` | `0.5rem` | Gap between loading dots |
| `--loading-dots-margin-bottom` | `1rem` | Bottom margin of dots container |
| `--loading-dot-size` | `0.5rem` | Size of individual loading dots |
| `--loading-animation-duration` | `1.4s` | Duration of loading animation |
| `--loading-text-font-size` | `0.9rem` | Font size of loading text |
| `--no-data-container-padding` | `1rem 2rem` | Padding of "no data" container |
| `--no-data-text-font-size` | `0.9rem` | Font size of "no data" text |

</details>

<details>
<summary><strong>🔄 Reset Button & Controls Variables</strong></summary>

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--reset-button-right` | `3rem` | Right position of reset button |
| `--reset-button-padding` | `0 0.5rem` | Internal padding of reset button |
| `--reset-button-height` | `80%` | Height of reset button |
| `--reset-button-font-size` | `0.9rem` | Font size of reset button |
| `--reset-button-transition` | `all 0.2s ease` | Transition for reset button |
| `--multi-reset-button-size` | `1.5rem` | Size of multi-select reset button |
| `--multi-reset-button-position` | `-0.6rem` | Position adjustment for multi reset |
| `--multi-reset-button-border-radius` | `50%` | Border radius of multi reset button |
| `--arrow-right` | `0.8rem` | Right position of dropdown arrow |
| `--arrow-font-size` | `0.9rem` | Font size of dropdown arrow |
| `--arrow-transition` | `transform 0.2s ease` | Transition for arrow rotation |

</details>

<details>
<summary><strong>🌙 Dark Mode Color Variables</strong></summary>

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--dark-select-bg` | `#374151` | Background color in dark mode |
| `--dark-dropdown-bg` | `#374151` | Dropdown background in dark mode |
| `--dark-tag-bg` | `#4b5563` | Tag background in dark mode |
| `--dark-search-input-bg` | `#374151` | Search input background in dark mode |
| `--dark-border-color` | `#6b7280` | Border color in dark mode |
| `--dark-border-hover-color` | `#60a5fa` | Border color on hover in dark mode |
| `--dark-border-focus-color` | `#60a5fa` | Border color on focus in dark mode |
| `--dark-text-color` | `#f3f4f6` | Primary text color in dark mode |
| `--dark-text-secondary-color` | `#d1d5db` | Secondary text color in dark mode |
| `--dark-placeholder-color` | `#9ca3af` | Placeholder color in dark mode |
| `--dark-option-hover-bg` | `#4b5563` | Option background on hover |
| `--dark-option-selected-bg` | `#3b82f6` | Selected option background |
| `--dark-option-focused-bg` | `#4b5563` | Focused option background |
| `--dark-tag-text-color` | `#f3f4f6` | Tag text color in dark mode |
| `--dark-tag-border-color` | `#60a5fa` | Tag border color in dark mode |
| `--dark-tag-remove-hover-bg` | `#ef4444` | Tag remove button hover background |
| `--dark-reset-button-color` | `#d1d5db` | Reset button color in dark mode |
| `--dark-reset-button-hover-color` | `#ef4444` | Reset button hover color |

</details>

### Advanced Customization Examples

```css
/* Custom brand colors */
seo-select {
  --select-focus-color: #ff6b6b;
  --select-float-box-shadow: 0 4px 12px rgba(255, 107, 107, 0.15);
  --tag-border-color: #ff6b6b;
  --dropdown-float-box-shadow: 0 10px 25px rgba(255, 107, 107, 0.1);
}

/* Compact size variant */
seo-select.compact {
  --select-min-height: 2rem;
  --select-padding: 0.25rem 0.5rem;
  --tag-padding: 0.1rem 0.25rem;
  --tag-font-size: 0.875rem;
}

/* Large size variant */
seo-select.large {
  --select-min-height: 3.5rem;
  --select-padding: 0.75rem 1rem;
  --tag-padding: 0.375rem 0.5rem;
  --tag-font-size: 1rem;
}

/* Custom dark theme */
seo-select[dark] {
  --dark-select-bg: #1a1a1a;
  --dark-text-color: #ffffff;
  --dark-border-color: #333333;
  --dark-option-hover-bg: #2a2a2a;
}
```

## Framework Integration Examples

### React Integration

```jsx
import { useEffect, useRef } from 'react';
import 'seo-select';

function MyComponent() {
  const selectRef = useRef(null);

  useEffect(() => {
    const handleSelect = (e) => {
      console.log('Selected:', e.detail);
    };

    const selectElement = selectRef.current;
    selectElement?.addEventListener('onSelect', handleSelect);

    return () => {
      selectElement?.removeEventListener('onSelect', handleSelect);
    };
  }, []);

  return (
    <seo-select ref={selectRef} name="example">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </seo-select>
  );
}
```

### Vue Integration

```vue
<template>
  <seo-select 
    name="example"
    @onSelect="handleSelect"
  >
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
  </seo-select>
</template>

<script setup>
import 'seo-select';

const handleSelect = (event) => {
  console.log('Selected:', event.detail);
};
</script>
```

### Angular Integration

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core';
import 'seo-select';

@Component({
  selector: 'app-root',
  template: `
    <seo-select name="example" (onSelect)="onSelect($event)">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </seo-select>
  `
})
export class AppComponent {
  onSelect(event: CustomEvent) {
    console.log('Selected:', event.detail);
  }
}
```

## Migration Guide

### From Standard HTML Select

```html
<!-- Before: Standard HTML select -->
<select name="country">
  <option value="us">United States</option>
  <option value="kr">South Korea</option>
</select>

<!-- After: seo-select -->
<script type="module">
  import 'seo-select';
</script>
<seo-select name="country">
  <option value="us">United States</option>
  <option value="kr">South Korea</option>
</seo-select>
```

### Adding Search Functionality

```html
<!-- Step 1: Change import -->
<script type="module">
  import 'seo-select/components/seo-select-search';
</script>

<!-- Step 2: Change tag name -->
<seo-select-search name="country">
  <option value="us">United States</option>
  <option value="kr">South Korea</option>
</seo-select-search>
```

## Repository

- **GitHub**: [https://github.com/seadonggyun4/seo-select](https://github.com/seadonggyun4/seo-select)
- **NPM**: [https://www.npmjs.com/package/seo-select](https://www.npmjs.com/package/seo-select)

## License

MIT License

## Changelog

### 1.0.10
- Initial release
- Basic select functionality
- Search component with multilingual support
- Multiple themes (basic, float)
- Dark mode support
- Internationalization (EN, KO, JA, ZH)
- Virtual scrolling for performance
- Full accessibility support
- TypeScript definitions
- Fix tag style and Optimize rendering options
- Fix seo-select-search reset logic