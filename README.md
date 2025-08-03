# seo-select
<img width="300" height="300" alt="logo" src="https://github.com/user-attachments/assets/e567ea31-d046-45b3-80d1-9a1e32c7e002" />

A highly customizable and accessible select component with search functionality built with Lit. Supports virtual scrolling, multiple selection, internationalization, and modern theming.

Demo Site: https://seo-select.netlify.app/

## Features

- 🎨 **Multiple Themes**: Basic, float themes with dark mode support
- 🌍 **Internationalization**: Built-in support for multiple languages (EN, KO, JA, ZH)
- 🔍 **Search Functionality**: Advanced multilingual search with fuzzy matching
- ♿ **Accessibility**: Full keyboard navigation and screen reader support
- 🚀 **Virtual Scrolling**: High performance with large datasets
- 📏 **Auto Width**: Automatic width calculation based on content
- 🎯 **Multiple Selection**: Tag-based multi-select with individual remove buttons
- 💡 **TypeScript**: Full TypeScript support with comprehensive type definitions
- ⚡ **Modern Event System**: Type-safe event handling with enhanced performance

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

// Import event classes (optional, for advanced usage)
import { 
  SeoSelectEvent, 
  triggerSelectEvent,
  SeoSelectEventMap 
} from 'seo-select/event';

// Import both components
import 'seo-select';
import 'seo-select/components/seo-select-search';
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

// Event handling (New event system)
select.addEventListener('onSelect', (e) => {
  // New event system: direct property access
  console.log('Selected:', { label: e.label, value: e.value });
  
  // Backward compatibility: detail object still works
  console.log('Selected (legacy):', e.detail);
});

select.addEventListener('onChange', (e) => {
  console.log('Value changed:', select.value);
});

// Type-safe event listeners (recommended for TypeScript)
if (typeof select.addSeoSelectEventListener === 'function') {
  select.addSeoSelectEventListener('onSelect', (event) => {
    // TypeScript will infer the correct event type
    console.log('Type-safe event:', event.label, event.value);
  });
}
```

## Event System

### 🆕 Enhanced Event System (v1.0.21+)

The component now features a modern, type-safe event system with backward compatibility:

#### Event Classes

| Event Class | Properties | Description |
|-------------|------------|-------------|
| `SeoSelectEvent` | `label: string`, `value: string` | Base selection event |
| `SeoDeselectEvent` | `label: string`, `value: string` | Item deselection event |
| `SeoResetEvent` | `label?`, `value?`, `labels?`, `values?` | Reset to default event |
| `SeoChangeEvent` | - | Form value change event |

#### Event Usage

```typescript
// New way: Direct property access
element.addEventListener('onSelect', (event) => {
  console.log(event.label, event.value); // Direct access
});

// Legacy way: Still supported
element.addEventListener('onSelect', (event) => {
  console.log(event.detail.label, event.detail.value); // Works as before
});

// Type-safe way (recommended)
import type { SeoSelectEventListener } from 'seo-select/event';

const handleSelect: SeoSelectEventListener<'onSelect'> = (event) => {
  // TypeScript knows event.label and event.value exist
  console.log(event.label, event.value);
};

element.addSeoSelectEventListener('onSelect', handleSelect);
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

// Event management (New)
select.addSeoSelectEventListener('onSelect', handler);    // Type-safe listener
select.removeSeoSelectEventListener('onSelect', handler); // Remove listener

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

## Events Reference

### Event Types

| Event Name | Timing | Properties | Description |
|------------|--------|------------|-------------|
| `onSelect` | Item selection | `{ label, value }` | User selects an option |
| `onDeselect` | Item removal | `{ label, value }` | User removes selected option (multiple mode) |
| `onChange` | Value change | - | Form value changes (standard HTML event) |
| `onReset` | Reset action | `{ value, label }` or `{ values, labels }` | Component resets to default |

### Event Timing Explanation

```javascript
// When user clicks an option:
// 1. onSelect fires immediately (UI feedback)
// 2. onChange fires after (form processing)

// onSelect: "I chose React!"
element.addEventListener('onSelect', (e) => {
  showNotification(`Selected: ${e.label}`); // Immediate feedback
});

// onChange: "The form value is now 'react'"  
element.addEventListener('onChange', (e) => {
  validateForm(); // Form processing
  syncDatabase(e.target.value); // Data persistence
});
```

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
import 'seo-select/components/seo-select-search';

