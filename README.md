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
- ⚡ **Modern Event System**: Standard addEventListener with type-safe helpers

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

// Import event types (TypeScript)
import type { 
  SeoSelectEvent, 
  SeoDeselectEvent,
  SeoResetEvent 
} from 'seo-select/event';
```

## Components Overview

### `seo-select` - Basic Select Component

Standard dropdown functionality with virtual scrolling, multiple selection, themes, and form integration.

### `seo-select-search` - Search-Enhanced Select Component

Extended component with real-time multilingual search including Korean initial consonant search (ㅎㄱㅇ → 한국어), Japanese romaji search (nihongo → 日本語), and Chinese pinyin search (beijing → 北京).

## Use Cases & When to Use Each Component

### Use `seo-select` when:
- Small to medium option lists (< 50 items)
- Form controls with known options
- Settings and configuration panels

### Use `seo-select-search` when:
- Large option lists (50+ items)
- Multilingual content
- User-friendly data entry with search
- Dynamic data loading

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

## Event System

### 🆕 Standard addEventListener (Recommended)

```typescript
// Standard way - works in all frameworks
searchSelect.addEventListener('onSelect', (event) => {
  console.log('Selected:', event.label, event.value);
});

searchSelect.addEventListener('onDeselect', (event) => {
  console.log('Deselected:', event.label, event.value);
});

searchSelect.addEventListener('onReset', (event) => {
  if (event.values && event.labels) {
    console.log('Reset multiple:', event.values, event.labels);
  } else {
    console.log('Reset single:', event.value, event.label);
  }
});

searchSelect.addEventListener('onChange', (event) => {
  console.log('Value changed');
});

searchSelect.addEventListener('onOpen', (event) => {
  console.log('Dropdown opened');
});
```

### Type-Safe Helper Methods (Built-in)

```typescript
// These methods are always available for better DX
searchSelect.onSelect((event) => {
  console.log('Selected:', event.label, event.value);
});

searchSelect.onDeselect((event) => {
  console.log('Deselected:', event.label, event.value);
});

searchSelect.onReset((event) => {
  console.log('Reset event:', event);
});

searchSelect.onChange((event) => {
  console.log('Value changed');
});

searchSelect.onOpen((event) => {
  console.log('Dropdown opened');
});

// Search-specific events (seo-select-search only)
searchSelect.onSearchChange((searchText) => {
  console.log('Search text:', searchText);
});

searchSelect.onSearchFilter((filteredOptions) => {
  console.log('Filtered results:', filteredOptions.length);
});
```

### JavaScript/TypeScript Usage

```typescript
import 'seo-select/components/seo-select-search';

// Create programmatically
const select = document.createElement('seo-select-search');
select.optionItems = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' }
];
select.multiple = true;
select.theme = 'float';
select.language = 'ko';

document.body.appendChild(select);

// Event handling
select.addEventListener('onSelect', (event) => {
  console.log('Selected:', event.label, event.value);
});

