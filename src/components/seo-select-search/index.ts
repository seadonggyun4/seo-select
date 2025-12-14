import { isMultilingualMatch } from '../../utils/search.js';
import { SeoSelect } from '../seo-select/index.js';
import {
  SEARCH_LOCALIZED_TEXTS,
  CSS_CLASSES,
  ICONS,
  EVENT_NAMES
} from '../../constants/constants.js';

import {
  triggerSelectEvent,
  triggerDeselectEvent,
  triggerResetEvent,
  triggerChangeEvent,
  triggerOpenEvent,
  triggerSearchChangeEvent,
  triggerSearchFilterEvent,
  SeoSelectEventListener
} from '../../event/index.js';

import type {
  VirtualSelectOption,
  OptionItem,
  BatchUpdateOption,
  SupportedLanguage,
  SearchLocalizedTexts
} from '../../types/index.js';

// SSR/Browser detection
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

// Safe custom element definition
function safeDefineCustomElement(name: string, constructor: CustomElementConstructor): void {
  if (isBrowser() && !customElements.get(name)) {
    customElements.define(name, constructor);
  }
}

declare global {
  interface HTMLElementEventMap {
    [EVENT_NAMES.SELECT]: import('../../event/SeoSelectEvent.js').SeoSelectEvent;
    [EVENT_NAMES.DESELECT]: import('../../event/SeoSelectEvent.js').SeoDeselectEvent;
    [EVENT_NAMES.RESET]: import('../../event/SeoSelectEvent.js').SeoResetEvent;
    [EVENT_NAMES.CHANGE]: import('../../event/SeoSelectEvent.js').SeoChangeEvent;
    [EVENT_NAMES.SELECT_OPEN]: import('../../event/SeoSelectEvent.js').SeoOpenEvent;
    [EVENT_NAMES.SEARCH_CHANGE]: import('../../event/SeoSearchEvent.js').SeoSearchChangeEvent;
    [EVENT_NAMES.SEARCH_FILTER]: import('../../event/SeoSearchEvent.js').SeoSearchFilterEvent;
  }
}

export class SeoSelectSearch extends SeoSelect {
  declare _searchText: string;
  declare _noMatchVisible: boolean;
  declare searchTexts: Partial<SearchLocalizedTexts>;

  constructor() {
    super();
    this._searchText = '';
    this._noMatchVisible = false;
    this.searchTexts = {};
  }

