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
- 🔄 **Dynamic Option Management**: Real-time option manipulation with batch operations
- 📱 **SSR Support**: Server-side rendering compatibility
- 🎛️ **Advanced Controls**: Programmatic dropdown control, cache management, and performance optimization

## Installation

```bash
npm install seo-select-react seo-select
```

**Note**: Both packages are required - `seo-select-react` provides React components while `seo-select` provides the underlying Web Component functionality.

## Quick Start

### Basic Setup

```tsx
import React, { useState } from 'react';
import { SeoSelect } from 'seo-select-react';

// Required: Import the underlying seo-select Web Component
import 'seo-select';

// Required: Import CSS styles
import 'seo-select/styles';

// Optional: Import TypeScript types for better development experience
import type { VirtualSelectOption, SupportedLanguage, SelectTheme } from 'seo-select/dist/types';

const App: React.FC = () => {
  const [value, setValue] = useState<string>('');
  
  const options: VirtualSelectOption[] = [
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

// Required imports
import 'seo-select/components/seo-select-search'; // For search functionality
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

## Import Guide

### Essential Imports

```tsx
// 1. Core Web Component (Required for SeoSelect)
import 'seo-select';

// 2. Search Web Component (Required for SeoSelectSearch)
import 'seo-select/components/seo-select-search';

// 3. CSS Styles (Required)
import 'seo-select/styles';

// 4. React Components
import { SeoSelect, SeoSelectSearch } from 'seo-select-react';
```

### TypeScript Support

```tsx
// Optional: Import types for better development experience
import type {
  VirtualSelectOption,
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts,
  SearchLocalizedTexts,
  BatchUpdateOption
} from 'seo-select/dist/types';

// React component types
import type {
  SeoSelectRef,
  SeoSelectSearchRef,
  SeoSelectProps,
  SeoSelectSearchProps
} from 'seo-select-react';
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
| `showReset` | `boolean` | `false` | Show reset button |
| `width` | `string` | `null` | Custom width (auto-calculated if not set) |
| `height` | `string` | - | Custom height |
| `autoWidth` | `boolean` | `false` | Enable automatic width calculation |
| `optionItems` | `VirtualSelectOption[]` | `[]` | Array of options |
| `value` | `string \| string[]` | - | Current selected value(s) |
| `children` | `React.ReactNode` | - | HTML option elements |
| `className` | `string` | - | Additional CSS class |
| `style` | `React.CSSProperties` | - | Inline styles |
| `texts` | `Partial<LocalizedTexts>` | `{}` | Custom localized texts |

### SeoSelectSearch Additional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchTexts` | `Partial<SearchLocalizedTexts>` | `{}` | Custom search-related texts |
| `onSearchChange` | `(searchText: string) => void` | - | Search text change handler |
| `onSearchFilter` | `(filteredOptions: VirtualSelectOption[], searchText: string, hasMatches: boolean) => void` | - | Search filter event handler |

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
  onSearchFilter={(filteredOptions, searchText, hasMatches) => {
    console.log(`Found ${filteredOptions.length} results for "${searchText}"`);
    // Update UI indicators, show result counts, etc.
  }}
/>
```

## Using Refs for Advanced Control

```tsx
import React, { useRef } from 'react';
import { SeoSelect, SeoSelectSearch, type SeoSelectRef, type SeoSelectSearchRef } from 'seo-select-react';
import type { VirtualSelectOption, BatchUpdateOption } from 'seo-select/dist/types';