// Or use helper methods
select.onSelect((event) => {
  console.log('Selected:', event.label, event.value);
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

### SeoSelectSearch Additional Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `searchTexts` | `Partial<SearchLocalizedTexts>` | `{}` | Custom search-related texts |

## Events Reference

| Event Name | Properties | Description |
|------------|------------|-------------|
| `onSelect` | `{ label, value }` | User selects an option |
| `onDeselect` | `{ label, value }` | User removes selected option (multiple mode) |
| `onChange` | - | Form value changes |
| `onReset` | `{ value, label }` or `{ values, labels }` | Component resets to default |
| `onOpen` | - | Dropdown opens |

## Methods

### SeoSelect & SeoSelectSearch

```typescript
// Value management
select.value = 'option1';
select.selectedValues = ['opt1', 'opt2']; // Multiple mode

// Language and customization
select.setLanguage('ko');
select.setTexts({ placeholder: 'Custom...' });
select.setSearchTexts({ searchPlaceholder: 'Search...' }); // Search only

// Options management
select.optionItems = newOptions;
select.batchUpdateOptions(largeArray);
select.addOption({ value: 'new', label: 'New Option' });
select.removeOption('value-to-remove');
select.clearOptions();

// Event management (always available)
select.onSelect(handler);
select.onDeselect(handler);
select.onReset(handler);
select.onChange(handler);
select.onOpen(handler);

// Search-specific (seo-select-search only)
select.onSearchChange(handler);
select.onSearchFilter(handler);
select.setSearchText('search term');
select.clearSearchText();

// Utility
select.resetToDefaultValue();
select.clearCaches();
```

## Styling and Customization

### Quick Styling Example

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

## Framework Integration Examples

### React Integration

```jsx
import { useEffect, useRef } from 'react';
import 'seo-select/components/seo-select-search';

function MyComponent() {
  const selectRef = useRef(null);

  useEffect(() => {
    const select = selectRef.current;
    if (!select) return;

    // Standard addEventListener
    select.addEventListener('onSelect', (event) => {
      console.log('Selected:', event.label, event.value);
    });

    // Or use helper methods
    select.onSelect((event) => {
      console.log('Selected:', event.label, event.value);
    });

    return () => {
      // Cleanup is automatic with modern event handling
    };
  }, []);

  return (
    <div>
      <seo-select-search ref={selectRef} name="framework">
        <option value="react">React</option>
        <option value="vue">Vue</option>
        <option value="angular">Angular</option>
      </seo-select-search>
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
  <seo-select-search 
    ref="selectRef"
    name="framework"
    @onSelect="handleSelect"
  >
    <option value="vue">Vue</option>
    <option value="react">React</option>
    <option value="angular">Angular</option>
  </seo-select-search>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import 'seo-select/components/seo-select-search';

const selectRef = ref(null);

onMounted(() => {
  const select = selectRef.value;
  
  // Use helper methods
  select.onSelect((event) => {
    console.log('Programmatic:', event.label, event.value);
  });
});

const handleSelect = (event) => {
  console.log('Template:', event.label, event.value);
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
    <seo-select-search 
      name="framework" 
      (onSelect)="handleSelect($event)"
      #selectElement>
      <option value="angular">Angular</option>
      <option value="react">React</option>
      <option value="vue">Vue</option>
    </seo-select-search>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class ExampleComponent implements OnInit {
  @ViewChild('selectElement', { static: true }) 
  selectElement!: ElementRef;

  ngOnInit() {
    const select = this.selectElement.nativeElement;
    
    // Use helper methods
    select.onSelect((event: any) => {
      console.log('Programmatic:', event.label, event.value);
    });
  }

  handleSelect(event: any) {
    console.log('Template:', event.label, event.value);
  }
}
```

## Migration Guide

### From Standard HTML Select

```html
<!-- Before: Standard HTML select -->
<select name="country">
  <option value="us">United States</option>
</select>

<!-- After: seo-select -->
<script type="module">
  import 'seo-select';
</script>
<seo-select name="country">
  <option value="us">United States</option>
</seo-select>
```

### Adding Search Functionality

```html
<!-- Change import and tag name -->
<script type="module">
  import 'seo-select/components/seo-select-search';
</script>

<seo-select-search name="country">
  <option value="us">United States</option>
</seo-select-search>
```

## Best Practices

### Event Handling
```typescript
// ✅ Use standard addEventListener (works everywhere)
select.addEventListener('onSelect', handler);

// ✅ Or use built-in helper methods for better DX
select.onSelect(handler);

// ✅ Clean up is automatic with modern browsers
```

### Performance
```typescript
// ✅ Use search component for large datasets
const select = new SeoSelectSearch();

// ✅ Batch update options
select.batchUpdateOptions(largeArray);

// ✅ Clear caches when needed
select.clearCaches();
```

### Accessibility
```html
<!-- ✅ Always provide labels -->
<label for="country-select">Choose your country</label>
<seo-select id="country-select" name="country" required>
  <option value="">Select a country</option>
</seo-select>
```

## Troubleshooting

### Common Issues

**Events not working**: Use `select.onSelect(handler)` or ensure DOM is ready when using `addEventListener`.

**TypeScript errors**: Add type declarations for custom elements.

**Performance issues**: Use `seo-select-search` for large datasets and `batchUpdateOptions()`.

**Styling not applied**: Check CSS variable names in documentation.

## Repository

- **GitHub**: [https://github.com/seadonggyun4/seo-select](https://github.com/seadonggyun4/seo-select)
- **NPM**: [https://www.npmjs.com/package/seo-select](https://www.npmjs.com/package/seo-select)
- **Demo**: [https://seo-select.netlify.app/](https://seo-select.netlify.app/)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

### 1.0.24 (Latest)
- **🆕 Enhanced Event System**: Standard `addEventListener` with built-in type-safe helpers
- **🔧 Helper Methods**: `onSelect()`, `onDeselect()`, `onReset()`, `onChange()`, `onOpen()` always available
- **📦 Improved DX**: Better TypeScript support and developer experience
- **⚡ Performance**: Optimized event handling and memory management
- **🔄 Backward Compatibility**: All existing code continues to work

### Previous Versions
- Virtual scrolling, multilingual search, themes, internationalization
- Accessibility improvements, form integration, TypeScript support
- Various performance optimizations and bug fixes

---

**Made with ❤️ by [seadonggyun4](https://github.com/seadonggyun4)**