function MyComponent() {
  const selectRef = useRef(null);

  useEffect(() => {
    const select = document.createElement('seo-select-search');
    select.optionItems = [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue' },
      { value: 'angular', label: 'Angular' }
    ];
    select.multiple = true;
    select.theme = 'float';
    
    const container = selectRef.current;
    container.appendChild(select);

    const handleSelect = (e) => {
      // New event system: direct property access
      console.log('Selected:', { label: e.label, value: e.value });
      
      // Legacy fallback
      if (!e.label && e.detail) {
        console.log('Selected (legacy):', e.detail);
      }
    };

    select.addEventListener('onSelect', handleSelect);

    return () => {
      select.removeEventListener('onSelect', handleSelect);
      container.removeChild(select);
    };
  }, []);

  return (
    <div>
      {/* HTML method */}
      <seo-select name="framework1">
        <option value="react">React</option>
        <option value="vue">Vue</option>
        <option value="angular">Angular</option>
      </seo-select>

      {/* Programming method */}
      <div ref={selectRef}></div>
    </div>
  );
}

// TypeScript declarations
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'seo-select': any;
      'seo-select-search': any;
    }
  }
}
```

### Vue Integration

```vue
<template>
  <div>
    <!-- HTML method -->
    <seo-select 
      name="framework1"
      @onSelect="handleSelect"
    >
      <option value="vue">Vue</option>
      <option value="react">React</option>
      <option value="angular">Angular</option>
    </seo-select>

    <!-- Programming method -->
    <div ref="selectContainer"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import 'seo-select/components/seo-select-search';

const selectContainer = ref(null);

onMounted(() => {
  const select = document.createElement('seo-select-search');
  select.optionItems = [
    { value: 'vue', label: 'Vue.js' },
    { value: 'nuxt', label: 'Nuxt.js' },
    { value: 'quasar', label: 'Quasar' }
  ];
  select.theme = 'float';
  select.showReset = true;

  selectContainer.value.appendChild(select);

  select.addEventListener('onSelect', (e) => {
    // New event system
    console.log('Vue - Selected:', { label: e.label, value: e.value });
    
    // Legacy fallback
    if (!e.label && e.detail) {
      console.log('Vue - Selected (legacy):', e.detail);
    }
  });
});

