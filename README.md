# seo-select
![npm](https://img.shields.io/npm/dt/seo-select?style=flat&label=NPM%20Downloads)
![GitHub Repo stars](https://img.shields.io/github/stars/seadonggyun4/seo-select?style=flat&label=GitHub%20Stars)

<img width="300" height="300" alt="logo" src="https://github.com/user-attachments/assets/e567ea31-d046-45b3-80d1-9a1e32c7e002" />

A lightweight and extensible select component built with Lit, designed to work seamlessly across frameworks. Supports search, virtual scrolling, multiple selection, i18n, and flexible theming.

> 🌟 Support with a `GitHub star` — your encouragement means the world to me!

- **[GitHub](https://github.com/seadonggyun4/seo-select)**
- **[NPM: seo-select](https://www.npmjs.com/package/seo-select)**
- **[NPM: seo-select-react](https://www.npmjs.com/package/seo-select-react)**
- **[DemoSite](https://seo-select.netlify.app/)**

## Features

- 🎨 **Multiple Themes**: Basic, float themes with dark mode support
- 🌍 **Internationalization**: Built-in support for multiple languages (EN, KO, JA, ZH)
- 🔍 **Search Functionality**: Advanced multilingual search with fuzzy matching
- ♿ **Accessibility**: Full keyboard navigation and screen reader support
- 🚀 **Virtual Scrolling**: High performance with large datasets
- 📏 **Auto Width**: Automatic width calculation based on content
- 🎯 **Multiple Selection**: Tag-based multi-select with individual remove buttons
- 💡 **Lightweight Web Component**: Built with native Web Components for minimal size and seamless integration across any framework.
- ⚡ **Modern Event System**: Standard addEventListener with type-safe helpers

## Installation

### For Modern Bundlers (Recommended)

```bash
npm install seo-select
```

```javascript
// Import basic select component
import 'seo-select';

// Import search-enabled select component
import 'seo-select/components/seo-select-search';

// Import Style
import 'seo-select/styles'

// Import Types
import 'seo-select/types';
```

### For Direct Browser Usage

```html
<!-- Import both JavaScript and CSS files -->
<link rel="stylesheet" href="./min/index.css">
<script type="module" src="./min/index.js"></script>
```

**Alternative**: Download pre-built files from [GitHub Releases](https://github.com/seadonggyun4/seo-select/releases)

## Components Overview

### `seo-select` - Basic Select Component

Standard dropdown functionality with virtual scrolling, multiple selection, themes, and form integration.

### `seo-select-search` - Search-Enhanced Select Component

Extended component with real-time multilingual search including Korean initial consonant search (ㅎㄱㅇ → 한국어), Japanese romaji search (nihongo → 日本語), and Chinese pinyin search (beijing → 北京).

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

### Standard addEventListener (Recommended)

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

## Events Reference

### Common Events (Both Components)

| Event Name | Properties | Description |
|------------|------------|-------------|
| `onSelect` | `{ label, value }` | User selects an option |
| `onDeselect` | `{ label, value }` | User removes selected option (multiple mode) |
| `onChange` | - | Form value changes |
| `onReset` | `{ value, label }` or `{ values, labels }` | Component resets to default |
| `onOpen` | - | Dropdown opens |

### Search Component Additional Events (SeoSelectSearch Only)

| Event Name | Properties | Description |
|------------|------------|-------------|
| `onSearchChange` | `searchText: string` | Search text changes in real-time |
| `onSearchFilter` | `filteredOptions: VirtualSelectOption[]` | Search results are filtered |

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


## Methods

### SeoSelect (Basic Component)

The basic `seo-select` component provides fundamental option management and value control methods:

#### Value Management
```typescript
// Get/Set single value
const currentValue = select.value;
select.value = 'option1';

// Get/Set multiple values (when multiple=true)
const selectedValues = select.selectedValues; // ['opt1', 'opt2']
select.selectedValues = ['opt1', 'opt3'];

// Reset to default value
select.resetToDefaultValue();
```

#### Dynamic Option Management
```typescript
// Add multiple options at once (replaces existing options)
select.addOptions([
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' }
], preserveSelection); // preserveSelection: boolean (default: false)

// Add a single option
select.addOption({ value: 'new', label: 'New Option' }, index); // index: optional position

// Remove a specific option by value
select.clearOption('option-value-to-remove');

// Remove all options
select.clearAllOptions();

// Batch update operations (highly optimized for performance)
select.batchUpdateOptions([
  { action: 'add', option: { value: 'new1', label: 'New 1' } },
  { action: 'remove', value: 'old-option' },
  { action: 'update', value: 'existing', option: { value: 'existing', label: 'Updated Label' } }
]);
```

#### Customization Methods
```typescript
// Change language dynamically
select.setLanguage('ko'); // 'en' | 'ko' | 'ja' | 'zh'

// Set custom localized texts
select.setTexts({ 
  placeholder: 'Custom placeholder...',
  required: 'This field is required',
  resetToDefault: 'Reset selection'
});

// Enable/disable auto-width calculation
select.setAutoWidth(true);

// Clear internal caches (useful for memory optimization)
select.clearCaches();
```

#### Event Management (Type-Safe Helpers)
```typescript
// Basic events (always available)
select.onSelect((event) => {
  console.log('Selected:', event.label, event.value);
});

select.onDeselect((event) => {
  console.log('Deselected:', event.label, event.value);
});

select.onReset((event) => {
  if (select.multiple) {
    console.log('Reset multiple:', event.values, event.labels);
  } else {
    console.log('Reset single:', event.value, event.label);
  }
});

select.onChange(() => {
  console.log('Form value changed');
});

select.onOpen(() => {
  console.log('Dropdown opened');
});
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

The `seo-select-search` component extends the basic component with advanced search functionality:

#### Search-Specific Methods
```typescript
// Set search text programmatically
searchSelect.setSearchText('search term');

// Get current search text
const currentSearch = searchSelect.getSearchText();

// Clear search text
searchSelect.clearSearchText();
```

#### Advanced Option Management
```typescript
// Update options while preserving search state
searchSelect.updateOptionsWithSearch([
  { value: 'opt1', label: 'Searchable Option 1' },
  { value: 'opt2', label: 'Searchable Option 2' }
], preserveSearch); // preserveSearch: boolean (default: true)

// Load options dynamically based on search
await searchSelect.loadOptionsForSearch('search term', async (searchText) => {
  // Custom async function to load options
  const response = await fetch(`/api/search?q=${searchText}`);
  return await response.json();
});
```

#### Search Event Handling
```typescript
// Listen to search text changes
searchSelect.onSearchChange((searchText) => {
  console.log('User typed:', searchText);
  // Trigger API calls, analytics, etc.
});

// Listen to search filter events
searchSelect.onSearchFilter((filteredOptions) => {
  console.log(`Found ${filteredOptions.length} results`);
  // Update UI indicators, show result counts, etc.
});
```

#### Custom Search Texts
```typescript
// Set search-specific localized texts
searchSelect.setSearchTexts({
  searchPlaceholder: 'Type to search...',
  noMatchText: 'No results found'
});
```

#### Inherited Methods
The `seo-select-search` component inherits all methods from the basic `seo-select` component, so you can use all the value management, option management, and customization methods mentioned above.

#### Performance Considerations
```typescript
// For large datasets, use batch operations
searchSelect.batchUpdateOptions(largeUpdateArray);

// Clear caches when dealing with frequent option updates
searchSelect.clearCaches();

// Use preserveSelection for better UX when updating options
searchSelect.addOptions(newOptions, true); // Preserves current selection
```

## TypeScript Support

### Type Definitions

For TypeScript projects, import the type definitions to enable full type safety and IntelliSense support for custom events and component APIs:

```typescript
// Import type definitions (add this once in your project)
import 'seo-select/types';

// Import components
import 'seo-select';
import 'seo-select/components/seo-select-search';
```

**That's it!** With just `import 'seo-select/types';`, you get:

- ✅ **Full type safety** for all event listeners (`addEventListener`)
- ✅ **IntelliSense support** for event properties (`event.label`, `event.value`)
- ✅ **Global type extensions** for `HTMLElementEventMap`
- ✅ **Zero configuration** - works immediately

### Basic Usage with Type Safety

```typescript
import 'seo-select/types';
import 'seo-select';

const select = document.createElement('seo-select');

// All event listeners are now fully type-safe
select.addEventListener('onSelect', (event) => {
  // TypeScript knows event.label and event.value exist
  console.log('Selected:', event.label, event.value);
});

select.addEventListener('onReset', (event) => {
  // TypeScript automatically infers the correct event type
  if (event.values) {
    console.log('Multiple reset:', event.values, event.labels);
  } else {
    console.log('Single reset:', event.value, event.label);
  }
});
```

### Advanced Usage with Specific Types

When you need specific types for your application logic, import them explicitly:

```typescript
import 'seo-select/types';
import type { 
  VirtualSelectOption,
  SeoSelectElement,
  SeoSelectSearchElement,
  SupportedLanguage,
  BatchUpdateOption
} from 'seo-select/types';

// Type-safe option creation
const options: VirtualSelectOption[] = [
  { value: 'us', label: 'United States' },
  { value: 'kr', label: 'South Korea' }
];

// Type-safe element creation
const selectElement = document.createElement('seo-select') as SeoSelectElement;
selectElement.optionItems = options;
selectElement.language = 'ko' as SupportedLanguage;

// Type-safe batch operations
const updates: BatchUpdateOption[] = [
  { action: 'add', option: { value: 'jp', label: 'Japan' } },
  { action: 'remove', value: 'us' }
];
selectElement.batchUpdateOptions(updates);
```

### Available Types

| Category | Types |
|----------|-------|
| **Component Elements** | `SeoSelectElement`, `SeoSelectSearchElement` |
| **Options & Data** | `VirtualSelectOption`, `OptionItem`, `BatchUpdateOption` |
| **Configuration** | `SupportedLanguage`, `SelectTheme`, `LocalizedTexts`, `SearchLocalizedTexts` |
| **Component Props** | `SeoSelectProps`, `SeoSelectSearchProps` |
| **Events** | `ResetEventData`, `SeoSelectEventType`, `SeoSelectEvents` |

### Event Constants

```typescript
import { SeoSelectEvents } from 'seo-select/types';

// Use event constants for consistency
select.addEventListener(SeoSelectEvents.SELECT, (event) => {
  console.log('Selected:', event.label);
});

select.addEventListener(SeoSelectEvents.SEARCH_CHANGE, (event) => {
  console.log('Search text:', event.detail);
});
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
<summary><strong>📏 Basic Layout & Sizing Variables</strong></summary>

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
<summary><strong>🎨 Theme Styles</strong></summary>

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
<summary><strong>🏷️ Multiple Selection & Tags Variables</strong></summary>

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
<summary><strong>📋 Dropdown Variables</strong></summary>

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
<summary><strong>🔍 Search Input Variables</strong></summary>

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--search-input-padding` | `0.3rem` | Internal padding of search input |
| `--search-input-text-indent` | `1.5rem` | Text indentation for search icon space |
| `--search-icon-left` | `0.7rem` | Left position of search icon |
| `--search-icon-size` | `1rem` | Size of search icon |

</details>

<details>
<summary><strong>⏳ Loading State Variables</strong></summary>

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
<summary><strong>📭 Empty State Variables</strong></summary>

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--no-data-container-padding` | `1rem 2rem` | Padding of "no data" container |
| `--no-data-text-font-size` | `0.9rem` | Font size of "no data" text |

</details>

<details>
<summary><strong>📃 Option Items Variables</strong></summary>

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--option-padding` | `0 0.8rem` | Internal padding of option items |
| `--option-line-height` | `300%` | Line height of option items |
| `--option-check-mark-margin` | `0.5rem` | Margin of checkmark in options |

</details>

<details>
<summary><strong>🔄 Reset Button Variables</strong></summary>

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
<summary><strong>↗️ Dropdown Arrow Variables</strong></summary>

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `--arrow-right` | `0.8rem` | Right position of dropdown arrow |
| `--arrow-font-size` | `0.9rem` | Font size of dropdown arrow |
| `--arrow-margin-top` | `-0.1rem` | Top margin adjustment for arrow |
| `--arrow-transition` | `transform 0.2s ease` | Transition for arrow rotation |

</details>

<details>
<summary><strong>🎨 Color Palette Variables</strong></summary>

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
The component uses a sophisticated color system based on Open Color with primary color mixing:

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

**Using the Color System:**
```scss
// Access colors using the pick() function
.my-element {
  background-color: pick(blue, 2);    // Light blue
  border-color: pick(blue, 5);        // Medium blue
  color: pick(blue, 8);               // Dark blue
}
```

</details>

<details>
<summary><strong>🌙 Dark Mode Color Variables</strong></summary>

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

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

### Version 2.2.x
- **Dynamic Option Management**: Advanced methods for real-time option manipulation
- **Real-time Virtual Scroll Sync**: Instant UI updates for option changes
- **nhanced State Management**: Improved consistency and reliability
- **Search Component Enhancements** 

### Version 2.1.x
- **Built Distribution**: Now distributes pre-built files optimized for production use
- **Improved Performance**: Ready-to-use minified JavaScript and CSS files
- **Better Compatibility**: Works out-of-the-box across different bundlers and environments
- **Enhanced Developer Experience**: No additional build step required for most use cases
- **Vite Build Integration**: Built using Vite for optimal bundle size and modern JavaScript features
- **Web Standards & Accessibility**: replace option tags with accessible divs and optimize pool size for small datasets

### Version 1.x 
- **Enhanced Event System**: Standard `addEventListener` with built-in type-safe helpers
- **Helper Methods**: `onSelect()`, `onDeselect()`, `onReset()`, `onChange()`, `onOpen()` always available
- **Improved DX**: Better TypeScript support and developer experience
- **Performance**: Optimized event handling and memory management
- **Backward Compatibility**: All existing code continues to work

---

> **Migration Note**:  
> Version 2.x maintains full API compatibility with 1.x while changing the distribution format from source TypeScript files to pre-built, optimized JavaScript and CSS files. The new dynamic option management methods provide powerful tools for building interactive applications with real-time data updates.
