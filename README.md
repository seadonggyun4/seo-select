# seo-select

A highly customizable and accessible select component with search functionality built with Lit. Supports virtual scrolling, multiple selection, internationalization, and modern theming.

## Features

- 🎨 **Multiple Themes**: Float, minimal, rounded themes with dark mode support
- 🌍 **Internationalization**: Built-in support for multiple languages (EN, KO, JA, ZH)
- 🔍 **Search Functionality**: Advanced multilingual search with fuzzy matching
- ♿ **Accessibility**: Full keyboard navigation and screen reader support
- 🚀 **Virtual Scrolling**: High performance with large datasets
- 📱 **Responsive**: Auto-width calculation and mobile-friendly
- 🎯 **Multiple Selection**: Tag-based multi-select with individual remove buttons
- 💡 **TypeScript**: Full TypeScript support with comprehensive type definitions

## Installation

```bash
npm install seo-select
```

## Basic Usage

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
  theme="rounded"
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
select.addEventListener('seo-select:select', (e) => {
  console.log('Selected:', e.detail);
});

select.addEventListener('seo-select:change', (e) => {
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
| `theme` | `'float' \| 'minimal' \| 'rounded'` | `'float'` | Visual theme |
| `dark` | `boolean` | `false` | Enable dark mode |
| `language` | `'en' \| 'ko' \| 'ja' \| 'zh'` | `'en'` | Interface language |
| `showReset` | `boolean` | `false` | Show reset button |
| `width` | `string` | `null` | Custom width (auto-calculated if not set) |
| `height` | `string` | `'40px'` | Component height |

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
| `seo-select:select` | `{ value, label }` | Item selected |
| `seo-select:deselect` | `{ value, label }` | Item deselected (multiple mode) |
| `seo-select:change` | - | Value changed |
| `seo-select:reset` | `{ value, label }` or `{ values, labels }` | Reset to default |

## Styling

The component comes with built-in themes, but you can customize the appearance:

```css
seo-select {
  --select-border-color: #ccc;
  --select-focus-color: #007bff;
  --select-background: white;
  --select-text-color: #333;
}

/* Dark mode */
seo-select.dark {
  --select-background: #1a1a1a;
  --select-text-color: #fff;
  --select-border-color: #444;
}
```

## Examples

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
    selectElement?.addEventListener('seo-select:select', handleSelect);

    return () => {
      selectElement?.removeEventListener('seo-select:select', handleSelect);
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
    @seo-select:select="handleSelect"
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
// component.ts
import { Component, OnInit } from '@angular/core';
import 'seo-select';

@Component({
  selector: 'app-example',
  template: `
    <seo-select name="example" (seo-select:select)="handleSelect($event)">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </seo-select>
  `
})
export class ExampleComponent {
  handleSelect(event: CustomEvent) {
    console.log('Selected:', event.detail);
  }
}
```

## CDN Usage

For quick prototyping, you can use the CDN version:

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://unpkg.com/seo-select@latest/dist/index.js"></script>
</head>
<body>
  <seo-select name="example">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
  </seo-select>
</body>
</html>
```

## Browser Support

- Chrome/Edge 79+
- Firefox 72+
- Safari 13.1+
- Modern browsers with ES2020 support

## Repository

- **GitHub**: [https://github.com/seadonggyun4/seo-select](https://github.com/seadonggyun4/seo-select)
- **NPM**: [https://www.npmjs.com/package/seo-select](https://www.npmjs.com/package/seo-select)
- **Demo**: [https://seoui.netlify.app](https://seoui.netlify.app)

## License

MIT License

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## Changelog

### 1.0.0
- Initial release
- Basic select functionality
- Search component with multilingual support
- Multiple themes (float, minimal, rounded)
- Dark mode support
- Internationalization (EN, KO, JA, ZH)
- Virtual scrolling for performance
- Full accessibility support
- TypeScript definitions