const handleSelect = (event) => {
  // New event system: direct property access
  console.log('HTML - Selected:', { label: event.label, value: event.value });
  
  // Legacy fallback
  if (!event.label && event.detail) {
    console.log('HTML - Selected (legacy):', event.detail);
  }
};
</script>
```

### Angular Integration

```typescript
import { Component, OnInit, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'seo-select/components/seo-select-search';

@Component({
  selector: 'app-example',
  template: `
    <!-- HTML method -->
    <seo-select 
      name="framework1" 
      (onSelect)="handleSelect($event)"
    >
      <option value="angular">Angular</option>
      <option value="react">React</option>
      <option value="vue">Vue</option>
    </seo-select>

    <!-- Programming method -->
    <div #selectContainer></div>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class ExampleComponent implements OnInit {
  @ViewChild('selectContainer', { static: true }) 
  selectContainer!: ElementRef;

  ngOnInit() {
    const select = document.createElement('seo-select-search');
    select.optionItems = [
      { value: 'angular', label: 'Angular' },
      { value: 'ionic', label: 'Ionic' },
      { value: 'ngrx', label: 'NgRx' }
    ];
    select.multiple = true;
    select.language = 'ko';

    this.selectContainer.nativeElement.appendChild(select);

    select.addEventListener('onSelect', (e: any) => {
      // New event system
      console.log('Programmatic - Selected:', { label: e.label, value: e.value });
      
      // Legacy fallback
      if (!e.label && e.detail) {
        console.log('Programmatic - Selected (legacy):', e.detail);
      }
    });
  }

  handleSelect(event: any) {
    // New event system: direct property access
    console.log('HTML - Selected:', { label: event.label, value: event.value });
    
    // Legacy fallback
    if (!event.label && event.detail) {
      console.log('HTML - Selected (legacy):', event.detail);
    }
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

### Event System Migration (v1.0.21+)

#### From Legacy Events to New Event System

```javascript
// Before: Legacy event handling
element.addEventListener('onSelect', (e) => {
  console.log(e.detail.label, e.detail.value);
});

// After: New event system (recommended)
element.addEventListener('onSelect', (e) => {
  // Direct property access (new way)
  console.log(e.label, e.value);
  
  // Fallback for compatibility
  if (!e.label && e.detail) {
    console.log(e.detail.label, e.detail.value);
  }
});

// Best: Type-safe event listeners (TypeScript)
import type { SeoSelectEventListener } from 'seo-select/event';

const handleSelect: SeoSelectEventListener<'onSelect'> = (event) => {
  console.log(event.label, event.value); // Type-safe
};

element.addSeoSelectEventListener('onSelect', handleSelect);
```

#### Event Property Changes

| Event | Legacy Access | New Access | Description |
|-------|---------------|------------|-------------|
| Selection | `e.detail.label` | `e.label` | Selected item label |
| Selection | `e.detail.value` | `e.value` | Selected item value |
| Reset (Multi) | `e.detail.values` | `e.values` | All reset values |
| Reset (Multi) | `e.detail.labels` | `e.labels` | All reset labels |

## Advanced Usage

### Type-Safe Event Handling (TypeScript)

```typescript
import { SeoSelect } from 'seo-select';
import type { 
  SeoSelectEventMap, 
  SeoSelectEventListener 
} from 'seo-select/event';

class FormHandler {
  private select: SeoSelect;

  constructor() {
    this.select = new SeoSelect();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Type-safe event listeners
    this.select.addSeoSelectEventListener('onSelect', this.handleSelect);
    this.select.addSeoSelectEventListener('onDeselect', this.handleDeselect);
    this.select.addSeoSelectEventListener('onReset', this.handleReset);
  }

  private handleSelect: SeoSelectEventListener<'onSelect'> = (event) => {
    // TypeScript knows event.label and event.value exist
    this.logActivity(`Selected: ${event.label} (${event.value})`);
    this.updateRecommendations(event.value);
  };

  private handleDeselect: SeoSelectEventListener<'onDeselect'> = (event) => {
    this.logActivity(`Removed: ${event.label} (${event.value})`);
  };

  private handleReset: SeoSelectEventListener<'onReset'> = (event) => {
    if (event.values) {
      this.logActivity(`Reset multiple: ${event.values.length} items`);
    } else {
      this.logActivity(`Reset to: ${event.label}`);
    }
  };

  private logActivity(message: string) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  private updateRecommendations(selectedValue: string) {
    // Implementation specific logic
  }
}
```

### Custom Event Helper Functions

```typescript
// Import event helpers for advanced usage
import { 
  triggerSelectEvent,
  triggerDeselectEvent,
  triggerResetEvent,
  triggerChangeEvent 
} from 'seo-select/event';

// Custom component that programmatically triggers events
class CustomSelectController {
  private element: SeoSelect;

  constructor(element: SeoSelect) {
    this.element = element;
  }

  // Programmatically trigger selection
  public selectItem(label: string, value: string) {
    this.element.value = value;
    triggerSelectEvent(this.element, label, value);
  }

  // Programmatically trigger reset
  public resetSelection() {
    const firstOption = this.element.options[0];
    if (firstOption) {
      this.element.value = firstOption.value;
      triggerResetEvent(this.element, {
        value: firstOption.value,
        label: firstOption.textContent || ''
      });
    }
  }

  // Batch operations with proper event sequences
  public batchSelect(items: Array<{label: string, value: string}>) {
    if (this.element.multiple) {
      const values = items.map(item => item.value);
      this.element.selectedValues = values;
      
      // Trigger individual select events for each item
      items.forEach(item => {
        triggerSelectEvent(this.element, item.label, item.value);
      });
      
      // Trigger final change event
      triggerChangeEvent(this.element);
    }
  }
}
```

### Performance Optimization

```typescript
import { SeoSelect, SeoSelectSearch } from 'seo-select';

// Optimize for large datasets
class OptimizedSelectSetup {
  public static setupLargeDataset(
    element: SeoSelectSearch,
    data: Array<{value: string, label: string}>
  ) {
    // Use batch update for better performance
    if (typeof element.batchUpdateOptions === 'function') {
      element.batchUpdateOptions(data);
    } else {
      // Fallback to regular method
      element.optionItems = data;
    }

    // Configure for optimal performance
    element.theme = 'float'; // Better visual performance
    
    // Enable caching for repeated operations
    if (typeof element.clearCaches === 'function') {
      // Clear caches on significant data changes
      element.clearCaches();
    }
  }

  public static getPerformanceMetrics(element: SeoSelect) {
    if (typeof element.getPerformanceMetrics === 'function') {
      return element.getPerformanceMetrics();
    }
    return null;
  }
}

// Usage example
const searchSelect = new SeoSelectSearch();
const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
  value: `item-${i}`,
  label: `Item ${i} - Large Dataset`
}));