  public override addSeoSelectEventListener<T extends keyof HTMLElementEventMap>(
    type: T,
    listener: SeoSelectEventListener<T>,
    options?: AddEventListenerOptions
  ): void {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`addSeoSelectEventListener is deprecated. Use standard addEventListener instead:
Before: searchSelect.addSeoSelectEventListener('${type}', handler);
After:  searchSelect.addEventListener('${type}', handler);`);
    }
    this.addEventListener(type, listener as EventListener, options);
  }

  public override removeSeoSelectEventListener<T extends keyof HTMLElementEventMap>(
    type: T,
    listener: SeoSelectEventListener<T>,
    options?: EventListenerOptions
  ): void {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`removeSeoSelectEventListener is deprecated. Use standard removeEventListener instead:
Before: searchSelect.removeSeoSelectEventListener('${type}', handler);
After:  searchSelect.removeEventListener('${type}', handler);`);
    }
    this.removeEventListener(type, listener as EventListener, options);
  }

  public override onSelect(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.SELECT]) => void): void {
    this.addEventListener(EVENT_NAMES.SELECT, handler as EventListener);
  }

  public override onDeselect(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.DESELECT]) => void): void {
    this.addEventListener(EVENT_NAMES.DESELECT, handler as EventListener);
  }

  public override onReset(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.RESET]) => void): void {
    this.addEventListener(EVENT_NAMES.RESET, handler as EventListener);
  }

  public override onChange(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.CHANGE]) => void): void {
    this.addEventListener(EVENT_NAMES.CHANGE, handler as EventListener);
  }

  public override onOpen(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.SELECT_OPEN]) => void): void {
    this.addEventListener(EVENT_NAMES.SELECT_OPEN, handler as EventListener);
  }

  public onSearchChange(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.SEARCH_CHANGE]) => void): void {
    this.addEventListener(EVENT_NAMES.SEARCH_CHANGE, handler as EventListener);
  }

  public onSearchFilter(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.SEARCH_FILTER]) => void): void {
    this.addEventListener(EVENT_NAMES.SEARCH_FILTER, handler as EventListener);
  }

  private getSearchLocalizedText(): SearchLocalizedTexts {
    const baseTexts = SEARCH_LOCALIZED_TEXTS[this.language] || SEARCH_LOCALIZED_TEXTS.en;
    return {
      ...baseTexts,
      ...this.searchTexts
    };
  }

  protected override _render(): void {
    if (this.multiple) {
      this._renderMultiSelectSearch();
    } else {
      this._renderSingleSelectSearch();
    }
    this._bindSearchEvents();
  }

  private _renderMultiSelectSearch(): void {
    const texts = this.getLocalizedText();
    const showResetButton = this.showReset && this._selectedValues.length > 0;
    const effectiveWidth = this.getEffectiveWidth();
    const effectiveHeight = this.getEffectiveHeight();
    const searchTexts = this.getSearchLocalizedText();

    const tagsHtml = this._selectedValues.map(value => {
      const option = this._optionsCache.get(value) || this._optionData.find(opt => opt.value === value);
      const label = option?.label || value;
      return `
        <span class="${CSS_CLASSES.TAG}">
          ${this._escapeHtml(label)}
          <button
            type="button"
            class="${CSS_CLASSES.TAG_REMOVE}"
            data-value="${this._escapeHtml(value)}"
            title="${texts.removeTag}"
          >${ICONS.CLOSE()}</button>
        </span>
      `;
    }).join('');

    const placeholderHtml = this._selectedValues.length === 0
      ? `<span class="${CSS_CLASSES.PLACEHOLDER}">${texts.placeholder}</span>`
      : '';

    const resetButtonHtml = showResetButton
      ? `<button
          type="button"
          class="${CSS_CLASSES.MULTI_RESET_BUTTON}"
          data-action="reset"
          title="${texts.clearAll}"
        >${ICONS.CLOSE()}</button>`
      : '';

    const dropdownContent = this._getSearchDropdownContent();

    this.innerHTML = `
      <div class="${CSS_CLASSES.SELECT} ${CSS_CLASSES.MULTI_SELECT} ${this._getThemeClass()} ${this.open ? CSS_CLASSES.OPEN : ''}" style="width: ${effectiveWidth};">
        <div class="${CSS_CLASSES.SELECTED_CONTAINER} ${showResetButton ? CSS_CLASSES.WITH_RESET : ''}" data-action="toggle">
          <div class="${CSS_CLASSES.SELECTED_TAGS}">
            ${tagsHtml}
            ${placeholderHtml}
          </div>
          ${resetButtonHtml}
          <span class="${CSS_CLASSES.ARROW}">${this.open ? ICONS.CHEVRON_UP() : ICONS.CHEVRON_DOWN()}</span>
        </div>
        <div class="${CSS_CLASSES.LISTBOX} ${this.open ? '' : CSS_CLASSES.HIDDEN}"
             style="width: ${effectiveWidth}; height: ${effectiveHeight};">
          <div class="${CSS_CLASSES.SEARCH_INPUT}">
            <span class="${CSS_CLASSES.SEARCH_ICON}" aria-hidden="true">${ICONS.SEARCH()}</span>
            <input
              type="text"
              placeholder="${searchTexts.searchPlaceholder}"
              value="${this._escapeHtml(this._searchText)}"
              data-action="search"
            />
          </div>
          <div class="${CSS_CLASSES.SCROLL}" role="listbox" style="height: calc(${effectiveHeight} - 50px);">
            ${dropdownContent}
          </div>
        </div>
      </div>
    `;
  }

  private _renderSingleSelectSearch(): void {
    const texts = this.getLocalizedText();
    const firstOptionValue = this._optionData.length > 0 ? this._optionData[0].value : null;
    const showResetButton = this.showReset &&
                          this._value !== null &&
                          firstOptionValue !== null &&
                          this._value !== firstOptionValue;
    const effectiveWidth = this.getEffectiveWidth();
    const effectiveHeight = this.getEffectiveHeight();
    const searchTexts = this.getSearchLocalizedText();

    const resetButtonHtml = showResetButton
      ? `<button
          type="button"
          class="${CSS_CLASSES.RESET_BUTTON}"
          data-action="reset"
          title="${texts.resetToDefault}"
        >${ICONS.CLOSE()}</button>`
      : '';

    const dropdownContent = this._getSearchDropdownContent();

    this.innerHTML = `
      <div class="${CSS_CLASSES.SELECT} ${this._getThemeClass()} ${this.open ? CSS_CLASSES.OPEN : ''}" style="width: ${effectiveWidth};">
        <div class="${CSS_CLASSES.SELECTED} ${showResetButton ? CSS_CLASSES.WITH_RESET : ''}" data-action="toggle">
          ${this._escapeHtml(this._labelText)}
          ${resetButtonHtml}
          <span class="${CSS_CLASSES.ARROW}">${this.open ? ICONS.CHEVRON_UP() : ICONS.CHEVRON_DOWN()}</span>
        </div>
        <div class="${CSS_CLASSES.LISTBOX} ${this.open ? '' : CSS_CLASSES.HIDDEN}"
             style="width: ${effectiveWidth}; height: ${effectiveHeight};">
          <div class="${CSS_CLASSES.SEARCH_INPUT}">
            <span class="${CSS_CLASSES.SEARCH_ICON}" aria-hidden="true">${ICONS.SEARCH()}</span>
            <input
              type="text"
              placeholder="${searchTexts.searchPlaceholder}"
              value="${this._escapeHtml(this._searchText)}"
              data-action="search"
            />
          </div>
          <div class="${CSS_CLASSES.SCROLL}" role="listbox" style="height: calc(${effectiveHeight} - 50px);">
            ${dropdownContent}
          </div>
        </div>
      </div>
    `;
  }

  private _getSearchDropdownContent(): string {
    const availableOptions = this.getAllOptionData();
    const hasOptions = availableOptions.length > 0;

    const showNoData = this.multiple && !this._isLoading && (
      (availableOptions.length === 0) ||
      (!hasOptions && this._searchText.trim())
    );

    if (this._isLoading) {
      return this._renderLoadingSpinner();
    }
    if (showNoData) {
      return this._renderNoData();
    }
    return '';
  }

  private _bindSearchEvents(): void {
    // Toggle dropdown
    const toggleEl = this.querySelector('[data-action="toggle"]');
    if (toggleEl) {
      toggleEl.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.closest('[data-action="reset"]') || target.closest(`.${CSS_CLASSES.TAG_REMOVE}`)) {
          return;
        }
        this.toggleDropdown();
      });
    }

    // Reset button
    const resetBtn = this.querySelector('[data-action="reset"]');
    if (resetBtn) {
      resetBtn.addEventListener('click', (e: Event) => this.resetToDefault(e));
    }

    // Tag remove buttons
    const tagRemoveBtns = this.querySelectorAll(`.${CSS_CLASSES.TAG_REMOVE}`);
    tagRemoveBtns.forEach(btn => {
      btn.addEventListener('click', (e: Event) => {
        e.stopPropagation();
        const value = (btn as HTMLElement).dataset.value;
        if (value) {
          this.removeTag(e, value);
        }
      });
    });

    // Search input
    const searchInput = this.querySelector('[data-action="search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e: Event) => this._handleSearchInput(e));
    }
  }

  public override calculateDropdownHeight(): string {
    const searchInputHeight = 50;

    if (this._isLoading) {
      return `${80 + searchInputHeight}px`;
    }

    const availableOptions = this.getAllOptionData();

    if (this.multiple && availableOptions.length === 0) {
      return `${60 + searchInputHeight}px`;
    }

    if (this._optionData.length === 0) {
      if (this.multiple) {
        if (this._searchText.trim()) {
          return `${60 + searchInputHeight}px`;
        }
        return `${searchInputHeight + 20}px`;
      }
      return 'auto';
    }

    const rowHeight = 36;
    const maxHeight = 360;
    const computedHeight = availableOptions.length * rowHeight;
    const finalHeight = availableOptions.length > 10 ? maxHeight : computedHeight;

    return `${finalHeight + searchInputHeight + 5}px`;
  }

  public override _createVirtualSelect(options: VirtualSelectOption[], container: HTMLDivElement) {
    const virtual = super._createVirtualSelect(options, container);
    if (virtual) {
      (virtual as any).isitSearch = true;
    }
    return virtual;
  }

  protected override initializeVirtualSelect(): void {
    const scrollEl = this.querySelector(`.${CSS_CLASSES.SCROLL}`) as HTMLDivElement;
    const optionData = this.getAllOptionData();

    this._calculatedHeight = this.calculateDropdownHeight();

    if (this.multiple && optionData.length === 0) {
      return;
    }

    if (!this._virtual && scrollEl && !this._isLoading && optionData.length > 0) {
      this._virtual = this._createVirtualSelect(optionData, scrollEl);

      if (this._searchText) {
        this._applyFilteredOptions();
      }

      if (this.multiple) {
        requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(0);
        });
      } else {
        const selectedIndex = optionData.findIndex((opt) => opt.value === this._value);
        requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
        });
      }
    }
  }

  private _handleSearchInput = (e: Event): void => {
    const input = e.target as HTMLInputElement;
    this.setSearchText(input.value);
  };

  private getCurrentValue(): string | undefined {
    return this.value ?? undefined;
  }

  private _applyFilteredOptions(): void {
    if (!this._virtual) return;

    const searchTexts = this.getSearchLocalizedText();
    const rawInput = this._searchText.trim();

    if (!rawInput) {
      const allOptions = this.getAllOptionData();

      if (this.multiple && allOptions.length === 0) {
        const noDataOption = [{ value: 'all_selected', label: searchTexts.noMatchText, disabled: true }];
        this._virtual.setData(noDataOption, undefined);
        this._calculatedHeight = this.calculateDropdownHeight();
        triggerSearchFilterEvent(this, [], rawInput, false);
        this._debouncedUpdate();
        return;
      }

      this._virtual.setData(allOptions, this.multiple ? undefined : this.getCurrentValue());
      this._noMatchVisible = false;

      this._calculatedHeight = this.calculateDropdownHeight();
      triggerSearchFilterEvent(this, allOptions, rawInput, true);
      this._debouncedUpdate();
      return;
    }

    const allOptions: OptionItem[] = this.getAllOptionData();

    if (this.multiple && allOptions.length === 0) {
      const noDataOption = [{ value: 'all_selected', label: searchTexts.noMatchText, disabled: true }];
      this._virtual.setData(noDataOption, undefined);
      this._calculatedHeight = `${60 + 50 + 5}px`;
      triggerSearchFilterEvent(this, [], rawInput, false);
      this._debouncedUpdate();
      return;
    }

    const filtered = allOptions.filter(opt => {
      const label = (opt.label ?? '').toString();
      return isMultilingualMatch(rawInput, label);
    });

    if (filtered.length === 0) {
      const noMatchOption = [{ value: 'no_match', label: searchTexts.noMatchText, disabled: true }];
      this._virtual.setData(noMatchOption, this.multiple ? undefined : this.getCurrentValue());

      this._calculatedHeight = `${60 + 50 + 5}px`;
      triggerSearchFilterEvent(this, [], rawInput, false);
      this._debouncedUpdate();
      return;
    }

    this._virtual.setData(filtered, this.multiple ? undefined : this.getCurrentValue());

    const rowHeight = 36;
    const maxHeight = 360;
    const searchInputHeight = 50;
    const computedHeight = filtered.length * rowHeight;
    const finalHeight = filtered.length > 10 ? maxHeight : computedHeight;
    this._calculatedHeight = `${finalHeight + searchInputHeight + 5}px`;

    triggerSearchFilterEvent(this, filtered, rawInput, true);
    this._debouncedUpdate();
  }

  public override removeTag = (e: Event, valueToRemove: string): void => {
    e.stopPropagation();
    this._selectedValues = this._selectedValues.filter(value => value !== valueToRemove);
    this.updateFormValue();

    const option = this._optionsCache.get(valueToRemove) || this._optionData.find(opt => opt.value === valueToRemove);

    if (this.open) {
      this._virtual?.destroy();
      this._virtual = null;

      const optionData = this.getAllOptionData();
      const scrollEl = this.querySelector(`.${CSS_CLASSES.SCROLL}`) as HTMLDivElement;

      if (scrollEl) {
        if (optionData.length > 0) {
          this._virtual = this._createVirtualSelect(optionData, scrollEl);

          if (this._searchText.trim()) {
            this._applyFilteredOptions();
          } else {
            this._calculatedHeight = this.calculateDropdownHeight();
          }

          requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
          });
        } else {
          this._calculatedHeight = this.calculateDropdownHeight();
        }
      }
    }

    triggerDeselectEvent(this, option?.label || '', valueToRemove);
    this._debouncedUpdate();
  };

  public override resetToDefault = (e: Event): void => {
    e.stopPropagation();

    if (this.multiple) {
      this._selectedValues = [];
      this.updateFormValue();

      if (this.open) {
        this._virtual?.destroy();
        this._virtual = null;

        const scrollEl = this.querySelector(`.${CSS_CLASSES.SCROLL}`) as HTMLDivElement;
        if (scrollEl) {
          const optionData = this.getAllOptionData();
          this._virtual = this._createVirtualSelect(optionData, scrollEl);
          if (this._searchText) {
            this._applyFilteredOptions();
          }
          requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
          });
        }

        this._calculatedHeight = this.calculateDropdownHeight();
      } else {
        this._pendingActiveIndex = 0;
      }

      triggerResetEvent(this, { values: [], labels: [] });
    } else {
      if (this._optionData.length > 0) {
        const firstOption = this._optionData[0];
        this.value = firstOption.value;
        this._labelText = firstOption.label || '';

        if (this.open && this._virtual) {
          requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
            if (this._virtual) {
              this._virtual.setActiveAndFocusedIndex(0);
              this._virtual.applyHighlight();
            }
          });
        } else {
          this._pendingActiveIndex = 0;

          if (this._virtual) {
            this._virtual.destroy();
            this._virtual = null;
          }
        }

        triggerResetEvent(this, { value: firstOption.value, label: firstOption.label || '' });
      }
    }

    this._debouncedUpdate();
  };

  public override openDropdown(): void {
    triggerOpenEvent(this);
    this.open = true;
    this._render();

    if (this.hasNoOptions()) {
      this._isLoading = true;
      this._calculatedHeight = this.calculateDropdownHeight();
      this._render();

      this.loadOptionsAsync().then(() => {
        this._calculatedHeight = this.calculateDropdownHeight();
        this.initializeVirtualSelect();
      }).catch(() => {
        this._isLoading = false;
        this._calculatedHeight = this.calculateDropdownHeight();
        this._render();
      });
    } else {
      if (this._virtual) {
        this._virtual.destroy();
        this._virtual = null;
      }

      this._calculatedHeight = this.calculateDropdownHeight();

      this.initializeVirtualSelect();
    }
  }

  public override selectOption(value: string, label: string): void {
    if (this.multiple) {
      this._selectedValues = [...this._selectedValues, value];
      this.updateFormValue();
      this._render();

      this._virtual?.destroy();
      this._virtual = null;

      const scrollEl = this.querySelector(`.${CSS_CLASSES.SCROLL}`) as HTMLDivElement;
      if (scrollEl) {
        const optionData = this.getAllOptionData();
        if (optionData.length > 0) {
          this._virtual = this._createVirtualSelect(optionData, scrollEl);

          if (this._searchText.trim()) {
            this._applyFilteredOptions();
          } else {
            this._calculatedHeight = this.calculateDropdownHeight();
          }

          requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
          });
        } else {
          this._calculatedHeight = this.calculateDropdownHeight();
        }
      }

      triggerSelectEvent(this, label, value);
    } else {
      this._labelText = label;
      this._setValue(value);
      this.closeDropdown();
      triggerSelectEvent(this, label, value);
    }
  }

  public override _setValue(newVal: string, emit: boolean = true): void {
    if (this._value === newVal) return;

    this._value = newVal;
    const matched = this._optionsCache.get(newVal) || this._optionData.find((opt) => opt.value === newVal);
    // 문자열인지 확인하여 [object Object] 방지
    const label = matched?.label;
    this._labelText = typeof label === 'string' ? label : (this._labelText || '');

    this._internals.setFormValue(this._value || '');

    const texts = this.getLocalizedText();
    if (this.required && !this._value) {
      this._internals.setValidity({ valueMissing: true }, texts.required);
    } else {
      this._internals.setValidity({});
    }

    if (emit) triggerChangeEvent(this);
  }

  public override closeDropdown(): void {
    this.open = false;

    if (this._virtual) {
      this._virtual.destroy();
      this._virtual = null;
    }

    this._searchText = '';
    this._noMatchVisible = false;

    this._calculatedHeight = null;

    this._render();
  }

  public clearSearchText(): void {
    this._searchText = '';
    this._calculatedHeight = this.calculateDropdownHeight();
    this._applyFilteredOptions();
    this._render();
  }

  public override calculateAutoWidth(): void {
    if (this.width || this._optionData.length === 0) {
      this._calculatedWidth = null;
      return;
    }

    const optionTexts = this._optionData.map(opt => opt.label || '');

    const texts = this.getLocalizedText();
    const searchTexts = this.getSearchLocalizedText();

    if (this.multiple) {
      optionTexts.push(texts.placeholder);
    }
    optionTexts.push(searchTexts.searchPlaceholder);

    const computedStyle = window.getComputedStyle(this);
    const font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;

    const maxTextWidth = this.getMaxOptionWidth(optionTexts, font);

    const additionalSpace = this.multiple ? 140 : 100;
    const totalWidth = maxTextWidth + additionalSpace;

    this._calculatedWidth = `${Math.max(totalWidth, 200)}px`;
  }

  public override setLanguage(language: SupportedLanguage): void {
    super.setLanguage(language);
    this._render();
  }

  public setSearchTexts(customSearchTexts: Partial<SearchLocalizedTexts>): void {
    this.searchTexts = { ...this.searchTexts, ...customSearchTexts };
    this._render();
  }

  public getSearchText(): string {
    return this._searchText;
  }

  private _emitSearchChange(prev: string, next: string) {
    triggerSearchChangeEvent(this, next, prev === '' ? undefined : prev);
  }

  public setSearchText(searchText: string): void {
    const prev = this._searchText ?? '';
    const next = (searchText ?? '').toString();
    if (prev === next) return;

    this._searchText = next;
    this._applyFilteredOptions();

    this._emitSearchChange(prev, next);
  }

  get searchText(): string {
    return this._searchText;
  }

  set searchText(v: string) {
    this.setSearchText(v);
  }

  private _updateVirtualScrollDataWithSearch(): void {
    if (!this._virtual) return;

    const optionData = this.getAllOptionData();

    if (optionData.length > 0) {
      const activeValue = this.multiple ? undefined : this._value || undefined;
      this._virtual.setData(optionData, activeValue);

      if (this._searchText) {
        requestAnimationFrame(() => {
          this._applyFilteredOptions();
        });
      } else {
        requestAnimationFrame(() => {
          if (!this._virtual) return;

          if (this.multiple) {
            this._virtual.setActiveIndex(0);
          } else {
            const selectedIndex = optionData.findIndex(opt => opt.value === this._value);
            this._virtual.setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
          }
        });
      }
    } else {
      if (this.multiple) {
        const searchTexts = this.getSearchLocalizedText();
        const noDataOption = [{ value: 'all_selected', label: searchTexts.noMatchText, disabled: true }];
        this._virtual.setData(noDataOption, undefined);
      } else {
        this._virtual.clearData();
      }
    }
  }

  public override addOptions(options: VirtualSelectOption[], preserveSelection: boolean = false): void {
    if (this._isUpdating) return;
    this._isUpdating = true;

    try {
      let previousValue: string | null = null;
      let previousSelectedValues: string[] = [];

      if (preserveSelection) {
        if (this.multiple) {
          previousSelectedValues = [...this._selectedValues];
        } else {
          previousValue = this._value;
        }
      }

      this._optionsCache.clear();
      this._widthCalculationCache.clear();
      this._optionData = [];

      if (Array.isArray(options) && options.length > 0) {
        this._optionData = options.map(opt => {
          const optionItem: VirtualSelectOption = {
            value: opt.value,
            label: opt.label
          };
          this._optionsCache.set(opt.value, optionItem);
          return optionItem;
        });
        this._isLoading = false;
      } else {
        this._isLoading = true;
      }

      if (preserveSelection && options.length > 0) {
        if (this.multiple) {
          const validValues = previousSelectedValues.filter(value =>
            this._optionData.some(opt => opt.value === value)
          );
          this._selectedValues = validValues;
          this.updateFormValue();
        } else {
          if (previousValue && this._optionData.some(opt => opt.value === previousValue)) {
            this._setValue(previousValue, false);
          } else if (this._optionData.length > 0) {
            this._setValue(this._optionData[0].value, false);
          }
        }
      } else {
        if (this.multiple) {
          this._selectedValues = [];
          this.updateFormValue();
        } else if (this._optionData.length > 0) {
          this._setValue(this._optionData[0].value, false);
        }
      }

      if (!preserveSelection) {
        this._searchText = '';
      }

      this._calculatedHeight = this.calculateDropdownHeight();

      this._updateVirtualScrollDataWithSearch();

      if (this._optionData.length > 0) {
        this._initialValue = this._optionData[0].value;
        this._initialLabel = this._optionData[0].label;
      } else {
        this._initialValue = null;
        this._initialLabel = null;
      }

      this.calculateAutoWidth();

    } finally {
      this._isUpdating = false;
      this._debouncedUpdate();
    }
  }

  public override addOption(option: VirtualSelectOption, index?: number): void {
    if (this._isUpdating) return;

    if (this._optionData.some(opt => opt.value === option.value)) {
      console.warn(`Option with value "${option.value}" already exists`);
      return;
    }

    this._isUpdating = true;

    try {
      const optionItem: VirtualSelectOption = {
        value: option.value,
        label: option.label
      };
      this._optionsCache.set(option.value, optionItem);

      const insertIndex = index !== undefined ? Math.max(0, Math.min(index, this._optionData.length)) : this._optionData.length;

      if (insertIndex >= this._optionData.length) {
        this._optionData.push(optionItem);
      } else {
        this._optionData.splice(insertIndex, 0, optionItem);
      }

      this._widthCalculationCache.clear();
      this._isLoading = false;

      this._calculatedHeight = this.calculateDropdownHeight();

      this._updateVirtualScrollDataWithSearch();

      if (this._optionData.length === 1) {
        this._initialValue = option.value;
        this._initialLabel = option.label;

        if (!this.multiple && !this._value) {
          this._setValue(option.value, false);
        }
      }

      this.calculateAutoWidth();

    } finally {
      this._isUpdating = false;
      this._debouncedUpdate();
    }
  }

  public override clearOption(value: string): void {
    if (this._isUpdating) return;

    const optionIndex = this._optionData.findIndex(opt => opt.value === value);
    if (optionIndex === -1) return;

    this._isUpdating = true;

    try {
      const removedOption = this._optionData[optionIndex];
      this._optionData.splice(optionIndex, 1);
      this._optionsCache.delete(value);
      this._widthCalculationCache.clear();

      if (this.multiple) {
        const selectedIndex = this._selectedValues.indexOf(value);
        if (selectedIndex > -1) {
          this._selectedValues.splice(selectedIndex, 1);
          this.updateFormValue();
          triggerDeselectEvent(this, removedOption.label || '', value);
        }
      } else {
        if (this._value === value) {
          if (this._optionData.length > 0) {
            this._setValue(this._optionData[0].value, true);
          } else {
            this._setValue('', true);
            this._labelText = '';
          }
        }
      }

      this._calculatedHeight = this.calculateDropdownHeight();

      this._updateVirtualScrollDataWithSearch();

      if (this._optionData.length > 0) {
        this._initialValue = this._optionData[0].value;
        this._initialLabel = this._optionData[0].label;
      } else {
        this._initialValue = null;
        this._initialLabel = null;
        this._isLoading = true;
        if (!this.multiple) {
          this._labelText = '';
        }
      }

      this.calculateAutoWidth();

    } finally {
      this._isUpdating = false;
      this._debouncedUpdate();
    }
  }

  public override clearAllOptions(): void {
    if (this._isUpdating) return;
    this._isUpdating = true;

    try {
      this._optionData = [];
      this._optionsCache.clear();
      this._widthCalculationCache.clear();

      if (this.multiple) {
        const previousSelectedValues = [...this._selectedValues];
        this._selectedValues = [];
        this.updateFormValue();

        if (previousSelectedValues.length > 0) {
          triggerResetEvent(this, { values: [], labels: [] });
        }
      } else {
        const previousValue = this._value;
        this._setValue('', true);
        this._labelText = '';

        if (previousValue) {
          triggerResetEvent(this, { value: '', label: '' });
        }
      }

      this._searchText = '';
      this._noMatchVisible = false;

      this._calculatedHeight = 'auto';

      if (this._virtual) {
        this._virtual.clearData();
      }

      this._initialValue = null;
      this._initialLabel = null;
      this._isLoading = true;
      this._calculatedWidth = null;

    } finally {
      this._isUpdating = false;
      this._debouncedUpdate();
    }
  }

  public override batchUpdateOptions(updates: Array<BatchUpdateOption>): void {
    if (this._isUpdating) return;
    this._isUpdating = true;
    let hasChanges = false;

    try {
      updates.forEach(update => {
        switch (update.action) {
          case 'add':
            if (update.option && !this._optionData.some(opt => opt.value === update.option!.value)) {
              const optionItem: VirtualSelectOption = {
                value: update.option.value,
                label: update.option.label
              };
              this._optionsCache.set(update.option.value, optionItem);

              const insertIndex = update.index !== undefined ?
                Math.max(0, Math.min(update.index, this._optionData.length)) :
                this._optionData.length;

              if (insertIndex >= this._optionData.length) {
                this._optionData.push(optionItem);
              } else {
                this._optionData.splice(insertIndex, 0, optionItem);
              }
              hasChanges = true;
            }
            break;

          case 'remove':
            if (update.value) {
              const optionIndex = this._optionData.findIndex(opt => opt.value === update.value);
              if (optionIndex !== -1) {
                this._optionData.splice(optionIndex, 1);
                this._optionsCache.delete(update.value);

                if (this.multiple) {
                  const selectedIndex = this._selectedValues.indexOf(update.value);
                  if (selectedIndex > -1) {
                    this._selectedValues.splice(selectedIndex, 1);
                  }
                } else {
                  if (this._value === update.value) {
                    if (this._optionData.length > 0) {
                      this._setValue(this._optionData[0].value, false);
                    } else {
                      this._setValue('', false);
                      this._labelText = '';
                    }
                  }
                }
                hasChanges = true;
              }
            }
            break;

          case 'update':
            if (update.option && update.value) {
              const existingOption = this._optionData.find(opt => opt.value === update.value);
              if (existingOption) {
                existingOption.label = update.option.label;
                this._optionsCache.set(update.value, existingOption);
                if (!this.multiple && this._value === update.value) {
                  this._labelText = update.option.label;
                }
                hasChanges = true;
              }
            }
            break;
        }
      });

      if (hasChanges) {
        this._widthCalculationCache.clear();
        this._isLoading = this._optionData.length === 0;

        this._calculatedHeight = this.calculateDropdownHeight();

        if (this.open) {
          this._updateVirtualScrollDataWithSearch();
        }

        if (this._optionData.length > 0) {
          this._initialValue = this._optionData[0].value;
          this._initialLabel = this._optionData[0].label;
        } else {
          this._initialValue = null;
          this._initialLabel = null;
          if (!this.multiple) {
            this._labelText = '';
          }
        }

        if (this.multiple) {
          this.updateFormValue();
        }

        this.calculateAutoWidth();
      }

    } finally {
      this._isUpdating = false;
      if (hasChanges) {
        this._debouncedUpdate();
      }
    }
  }

  public updateOptionsWithSearch(options: VirtualSelectOption[], preserveSearch: boolean = true): void {
    const currentSearchText = preserveSearch ? this._searchText : '';

    this.addOptions(options, true);

    if (preserveSearch && currentSearchText) {
      this._searchText = currentSearchText;
      this._updateVirtualScrollDataWithSearch();
    }
  }

  public async loadOptionsForSearch(
    searchText: string,
    optionLoader: (search: string) => Promise<VirtualSelectOption[]>
  ): Promise<void> {
    this._isLoading = true;
    this._searchText = searchText;
    this._calculatedHeight = this.calculateDropdownHeight();
    this._render();

    try {
      const newOptions = await optionLoader(searchText);
      this.addOptions(newOptions, false);

      this._searchText = searchText;
      if (this._virtual && this.open) {
        this._applyFilteredOptions();
      }
    } catch (error) {
      console.error('Failed to load options for search:', error);
      this._isLoading = false;
      this._calculatedHeight = this.calculateDropdownHeight();
      this._render();
    }
  }
}

safeDefineCustomElement('seo-select-search', SeoSelectSearch);