const RefExample: React.FC = () => {
  const selectRef = useRef<SeoSelectRef>(null);
  const searchSelectRef = useRef<SeoSelectSearchRef>(null);

  const addDynamicOption = () => {
    const newOption: VirtualSelectOption = { 
      value: `option-${Date.now()}`, 
      label: `Dynamic Option ${Date.now()}` 
    };
    selectRef.current?.addOption(newOption);
  };

  const batchUpdateOptions = () => {
    const updates: BatchUpdateOption[] = [
      { action: 'add', option: { value: 'new1', label: 'New Option 1' } },
      { action: 'remove', value: 'old-option' },
      { action: 'update', value: 'existing', option: { value: 'existing', label: 'Updated Label' } }
    ];
    searchSelectRef.current?.batchUpdateOptions(updates);
  };

  const loadAsyncOptions = async () => {
    if (searchSelectRef.current) {
      await searchSelectRef.current.loadOptionsForSearch('api', async (searchText) => {
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

  const controlDropdown = () => {
    const isOpen = selectRef.current?.isOpen();
    if (isOpen) {
      selectRef.current?.closeDropdown();
    } else {
      selectRef.current?.openDropdown();
    }
  };

  return (
    <div>
      <SeoSelect ref={selectRef} name="basic" />
      <SeoSelectSearch ref={searchSelectRef} name="search" />
      
      <div>
        <button onClick={addDynamicOption}>Add Option</button>
        <button onClick={batchUpdateOptions}>Batch Update</button>
        <button onClick={loadAsyncOptions}>Load Async Options</button>
        <button onClick={resetSelection}>Reset</button>
        <button onClick={getCurrentValue}>Get Value</button>
        <button onClick={controlDropdown}>Toggle Dropdown</button>
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
import type { VirtualSelectOption, BatchUpdateOption } from 'seo-select/dist/types';

const DynamicExample: React.FC = () => {
  const selectRef = useRef<SeoSelectSearchRef>(null);
  const [options, setOptions] = useState<VirtualSelectOption[]>([
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]);

  // Add multiple options with selection preservation
  const addOptions = () => {
    const newOptions: VirtualSelectOption[] = [
      { value: 'new1', label: 'New Option 1' },
      { value: 'new2', label: 'New Option 2' },
    ];
    selectRef.current?.addOptions(newOptions, true); // preserveSelection = true
  };

  // Add single option at specific position
  const addSingleOption = () => {
    selectRef.current?.addOption({ value: 'single', label: 'Single Option' }, 1); // index = 1
  };

  // Remove specific option
  const removeOption = () => {
    selectRef.current?.clearOption('option1');
  };

  // Batch operations for optimal performance
  const batchUpdate = () => {
    const updates: BatchUpdateOption[] = [
      { action: 'add', option: { value: 'batch1', label: 'Batch 1' } },
      { action: 'remove', value: 'option2' },
      { action: 'update', value: 'option1', option: { value: 'option1', label: 'Updated Option 1' } },
    ];
    selectRef.current?.batchUpdateOptions(updates);
  };

  // Update options while preserving search state
  const updateOptionsWithSearch = () => {
    const updatedOptions: VirtualSelectOption[] = [
      { value: 'updated1', label: 'Updated Option 1' },
      { value: 'updated2', label: 'Updated Option 2' },
    ];
    selectRef.current?.updateOptionsWithSearch(updatedOptions, true); // preserveSearch = true
  };

  // Clear all options
  const clearAll = () => {
    selectRef.current?.clearAllOptions();
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
        <button onClick={updateOptionsWithSearch}>Update with Search</button>
        <button onClick={clearAll}>Clear All</button>
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
      <option value="html3">HTML Option 3</option>
    </SeoSelect>
  );
};
```

### Async Option Loading

```tsx
const AsyncExample: React.FC = () => {
  const selectRef = useRef<SeoSelectSearchRef>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadRemoteOptions = async () => {
    setIsLoading(true);
    try {
      await selectRef.current?.loadOptionsForSearch('search', async (searchText) => {
        // API call simulation
        const response = await fetch(`/api/options?search=${searchText}`);
        const data = await response.json();
        return data.options;
      });
    } catch (error) {
      console.error('Failed to load options:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <SeoSelectSearch ref={selectRef} name="async" />
      <button onClick={loadRemoteOptions} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Load Remote Options'}
      </button>
    </div>
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
} from 'seo-select-react';

import type {
  VirtualSelectOption,
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts,
  SearchLocalizedTexts,
  BatchUpdateOption
} from 'seo-select/dist/types';

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
const largeOptions: VirtualSelectOption[] = Array.from({ length: 10000 }, (_, i) => ({
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
// Use batch operations for multiple updates to optimize performance
const batchUpdates: BatchUpdateOption[] = [
  { action: 'add', option: { value: '1', label: 'One' } },
  { action: 'add', option: { value: '2', label: 'Two' } },
  { action: 'remove', value: 'old-option' },
  { action: 'update', value: 'existing', option: { value: 'existing', label: 'Updated' } }
];

selectRef.current?.batchUpdateOptions(batchUpdates);
```

### Cache Management

```tsx
// Clear internal caches for memory optimization
const optimizePerformance = () => {
  selectRef.current?.clearCaches();
  selectRef.current?.calculateAutoWidth(); // Recalculate dimensions
};
```

## Internationalization

### Multi-language Support

```tsx
import type { SupportedLanguage, LocalizedTexts, SearchLocalizedTexts } from 'seo-select/dist/types';

const MultiLanguageExample: React.FC = () => {
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  const customTexts: Partial<LocalizedTexts> = {
    placeholder: 'Custom placeholder...',
    noDataText: 'No data available',
    loadingText: 'Loading...',
    removeTag: 'Remove',
    clearAll: 'Clear all',
    resetToDefault: 'Reset to default',
    required: 'This field is required'
  };

  const customSearchTexts: Partial<SearchLocalizedTexts> = {
    searchPlaceholder: 'Type to search...',
    noMatchText: 'No matches found'
  };

  return (
    <div>
      <select value={language} onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}>
        <option value="en">English</option>
        <option value="ko">한국어</option>
        <option value="ja">日本語</option>
        <option value="zh">中文</option>
      </select>

      <SeoSelectSearch
        language={language}
        texts={customTexts}
        searchTexts={customSearchTexts}
        optionItems={options}
        multiple
      />
    </div>
  );
};
```

## Advanced Search Features

### Multilingual Search

The search component supports advanced multilingual search capabilities:

- **Korean**: Initial consonant search (ㅎㄱㅇ → 한국어)
- **Japanese**: Romaji search (nihongo → 日本語)  
- **Chinese**: Pinyin search (beijing → 北京)
- **English**: Fuzzy matching and partial word search

```tsx
<SeoSelectSearch
  language="ko"
  optionItems={[
    { value: 'seoul', label: '서울' },
    { value: 'busan', label: '부산' },
    { value: 'daegu', label: '대구' }
  ]}
  searchTexts={{
    searchPlaceholder: '도시를 검색하세요...',
    noMatchText: '검색 결과가 없습니다'
  }}
  onSearchFilter={(results, searchText, hasMatches) => {
    console.log(`Search "${searchText}": ${results.length} results`);
  }}
/>
```

## Accessibility

The component provides comprehensive accessibility support:

- **Keyboard Navigation**: Arrow keys, Enter, Escape, Tab support
- **Screen Reader Support**: Proper ARIA labels and announcements
- **Focus Management**: Logical focus flow and visual indicators
- **High Contrast**: Compatible with high contrast mode
- **Semantic HTML**: Proper form integration and validation
- **WCAG 2.1 AA Compliant**: Meets accessibility standards

## Migration from seo-select Web Component

```tsx
// Before (Web Component)
<seo-select name="country" theme="float" show-reset>
  <option value="us">United States</option>
</seo-select>

// After (React Component)
import 'seo-select';
import 'seo-select/styles';
import { SeoSelect } from 'seo-select-react';

<SeoSelect
  name="country"
  theme="float"
  showReset
  optionItems={[{ value: 'us', label: 'United States' }]}
/>
```

## Troubleshooting

### Common Issues

1. **Component not rendering**: Ensure you've imported the core Web Component:
   ```tsx
   import 'seo-select'; // For SeoSelect
   import 'seo-select/components/seo-select-search'; // For SeoSelectSearch
   ```

2. **Styles not applied**: Import the CSS styles:
   ```tsx
   import 'seo-select/styles';
   ```

3. **TypeScript errors**: Import types from the correct path:
   ```tsx
   import type { VirtualSelectOption } from 'seo-select/dist/types';
   ```

4. **Module resolution issues**: Update your `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "bundler" // or "node16", "nodenext"
     }
   }
   ```

## Documentation

For complete documentation, examples, and API reference, visit:
- **[Full Documentation](https://www.npmjs.com/package/seo-select?activeTab=readme)**
- **[Live Demo](https://seo-select.netlify.app/)**
- **[GitHub Repository](https://github.com/seadonggyun4/seo-select)**

## Contributing

We welcome contributions! Please see the [main repository](https://github.com/seadonggyun4/seo-select) for contribution guidelines.

## License

MIT License - see [LICENSE](https://github.com/seadonggyun4/seo-select/blob/main/LICENSE) file for details.

## Changelog

### Version 1.x
- **Enhanced Type Support**: Improved TypeScript integration with `seo-select/dist/types`
- **Advanced Option Management**: Real-time option manipulation with batch operations
- **Search State Preservation**: Maintain search text during option updates
- **Performance Optimizations**: Cache management and efficient rendering
- **Better Error Handling**: Improved error messages and fallbacks

### Version 1.0.0
- **Initial React Support**: Native React wrapper components
- **Full TypeScript Support**: Comprehensive type definitions
- **Complete API Coverage**: All seo-select features accessible through React props
- **Performance Optimized**: Efficient event handling and state management
- **Developer Experience**: Familiar React patterns and best practices