OptimizedSelectSetup.setupLargeDataset(searchSelect, largeDataset);

// Monitor performance
const metrics = OptimizedSelectSetup.getPerformanceMetrics(searchSelect);
console.log('Performance metrics:', metrics);
```

### Internationalization and Localization

```typescript
import { SeoSelect } from 'seo-select';
import type { SupportedLanguage, LocalizedTexts } from 'seo-select';

class I18nSelectManager {
  private selects: SeoSelect[] = [];

  public addSelect(select: SeoSelect) {
    this.selects.push(select);
  }

  public changeLanguage(language: SupportedLanguage) {
    this.selects.forEach(select => {
      select.setLanguage(language);
    });
  }

  public setCustomTexts(customTexts: Partial<LocalizedTexts>) {
    this.selects.forEach(select => {
      select.setTexts(customTexts);
    });
  }

  // Get supported languages
  public getSupportedLanguages(): SupportedLanguage[] {
    return SeoSelect.getSupportedLanguages();
  }

  // Get default texts for a language
  public getDefaultTexts() {
    return SeoSelect.getDefaultTexts();
  }
}

// Usage
const i18nManager = new I18nSelectManager();

// Add multiple selects to manage
document.querySelectorAll('seo-select').forEach(select => {
  i18nManager.addSelect(select as SeoSelect);
});

// Change all selects to Korean
i18nManager.changeLanguage('ko');

// Apply custom texts to all selects
i18nManager.setCustomTexts({
  placeholder: '옵션을 선택하세요',
  required: '이 필드는 필수입니다',
  noDataText: '데이터가 없습니다'
});
```

## Troubleshooting

### Common Issues and Solutions

#### Event Listeners Not Working

```typescript
// Problem: Events not firing
element.addEventListener('onSelect', handler); // ❌ May not work

// Solution 1: Use new event system
element.addSeoSelectEventListener('onSelect', handler); // ✅ Recommended

// Solution 2: Check for element readiness
document.addEventListener('DOMContentLoaded', () => {
  const element = document.querySelector('seo-select');
  if (element) {
    element.addEventListener('onSelect', handler); // ✅ Works
  }
});

// Solution 3: Use event delegation
document.addEventListener('onSelect', (e) => {
  if (e.target.tagName === 'SEO-SELECT') {
    handler(e); // ✅ Works for dynamic elements
  }
});
```

#### TypeScript Type Errors

```typescript
// Problem: TypeScript doesn't recognize seo-select elements
// Solution: Add type declarations

// In your types.d.ts or global.d.ts
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'seo-select': any;
      'seo-select-search': any;
    }
  }
}

// Or use proper imports
import type { SeoSelect, SeoSelectSearch } from 'seo-select';

declare global {
  interface HTMLElementTagNameMap {
    'seo-select': SeoSelect;
    'seo-select-search': SeoSelectSearch;
  }
}
```

#### Performance Issues with Large Datasets

```typescript
// Problem: Slow rendering with many options
// Solution: Use search component and optimize

import { SeoSelectSearch } from 'seo-select/components/seo-select-search';

// ✅ Good for large datasets
const select = new SeoSelectSearch();
select.optionItems = largeDataArray; // 1000+ items

// ✅ Use batch operations
if (typeof select.batchUpdateOptions === 'function') {
  select.batchUpdateOptions(newLargeDataArray);
}

// ✅ Clear caches when needed
if (typeof select.clearCaches === 'function') {
  select.clearCaches();
}
```

#### CSS Styling Not Applied

```css
/* Problem: Styles not taking effect */
/* Solution: Use correct CSS variable names */

seo-select {
  /* ❌ Wrong variable name */
  --select-color: red;
  
  /* ✅ Correct variable name */
  --select-text-color: red;
  
  /* ✅ Check the documentation for exact variable names */
  --select-border-color: #007bff;
  --select-focus-color: #0056b3;
}
```

#### Search Not Working with Multilingual Content

```javascript
// Problem: Search doesn't find multilingual options
// Solution: Ensure proper text encoding and component setup

// ✅ Use seo-select-search for multilingual content
import 'seo-select/components/seo-select-search';

// ✅ Set appropriate language
const select = document.querySelector('seo-select-search');
select.language = 'ko'; // For Korean initial consonant search

