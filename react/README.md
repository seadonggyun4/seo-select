# seo-select-react

![npm](https://img.shields.io/npm/dt/seo-select-react?style=flat&label=NPM%20Downloads)
![GitHub Repo stars](https://img.shields.io/github/stars/seadonggyun4/seo-select?style=flat&label=GitHub%20Stars)

<img width="300" height="300" alt="logo" src="https://github.com/user-attachments/assets/e567ea31-d046-45b3-80d1-9a1e32c7e002" />

**React wrapper components for seo-select** - A customizable and accessible select component with search functionality, virtual scrolling, and multilingual support.

> Built on top of the powerful [seo-select](https://www.npmjs.com/package/seo-select) Web Component library, providing React developers with a familiar component API while maintaining all the advanced features and performance optimizations.

- **[GitHub](https://github.com/seadonggyun4/seo-select)**
- **[NPM: seo-select](https://www.npmjs.com/package/seo-select)**
- **[NPM: seo-select-react](https://www.npmjs.com/package/seo-select-react)**
- **[DemoSite](https://seo-select.netlify.app/)**

## Features

- ⚛️ **Native React Integration**: Familiar React component API with props, refs, and event handlers
- 🎨 **Multiple Themes**: Basic and float themes with dark mode support
- 🌍 **Internationalization**: Built-in support for multiple languages (EN, KO, JA, ZH)
- 🔍 **Advanced Search**: Multilingual search with Korean consonant (ㅎㄱㅇ → 한국어), Japanese romaji (nihongo → 日本語), and Chinese pinyin (beijing → 北京) support
- ♿ **Accessibility**: Full keyboard navigation and screen reader support
- 🚀 **Virtual Scrolling**: High performance with large datasets (1000+ options)
- 📏 **Auto Width**: Automatic width calculation based on content
- 🎯 **Multiple Selection**: Tag-based multi-select with individual remove buttons
- 💡 **Lightweight**: Small bundle size with tree-shaking support
- 🔒 **Type Safe**: Full TypeScript support with comprehensive type definitions
- ⚡ **Modern Event System**: Standard React event handlers with custom event support

## Installation

```bash
npm install seo-select-react
```

## Quick Start

### Basic Select Component

```tsx
import React, { useState } from 'react';
import { SeoSelect } from 'seo-select-react';
import 'seo-select/styles'; // Import CSS styles

const App: React.FC = () => {
  const [value, setValue] = useState<string>('');
  
  const options = [
    { value: 'us', label: 'United States' },
    { value: 'kr', label: 'South Korea' },
    { value: 'jp', label: 'Japan' },
  ];

  return (
    <SeoSelect
      name="country"
      theme="float"
      optionItems={options}
      value={value}
      onSelect={(event) => setValue(event.value)}
      showReset
    />
  );
};
```

### Search-Enhanced Select Component

```tsx
import React, { useState } from 'react';
import { SeoSelectSearch } from 'seo-select-react';
import 'seo-select/styles';

const SearchExample: React.FC = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  
  const options = [
    { value: 'js', label: 'JavaScript' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
  ];

  const handleSelect = (event: { label: string; value: string }) => {
    setSelectedValues(prev => [...prev, event.value]);
  };

  const handleDeselect = (event: { label: string; value: string }) => {
    setSelectedValues(prev => prev.filter(v => v !== event.value));
  };

  return (
    <SeoSelectSearch
      name="skills"
      theme="float"
      multiple
      optionItems={options}
      value={selectedValues}
      onSelect={handleSelect}
      onDeselect={handleDeselect}
      onSearchChange={(searchText) => console.log('Search:', searchText)}
      language="en"
      showReset
    />
  );
};
```

## Component Props

### SeoSelect Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Form field name |
| `required` | `boolean` | `false` | Whether the field is required |
| `multiple` | `boolean` | `false` | Enable multiple selection |
| `theme` | `'basic' \| 'float'` | `'float'` | Visual theme |
| `dark` | `boolean` | `false` | Enable dark mode |
| `language` | `'en' \| 'ko' \| 'ja' \| 'zh'` | `'en'` | Interface language |
| `showReset` | `boolean` | `true` | Show reset button |
| `width` | `string` | `null` | Custom width (auto-calculated if not set) |
| `optionItems` | `VirtualSelectOption[]` | `[]` | Array of options |
| `value` | `string \| string[]` | - | Current selected value(s) |
| `children` | `React.ReactNode` | - | HTML option elements |
| `className` | `string` | - | Additional CSS class |
| `style` | `React.CSSProperties` | - | Inline styles |

### SeoSelectSearch Additional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchTexts` | `Partial<SearchLocalizedTexts>` | `{}` | Custom search-related texts |
| `onSearchChange` | `(searchText: string) => void` | - | Search text change handler |
| `onSearchFilter` | `(filteredOptions: VirtualSelectOption[]) => void` | - | Search filter event handler |

## Event Handlers

### Common Events

```tsx
<SeoSelect
  onSelect={(event) => {
    // { label: string, value: string }
    console.log('Selected:', event.label, event.value);
  }}
  onDeselect={(event) => {
    // { label: string, value: string } - Multiple mode only
    console.log('Deselected:', event.label, event.value);
  }}
  onReset={(event) => {
    // Single: { value: string, label: string }
    // Multiple: { values: string[], labels: string[] }
    console.log('Reset:', event);
  }}
  onChange={() => {
    console.log('Form value changed');
  }}
  onOpen={() => {
    console.log('Dropdown opened');
  }}
/>
```

### Search Events (SeoSelectSearch only)

```tsx
<SeoSelectSearch
  onSearchChange={(searchText) => {
    console.log('User typed:', searchText);
    // Trigger API calls, analytics, etc.
  }}
  onSearchFilter={(filteredOptions) => {
    console.log(`Found ${filteredOptions.length} results`);
    // Update UI indicators, show result counts, etc.
  }}
/>
```

## Using Refs for Advanced Control

```tsx
import React, { useRef } from 'react';
import { SeoSelect, SeoSelectSearch, type SeoSelectRef, type SeoSelectSearchRef } from 'seo-select-react';

const RefExample: React.FC = () => {
  const selectRef = useRef<SeoSelectRef>(null);
  const searchSelectRef = useRef<SeoSelectSearchRef>(null);

  const addDynamicOption = () => {
    const newOption = { 
      value: `option-${Date.now()}`, 
      label: `Dynamic Option ${Date.now()}` 
    };
    selectRef.current?.addOption(newOption);
  };

  const loadAsyncOptions = async () => {
    if (searchSelectRef.current) {
      await searchSelectRef.current.loadOptionsForSearch('search', async (searchText) => {
        // Simulate API call
        const response = await fetch(`/api/search?q=${searchText}`);
        return await response.json();
      });
    }
  };

  const resetSelection = () => {
    selectRef.current?.resetToDefaultValue();
  };

  const getCurrentValue = () => {
    const value = selectRef.current?.getValue();
    console.log('Current value:', value);
  };

  return (
    <div>
      <SeoSelect ref={selectRef} name="basic" />
      <SeoSelectSearch ref={searchSelectRef} name="search" />
      
      <div>
        <button onClick={addDynamicOption}>Add Option</button>
        <button onClick={loadAsyncOptions}>Load Async Options</button>
        <button onClick={resetSelection}>Reset</button>
        <button onClick={getCurrentValue}>Get Value</button>
      </div>
    </div>
  );
};
```

## Advanced Usage

### Dynamic Option Management

```tsx
import React, { useState, useRef } from 'react';
import { SeoSelectSearch, type SeoSelectSearchRef } from 'seo-select-react';

const DynamicExample: React.FC = () => {
  const selectRef = useRef<SeoSelectSearchRef>(null);
  const [options, setOptions] = useState([
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]);

  // Add multiple options
  const addOptions = () => {
    const newOptions = [
      { value: 'new1', label: 'New Option 1' },
      { value: 'new2', label: 'New Option 2' },
    ];
    selectRef.current?.addOptions(newOptions, true); // preserveSelection = true
  };

  // Add single option
  const addSingleOption = () => {
    selectRef.current?.addOption({ value: 'single', label: 'Single Option' });
  };

  // Remove specific option
  const removeOption = () => {
    selectRef.current?.clearOption('option1');
  };

  // Batch operations for performance
  const batchUpdate = () => {
    selectRef.current?.batchUpdateOptions([
      { action: 'add', option: { value: 'batch1', label: 'Batch 1' } },
      { action: 'remove', value: 'option2' },
      { action: 'update', value: 'option1', option: { value: 'option1', label: 'Updated Option 1' } },
    ]);
  };

  return (
    <div>
      <SeoSelectSearch
        ref={selectRef}
        name="dynamic"
        optionItems={options}
        multiple
      />
      
      <div>
        <button onClick={addOptions}>Add Multiple Options</button>
        <button onClick={addSingleOption}>Add Single Option</button>
        <button onClick={removeOption}>Remove Option 1</button>
        <button onClick={batchUpdate}>Batch Update</button>
      </div>
    </div>
  );
};
```

### Controlled vs Uncontrolled Components

```tsx
// Controlled Component (Recommended)
const ControlledExample: React.FC = () => {
  const [value, setValue] = useState<string>('');
  
  return (
    <SeoSelect
      value={value}
      onSelect={(event) => setValue(event.value)}
      optionItems={options}
    />
  );
};

// Uncontrolled Component with Ref
const UncontrolledExample: React.FC = () => {
  const selectRef = useRef<SeoSelectRef>(null);
  
  const handleSubmit = () => {
    const value = selectRef.current?.getValue();
    console.log('Form value:', value);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <SeoSelect ref={selectRef} name="uncontrolled" optionItems={options} />
      <button type="submit">Submit</button>
    </form>
  );
};
```

### Using HTML Option Elements

```tsx
const HTMLOptionsExample: React.FC = () => {
  return (
    <SeoSelect name="html-options" theme="float">
      <option value="html1">HTML Option 1</option>
      <option value="html2">HTML Option 2</option>
      <option value="html3" selected>HTML Option 3</option>
    </SeoSelect>
  );
};
```

## Styling and Theming

### CSS Variables

```css
/* Custom theme */
.custom-select {
  --select-border-color: #007bff;
  --select-focus-color: #0056b3;
  --select-background: white;
  --select-text-color: #333;
  --select-font-size: 14px;
}

/* Dark mode customization */
.dark-select {
  --select-background: #374151;
  --select-text-color: #f3f4f6;
  --select-border-color: #6b7280;
  --dropdown-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}
```

### Using Custom Classes

```tsx
<SeoSelect
  className="custom-select"
  style={{ margin: '10px 0' }}
  theme="float"
  dark={isDarkMode}
/>
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import type { 
  SeoSelectProps, 
  SeoSelectRef,
  SeoSelectSearchProps,
  SeoSelectSearchRef,
  VirtualSelectOption,
  SupportedLanguage,
  SelectTheme 
} from 'seo-select-react';

// Type-safe option creation
const options: VirtualSelectOption[] = [
  { value: 'ts', label: 'TypeScript' },
  { value: 'js', label: 'JavaScript' }
];

// Type-safe component props
const props: SeoSelectProps = {
  name: 'language',
  theme: 'float',
  language: 'en',
  optionItems: options,
};
```

## Performance Optimization

### Large Datasets

```tsx
// Virtual scrolling automatically handles large datasets
const largeOptions = Array.from({ length: 10000 }, (_, i) => ({
  value: `option-${i}`,
  label: `Option ${i + 1}`
}));

<SeoSelectSearch
  optionItems={largeOptions}
  multiple
  // Virtual scrolling ensures smooth performance
/>
```

### Batch Operations

```tsx
// Use batch operations for multiple updates
const batchUpdates = [
  { action: 'add', option: { value: '1', label: 'One' } },
  { action: 'add', option: { value: '2', label: 'Two' } },
  { action: 'remove', value: 'old-option' }
];

selectRef.current?.batchUpdateOptions(batchUpdates);
```

## Accessibility

The component provides full accessibility support:

- **Keyboard Navigation**: Arrow keys, Enter, Escape, Tab support
- **Screen Reader Support**: Proper ARIA labels and announcements
- **Focus Management**: Logical focus flow and visual indicators
- **High Contrast**: Compatible with high contrast mode
- **Semantic HTML**: Proper form integration and validation

## Migration from seo-select Web Component

```tsx
// Before (Web Component)
<seo-select name="country" theme="float" show-reset>
  <option value="us">United States</option>
</seo-select>

// After (React Component)
<SeoSelect
  name="country"
  theme="float"
  showReset
  optionItems={[{ value: 'us', label: 'United States' }]}
/>
```

## Contributing

We welcome contributions! Please see the [main repository](https://github.com/seadonggyun4/seo-select) for contribution guidelines.

## License

MIT License - see [LICENSE](https://github.com/seadonggyun4/seo-select/blob/main/LICENSE) file for details.

## Changelog

### Version 1.0.0
- **Initial React Support**: Native React wrapper components
- **Full TypeScript Support**: Comprehensive type definitions
- **Complete API Coverage**: All seo-select features accessible through React props
- **Performance Optimized**: Efficient event handling and state management
- **Developer Experience**: Familiar React patterns and best practices