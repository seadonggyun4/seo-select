/**
 * Angular Wrapper for seo-select components
 * Provides Angular-friendly interface with proper event handling
 */

import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ViewChild,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';

// Import the actual web components to register them
import '../../components/seo-select/index';
import '../../components/seo-select-search/index';

import type {
  VirtualSelectOption,
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts,
  SearchLocalizedTexts,
} from '../../types/index';

// Event detail types
export interface SelectEventDetail {
  label: string;
  value: string;
}

export interface DeselectEventDetail {
  label: string;
  value: string;
}

export interface ResetEventDetail {
  label?: string;
  value?: string;
  values?: string[];
  labels?: string[];
}

export interface SearchChangeEventDetail {
  searchText: string;
}

/**
 * SeoSelect Angular Component
 */
@Component({
  selector: 'app-seo-select',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <seo-select
      #selectElement
      [attr.id]="id"
      [attr.name]="name"
      [attr.required]="required || null"
      [attr.width]="width"
      [attr.height]="height"
      [attr.show-reset]="showReset || null"
      [attr.multiple]="multiple || null"
      [attr.theme]="theme"
      [attr.dark]="dark || null"
      [attr.language]="language"
      [attr.auto-width]="autoWidth || null"
    >
      <ng-content></ng-content>
    </seo-select>
  `,
})
export class SeoSelectComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('selectElement', { static: true }) selectElement!: ElementRef<HTMLElement>;

  @Input() id?: string;
  @Input() name?: string;
  @Input() required?: boolean;
  @Input() width?: string;
  @Input() height?: string;
  @Input() optionItems?: VirtualSelectOption[];
  @Input() showReset?: boolean;
  @Input() multiple?: boolean;
  @Input() theme?: SelectTheme;
  @Input() dark?: boolean;
  @Input() language?: SupportedLanguage;
  @Input() texts?: Partial<LocalizedTexts>;
  @Input() autoWidth?: boolean;

  @Output() selectEvent = new EventEmitter<SelectEventDetail>();
  @Output() deselectEvent = new EventEmitter<DeselectEventDetail>();
  @Output() resetEvent = new EventEmitter<ResetEventDetail>();
  @Output() changeEvent = new EventEmitter<Event>();

  private handleSelect = (e: Event) => {
    this.selectEvent.emit((e as CustomEvent).detail);
  };
  private handleDeselect = (e: Event) => {
    this.deselectEvent.emit((e as CustomEvent).detail);
  };
  private handleReset = (e: Event) => {
    this.resetEvent.emit((e as CustomEvent).detail);
  };
  private handleChange = (e: Event) => {
    this.changeEvent.emit(e);
  };

  ngAfterViewInit(): void {
    const el = this.selectElement.nativeElement;

    // Set object properties
    if (this.optionItems) {
      (el as any).optionItems = this.optionItems;
    }
    if (this.texts) {
      (el as any).texts = this.texts;
    }

    // Add event listeners
    el.addEventListener('onSelect', this.handleSelect);
    el.addEventListener('onDeselect', this.handleDeselect);
    el.addEventListener('onReset', this.handleReset);
    el.addEventListener('onChange', this.handleChange);
  }

  ngOnDestroy(): void {
    const el = this.selectElement.nativeElement;
    el.removeEventListener('onSelect', this.handleSelect);
    el.removeEventListener('onDeselect', this.handleDeselect);
    el.removeEventListener('onReset', this.handleReset);
    el.removeEventListener('onChange', this.handleChange);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const el = this.selectElement?.nativeElement;
    if (!el) return;

    if (changes['optionItems'] && this.optionItems) {
      (el as any).optionItems = this.optionItems;
    }
    if (changes['texts'] && this.texts) {
      (el as any).texts = this.texts;
    }
  }

  // Public methods
  reset(): void {
    const el = this.selectElement.nativeElement;
    (el as any).resetToDefault?.(new Event('reset'));
  }

  getValue(): string | string[] | undefined {
    const el = this.selectElement.nativeElement as any;
    if (el.multiple) {
      return el.selectedValues || [];
    }
    return el.value;
  }

  setValue(value: string | string[]): void {
    const el = this.selectElement.nativeElement as any;
    if (el.multiple && Array.isArray(value)) {
      el.selectedValues = value;
    } else {
      el.value = value;
    }
  }
}

/**
 * SeoSelectSearch Angular Component
 */
@Component({
  selector: 'app-seo-select-search',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <seo-select-search
      #selectElement
      [attr.id]="id"
      [attr.name]="name"
      [attr.required]="required || null"
      [attr.width]="width"
      [attr.height]="height"
      [attr.show-reset]="showReset || null"
      [attr.multiple]="multiple || null"
      [attr.theme]="theme"
      [attr.dark]="dark || null"
      [attr.language]="language"
      [attr.auto-width]="autoWidth || null"
    >
      <ng-content></ng-content>
    </seo-select-search>
  `,
})
export class SeoSelectSearchComponent implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('selectElement', { static: true }) selectElement!: ElementRef<HTMLElement>;

  @Input() id?: string;
  @Input() name?: string;
  @Input() required?: boolean;
  @Input() width?: string;
  @Input() height?: string;
  @Input() optionItems?: VirtualSelectOption[];
  @Input() showReset?: boolean;
  @Input() multiple?: boolean;
  @Input() theme?: SelectTheme;
  @Input() dark?: boolean;
  @Input() language?: SupportedLanguage;
  @Input() texts?: Partial<LocalizedTexts>;
  @Input() searchTexts?: Partial<SearchLocalizedTexts>;
  @Input() autoWidth?: boolean;

  @Output() selectEvent = new EventEmitter<SelectEventDetail>();
  @Output() deselectEvent = new EventEmitter<DeselectEventDetail>();
  @Output() resetEvent = new EventEmitter<ResetEventDetail>();
  @Output() changeEvent = new EventEmitter<Event>();
  @Output() searchChangeEvent = new EventEmitter<SearchChangeEventDetail>();

  private handleSelect = (e: Event) => {
    this.selectEvent.emit((e as CustomEvent).detail);
  };
  private handleDeselect = (e: Event) => {
    this.deselectEvent.emit((e as CustomEvent).detail);
  };
  private handleReset = (e: Event) => {
    this.resetEvent.emit((e as CustomEvent).detail);
  };
  private handleChange = (e: Event) => {
    this.changeEvent.emit(e);
  };
  private handleSearchChange = (e: Event) => {
    this.searchChangeEvent.emit((e as CustomEvent).detail);
  };

  ngAfterViewInit(): void {
    const el = this.selectElement.nativeElement;

    // Set object properties
    if (this.optionItems) {
      (el as any).optionItems = this.optionItems;
    }
    if (this.texts) {
      (el as any).texts = this.texts;
    }
    if (this.searchTexts) {
      (el as any).searchTexts = this.searchTexts;
    }

    // Add event listeners
    el.addEventListener('onSelect', this.handleSelect);
    el.addEventListener('onDeselect', this.handleDeselect);
    el.addEventListener('onReset', this.handleReset);
    el.addEventListener('onChange', this.handleChange);
    el.addEventListener('onSearchChange', this.handleSearchChange);
  }

  ngOnDestroy(): void {
    const el = this.selectElement.nativeElement;
    el.removeEventListener('onSelect', this.handleSelect);
    el.removeEventListener('onDeselect', this.handleDeselect);
    el.removeEventListener('onReset', this.handleReset);
    el.removeEventListener('onChange', this.handleChange);
    el.removeEventListener('onSearchChange', this.handleSearchChange);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const el = this.selectElement?.nativeElement;
    if (!el) return;

    if (changes['optionItems'] && this.optionItems) {
      (el as any).optionItems = this.optionItems;
    }
    if (changes['texts'] && this.texts) {
      (el as any).texts = this.texts;
    }
    if (changes['searchTexts'] && this.searchTexts) {
      (el as any).searchTexts = this.searchTexts;
    }
  }

  // Public methods
  reset(): void {
    const el = this.selectElement.nativeElement;
    (el as any).resetToDefault?.(new Event('reset'));
  }

  getValue(): string | string[] | undefined {
    const el = this.selectElement.nativeElement as any;
    if (el.multiple) {
      return el.selectedValues || [];
    }
    return el.value;
  }

  setValue(value: string | string[]): void {
    const el = this.selectElement.nativeElement as any;
    if (el.multiple && Array.isArray(value)) {
      el.selectedValues = value;
    } else {
      el.value = value;
    }
  }
}