// ✅ Test search functionality
if (typeof select.testMultilingualSearch === 'function') {
  const result = select.testMultilingualSearch('ㅎㄱ', '한국어');
  console.log('Search works:', result); // Should be true
}
```

#### Form Integration Issues

```javascript
// Problem: Form doesn't recognize select value
// Solution: Ensure proper form association and naming

// ✅ Set name attribute for form integration
<seo-select name="country" required>
  <option value="us">United States</option>
</seo-select>

// ✅ Check form data
const form = document.querySelector('#myForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  
  // Should include seo-select values
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
});

// ✅ Programmatic validation
const select = document.querySelector('seo-select[name="country"]');
if (select.required && !select.value) {
  console.log('Required field is empty');
}
```

#### Dynamic Content and Memory Leaks

```javascript
// Problem: Memory leaks when dynamically adding/removing selects
// Solution: Proper cleanup and event management

class DynamicSelectManager {
  private selects = new Map<string, SeoSelect>();
  private eventListeners = new Map<string, Array<() => void>>();

  addSelect(id: string, select: SeoSelect) {
    // Store reference
    this.selects.set(id, select);
    
    // Add event listeners
    const listeners: Array<() => void> = [];
    
    const handleSelect = (e: any) => {
      console.log(`${id} selected:`, e.label || e.detail?.label);
    };
    
    const handleChange = (e: any) => {
      console.log(`${id} changed:`, e.target.value);
    };

    select.addEventListener('onSelect', handleSelect);
    select.addEventListener('onChange', handleChange);
    
    // Store cleanup functions
    listeners.push(
      () => select.removeEventListener('onSelect', handleSelect),
      () => select.removeEventListener('onChange', handleChange)
    );
    
    this.eventListeners.set(id, listeners);
  }

  removeSelect(id: string) {
    // Clean up event listeners
    const listeners = this.eventListeners.get(id);
    if (listeners) {
      listeners.forEach(cleanup => cleanup());
      this.eventListeners.delete(id);
    }

    // Clean up select
    const select = this.selects.get(id);
    if (select) {
      // Clear caches if available
      if (typeof select.clearCaches === 'function') {
        select.clearCaches();
      }
      
      // Remove from DOM if still connected
      if (select.isConnected) {
        select.remove();
      }
      
      this.selects.delete(id);
    }
  }

  cleanup() {
    // Clean up all selects
    for (const id of this.selects.keys()) {
      this.removeSelect(id);
    }
  }
}

// Usage
const manager = new DynamicSelectManager();

// Add select
const select = new SeoSelect();
manager.addSelect('user-country', select);

// Remove when done
manager.removeSelect('user-country');

// Clean up all on page unload
window.addEventListener('beforeunload', () => {
  manager.cleanup();
});
```

## Best Practices

### 1. Event Handling Best Practices

```typescript
// ✅ Use type-safe event listeners when possible
select.addSeoSelectEventListener('onSelect', (event) => {
  // Direct property access
  processSelection(event.label, event.value);
});

// ✅ Provide fallback for legacy compatibility
element.addEventListener('onSelect', (e) => {
  const label = e.label || e.detail?.label || 'Unknown';
  const value = e.value || e.detail?.value || '';
  processSelection(label, value);
});

// ✅ Clean up event listeners
const controller = new AbortController();
element.addEventListener('onSelect', handler, {
  signal: controller.signal
});

// Later...
controller.abort(); // Automatically removes all listeners
```

### 2. Performance Best Practices

```typescript
// ✅ Use search component for large datasets
const select = new SeoSelectSearch();

// ✅ Batch update options instead of individual assignments
select.batchUpdateOptions(largeOptionArray);

// ✅ Use virtual scrolling (automatic with large datasets)
// ✅ Clear caches when data changes significantly
select.clearCaches();

// ✅ Monitor performance in development
const metrics = select.getPerformanceMetrics();
console.log('Component performance:', metrics);
```

### 3. Accessibility Best Practices

```html
<!-- ✅ Always provide meaningful labels -->
<label for="country-select">Choose your country</label>
<seo-select id="country-select" name="country" required>
  <option value="">Select a country</option>
  <option value="us">United States</option>
</seo-select>

<!-- ✅ Use semantic HTML structure -->
<fieldset>
  <legend>Contact Preferences</legend>
  <seo-select multiple name="contact-methods">
    <option value="email">Email</option>
    <option value="phone">Phone</option>
    <option value="sms">SMS</option>
  </seo-select>
</fieldset>

<!-- ✅ Provide helpful descriptions -->
<seo-select name="timezone" aria-describedby="timezone-help">
  <option value="utc">UTC</option>
  <option value="est">EST</option>
</seo-select>
<div id="timezone-help">
  Select your local timezone for accurate scheduling
</div>
```

### 4. Internationalization Best Practices

```typescript
// ✅ Set up i18n early in application lifecycle
const i18nManager = new I18nSelectManager();

// ✅ Use consistent language codes
const supportedLanguages = ['en', 'ko', 'ja', 'zh'] as const;

// ✅ Provide fallback texts
const customTexts = {
  en: { placeholder: 'Select an option...', required: 'This field is required' },
  ko: { placeholder: '옵션을 선택하세요...', required: '이 필드는 필수입니다' },
  ja: { placeholder: 'オプションを選択...', required: 'この項目は必須です' },
  zh: { placeholder: '选择选项...', required: '此字段为必填项' }
};

// ✅ Handle language changes gracefully
function changeLanguage(newLanguage: string) {
  i18nManager.changeLanguage(newLanguage);
  i18nManager.setCustomTexts(customTexts[newLanguage] || customTexts.en);
}
```

### 5. Form Integration Best Practices

```typescript
// ✅ Use proper form validation
class FormValidator {
  private static validateSelect(select: SeoSelect): boolean {
    if (select.required) {
      const value = select.multiple ? select.selectedValues : [select.value];
      return value.length > 0 && value.every(v => v && v.trim());
    }
    return true;
  }

  public static validateForm(form: HTMLFormElement): boolean {
    const selects = form.querySelectorAll('seo-select, seo-select-search');
    
    return Array.from(selects).every(select => {
      const isValid = this.validateSelect(select as SeoSelect);
      
      if (!isValid) {
        // Focus invalid field
        select.focus();
        
        // Show validation message
        const label = select.getAttribute('aria-label') || 
                     select.getAttribute('name') || 
                     'Field';
        alert(`${label} is required`);
      }
      
      return isValid;
    });
  }
}

// ✅ Handle form submission properly
document.querySelector('#myForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const form = e.target as HTMLFormElement;
  
  if (FormValidator.validateForm(form)) {
    const formData = new FormData(form);
    submitForm(formData);
  }
});
```

## Repository

- **GitHub**: [https://github.com/seadonggyun4/seo-select](https://github.com/seadonggyun4/seo-select)
- **NPM**: [https://www.npmjs.com/package/seo-select](https://www.npmjs.com/package/seo-select)
- **Demo**: [https://seo-select.netlify.app/](https://seo-select.netlify.app/)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/seadonggyun4/seo-select.git
cd seo-select

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run type checking
npm run type-check
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

### 1.0.21
- **🆕 Enhanced Event System**: Introduced type-safe event classes with direct property access
- **🔧 Event Helper Functions**: Added `triggerSelectEvent`, `triggerDeselectEvent`, etc.
- **📦 Modular Event Export**: Events now available as separate module (`seo-select/event`)
- **🔄 Backward Compatibility**: Existing `detail`-based events still work
- **⚡ Performance Improvements**: Better event handling and memory management
- **🛠️ Developer Experience**: Type-safe event listeners with TypeScript support
- **📚 Documentation**: Comprehensive README update with examples and best practices

### 1.0.20 and Earlier
- Initial release with basic select functionality
- Search component with multilingual support
- Multiple themes (basic, float) and dark mode support
- Internationalization support (EN, KO, JA, ZH)
- Virtual scrolling for performance optimization
- Full accessibility support with keyboard navigation
- TypeScript definitions and comprehensive type safety
- Various bug fixes and performance improvements:
  - Fixed tag styling and optimized rendering
  - Improved seo-select-search reset logic
  - Enhanced responsive width handling
  - Added advanced keyboard navigation (tab + shift)
  - Removed static assets from distribution
  - Fixed various styling inconsistencies

## Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/seadonggyun4/seo-select/issues)
3. Create a new issue with detailed reproduction steps
4. Join our community discussions

## Acknowledgments

- Built with [Lit](https://lit.dev/) for modern web component architecture
- Inspired by modern select components and accessibility standards
- Thanks to all contributors and users providing feedback

---

**Made with ❤️ by [seadonggyun4](https://github.com/seadonggyun4)**