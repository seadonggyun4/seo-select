import { html } from 'lit';
import { isMultilingualMatch } from '../../utils/search.js';
import { SeoSelect } from '../seo-select/index.js';
import {
  SupportedLanguage,
  SelectTheme,
  SearchLocalizedTexts,
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
  SeoSelectEventListener
} from '../../event/index.js';

interface OptionItem {
  value: string;
  label: string;
  disabled?: boolean;
}

interface VirtualSelectOption {
  value: string;
  label: string;
}

// 글로벌 타입 확장 - SeoSelectSearch도 동일한 이벤트 사용
declare global {
  interface HTMLElementEventMap {
    [EVENT_NAMES.SELECT]: import('../../event/SeoSelectEvent.js').SeoSelectEvent;
    [EVENT_NAMES.DESELECT]: import('../../event/SeoSelectEvent.js').SeoDeselectEvent;
    [EVENT_NAMES.RESET]: import('../../event/SeoSelectEvent.js').SeoResetEvent;
    [EVENT_NAMES.CHANGE]: import('../../event/SeoSelectEvent.js').SeoChangeEvent;
    [EVENT_NAMES.SELECT_OPEN]: import('../../event/SeoSelectEvent.js').SeoOpenEvent;
  }
}

export class SeoSelectSearch extends SeoSelect {
  static get properties() {
    return {
      ...super.properties,
      _searchText: { type: String },
      _noMatchVisible: { type: Boolean },
      theme: { type: String },
      dark: { type: Boolean },
      searchTexts: { type: Object },
    };
  }

  declare _searchText: string;
  declare _noMatchVisible: boolean;
  declare theme: SelectTheme;
  declare dark: boolean;
  declare searchTexts: Partial<SearchLocalizedTexts>;

  constructor() {
    super();
    this._searchText = '';
    this._noMatchVisible = false;
    this.theme = 'float';
    this.dark = false;
    this.searchTexts = {};
  }

  /**
   * @deprecated 표준 addEventListener를 사용하세요
   */
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

  /**
   * @deprecated 표준 removeEventListener를 사용하세요
   */
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

  // 타입 안전한 이벤트 리스너 헬퍼 메서드들 (필수)
  
  /**
   * 선택 이벤트 리스너 추가 (타입 안전)
   */
  public override onSelect(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.SELECT]) => void): void {
    this.addEventListener(EVENT_NAMES.SELECT, handler as EventListener);
  }

  /**
   * 선택 해제 이벤트 리스너 추가 (타입 안전)
   */
  public override onDeselect(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.DESELECT]) => void): void {
    this.addEventListener(EVENT_NAMES.DESELECT, handler as EventListener);
  }

  /**
   * 리셋 이벤트 리스너 추가 (타입 안전)
   */
  public override onReset(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.RESET]) => void): void {
    this.addEventListener(EVENT_NAMES.RESET, handler as EventListener);
  }

  /**
   * 변경 이벤트 리스너 추가 (타입 안전)
   */
  public override onChange(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.CHANGE]) => void): void {
    this.addEventListener(EVENT_NAMES.CHANGE, handler as EventListener);
  }

  /**
   * 드롭다운 열기 이벤트 리스너 추가 (타입 안전)
   */
  public override onOpen(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.SELECT_OPEN]) => void): void {
    this.addEventListener(EVENT_NAMES.SELECT_OPEN, handler as EventListener);
  }

  /**
   * 검색 텍스트 변경 이벤트 리스너 추가 (검색 컴포넌트 전용)
   */
  public onSearchChange(handler: (searchText: string) => void): void {
    // 내부적으로 input 이벤트를 처리하여 검색 텍스트 변경을 감지
    this.addEventListener('search-text-change', ((event: CustomEvent) => {
      handler(event.detail.searchText);
    }) as EventListener);
  }

  /**
   * 검색 결과 필터링 이벤트 리스너 추가 (검색 컴포넌트 전용)
   */
  public onSearchFilter(handler: (filteredOptions: VirtualSelectOption[]) => void): void {
    this.addEventListener('search-filter', ((event: CustomEvent) => {
      handler(event.detail.filteredOptions);
    }) as EventListener);
  }

  // 검색 관련 다국어 텍스트를 가져오고 커스텀 텍스트로 오버라이드하는 헬퍼 메서드
  private getSearchLocalizedText(): SearchLocalizedTexts {
    const baseTexts = SEARCH_LOCALIZED_TEXTS[this.language] || SEARCH_LOCALIZED_TEXTS.en;
    return {
      ...baseTexts,
      ...this.searchTexts
    };
  }

  override updated(changed: Map<string, unknown>): void {
    super.updated?.(changed);
    if (changed.has('optionItems') || changed.has('_searchText') || changed.has('language') || changed.has('searchTexts')) {
      // 옵션이 변경되면 검색 텍스트 초기화
      if (changed.has('optionItems')) {
        this._searchText = '';
      }
      this._applyFilteredOptions();
    }
  }

  private getSearchIcon() {
    return ICONS.SEARCH();
  }

  // 검색 기능이 있는 드롭다운 렌더링
  private renderSearchDropdown() {
    const searchTexts = this.getSearchLocalizedText();
    const hasOptions = this.getAllOptionData().length > 0;
    const showNoData = this.multiple && !this._isLoading && !hasOptions;
    const effectiveWidth = this.getEffectiveWidth();

    return html`
      <div class="${CSS_CLASSES.LISTBOX} ${this.open ? '' : CSS_CLASSES.HIDDEN}" style="width: ${effectiveWidth};">
        <div class="${CSS_CLASSES.SEARCH_INPUT}">
          <span class="${CSS_CLASSES.SEARCH_ICON}" aria-hidden="true">${this.getSearchIcon()}</span>
          <input
            type="text"
            placeholder="${searchTexts.searchPlaceholder}"
            .value=${this._searchText}
            @input=${this._handleSearchInput}
          />
        </div>
        <div class="${CSS_CLASSES.SCROLL}" role="listbox">
          ${this._isLoading
            ? this.renderLoadingSpinner()
            : showNoData
              ? this.renderNoData()
              : ''
          }
        </div>
      </div>
    `;
  }

  protected override getThemeClass(): string {
    const themeClass = `theme-${this.theme}`;
    const darkClass = this.dark ? 'dark' : '';
    return `${themeClass} ${darkClass}`.trim();
  }

  override render() {
    if (this.multiple) {
      return this.renderMultiSelectSearch();
    } else {
      return this.renderSingleSelectSearch();
    }
  }

  private renderMultiSelectSearch() {
    const texts = this.getLocalizedText();
    const showResetButton = this.showReset && this._selectedValues.length > 0;
    const effectiveWidth = this.getEffectiveWidth();

    return html`
      <div class="${CSS_CLASSES.SELECT} ${CSS_CLASSES.MULTI_SELECT} ${this.getThemeClass()} ${this.open ? CSS_CLASSES.OPEN : ''}" style="width: ${effectiveWidth};">
        <div class="${CSS_CLASSES.SELECTED_CONTAINER} ${showResetButton ? CSS_CLASSES.WITH_RESET : ''}" @click=${this.toggleDropdown}>
          <div class="${CSS_CLASSES.SELECTED_TAGS}">
            ${this._selectedValues.map(value => {
              const option = this._options.find(opt => opt.value === value);
              const label = option?.textContent || value;
              return html`
                <span class="${CSS_CLASSES.TAG}">
                  ${label}
                  <button
                    type="button"
                    class="${CSS_CLASSES.TAG_REMOVE}"
                    @click=${(e: Event) => this.removeTag(e, value)}
                    title="${texts.removeTag}"
                  >${this.getCloseIcon()}</button>
                </span>
              `;
            })}
            ${this._selectedValues.length === 0
              ? html`<span class="${CSS_CLASSES.PLACEHOLDER}">${texts.placeholder}</span>`
              : ''
            }
          </div>
          ${showResetButton
            ? html`<button
                type="button"
                class="${CSS_CLASSES.MULTI_RESET_BUTTON}"
                @click=${this.resetToDefault}
                title="${texts.clearAll}"
              >${this.getCloseIcon()}</button>`
            : ''
          }
          <span class="${CSS_CLASSES.ARROW}">${this.open ? this.getChevronUpIcon() : this.getChevronDownIcon()}</span>
        </div>
        ${this.renderSearchDropdown()}
      </div>
    `;
  }

  private renderSingleSelectSearch() {
    const texts = this.getLocalizedText();
    const firstOptionValue = this._options && this._options.length > 0 ? this._options[0].value : null;
    const showResetButton = this.showReset &&
                          this._value !== null &&
                          firstOptionValue !== null &&
                          this._value !== firstOptionValue;
    const effectiveWidth = this.getEffectiveWidth();

    return html`
      <div class="${CSS_CLASSES.SELECT} ${this.getThemeClass()} ${this.open ? CSS_CLASSES.OPEN : ''}" style="width: ${effectiveWidth};">
        <div class="${CSS_CLASSES.SELECTED} ${showResetButton ? CSS_CLASSES.WITH_RESET : ''}" @click=${this.toggleDropdown}>
          ${this._labelText}
          ${showResetButton
            ? html`<button
                type="button"
                class="${CSS_CLASSES.RESET_BUTTON}"
                @click=${this.resetToDefault}
                title="${texts.resetToDefault}"
              >${this.getCloseIcon()}</button>`
            : ''
          }
          <span class="${CSS_CLASSES.ARROW}">${this.open ? this.getChevronUpIcon() : this.getChevronDownIcon()}</span>
        </div>
        ${this.renderSearchDropdown()}
      </div>
    `;
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
    const previousSearchText = this._searchText;
    this._searchText = input.value;

    // 검색 텍스트 변경 이벤트 발생
    if (previousSearchText !== this._searchText) {
      this.dispatchEvent(new CustomEvent('search-text-change', {
        detail: { searchText: this._searchText, previousSearchText },
        bubbles: true,
        composed: true
      }));
    }
  };

  // null을 undefined로 변환하는 헬퍼 함수
  private getCurrentValue(): string | undefined {
    return this.value ?? undefined;
  }

  // 향상된 다국어 검색 필터 적용
  private _applyFilteredOptions(): void {
    if (!this._virtual) return;

    const searchTexts = this.getSearchLocalizedText();
    const rawInput = this._searchText.trim();
    
    if (!rawInput) {
      const allOptions = this.getAllOptionData();
      this._virtual.setData(allOptions, this.multiple ? undefined : this.getCurrentValue());
      this._noMatchVisible = false;

      this.dispatchEvent(new CustomEvent('search-filter', {
        detail: { filteredOptions: allOptions, searchText: rawInput },
        bubbles: true,
        composed: true
      }));
      return;
    }

    const allOptions: OptionItem[] = this.getAllOptionData();
    
    const filtered = allOptions.filter(opt => {
      const label = (opt.label ?? '').toString();
      return isMultilingualMatch(rawInput, label);
    });

    if (filtered.length === 0) {
      const noMatchOption = [{ value: 'no_match', label: searchTexts.noMatchText, disabled: true }];
      this._virtual.setData(
        noMatchOption,
        this.multiple ? undefined : this.getCurrentValue(),
      );

      this.dispatchEvent(new CustomEvent('search-filter', {
        detail: { filteredOptions: [], searchText: rawInput, hasResults: false },
        bubbles: true,
        composed: true
      }));
      return;
    }

    this._virtual.setData(filtered, this.multiple ? undefined : this.getCurrentValue());

    this.dispatchEvent(new CustomEvent('search-filter', {
      detail: { filteredOptions: filtered, searchText: rawInput, hasResults: true },
      bubbles: true,
      composed: true
    }));
  }

  public override removeTag = (e: Event, valueToRemove: string): void => {
    e.stopPropagation();
    this._selectedValues = this._selectedValues.filter(value => value !== valueToRemove);
    this.updateFormValue();

    const option = this._optionsCache.get(valueToRemove) || this._options.find(opt => opt.value === valueToRemove);

    if (this.open) {
      this._virtual?.destroy();
      this._virtual = null;

      const optionData = this.getAllOptionData();
      if (optionData.length > 0) {
        const scrollEl = this.querySelector(`.${CSS_CLASSES.SCROLL}`) as HTMLDivElement;
        if (scrollEl) {
          this._virtual = this._createVirtualSelect(optionData, scrollEl);
          if (this._searchText) {
            this._applyFilteredOptions();
          }
          requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
          });
        }
      }
    }

    triggerDeselectEvent(this, option?.textContent || '', valueToRemove);
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
      } else {
        this._pendingActiveIndex = 0;
      }

      triggerResetEvent(this, { values: [], labels: [] });
    } else {
      if (this._options.length > 0) {
        const firstOption = this._options[0];
        this.value = firstOption.value;
        this._labelText = firstOption.textContent || '';

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

        triggerResetEvent(this, { value: firstOption.value, label: firstOption.textContent || '' });
      }
    }
    
    this._debouncedUpdate();
  };

  public override openDropdown(): void {
    triggerOpenEvent(this);
    this.open = true;
    this._debouncedUpdate();

    if (this.hasNoOptions()) {
      this._isLoading = true;
      this._debouncedUpdate();

      this.loadOptionsAsync().then(() => {
        this.initializeVirtualSelect();
      }).catch(() => {
        this._isLoading = false;
        this._debouncedUpdate();
      });
    } else {
      this.initializeVirtualSelect();
    }
  }

  public override selectOption(value: string, label: string): void {
    if (this.multiple) {
      this._selectedValues = [...this._selectedValues, value];
      this.updateFormValue();
      this._debouncedUpdate();

      this._virtual?.destroy();
      this._virtual = null;

      const scrollEl = this.querySelector(`.${CSS_CLASSES.SCROLL}`) as HTMLDivElement;
      if (scrollEl) {
        const optionData = this.getAllOptionData();
        if (optionData.length > 0) {
          this._virtual = this._createVirtualSelect(optionData, scrollEl);
          if (this._searchText) {
            this._applyFilteredOptions();
          }
          requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
          });
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
    const matched = this._optionsCache.get(newVal) || this._options.find((opt) => opt.value === newVal);
    this._labelText = matched?.textContent ?? this._labelText ?? '';

    this._internals.setFormValue(this._value || '');

    const texts = this.getLocalizedText();
    if (this.required && !this._value) {
      this._internals.setValidity({ valueMissing: true }, texts.required);
    } else {
      this._internals.setValidity({});
    }

    this._debouncedUpdate();
    
    if (emit) triggerChangeEvent(this);
  }

  public override closeDropdown(): void {
    super.closeDropdown();
    this._searchText = '';
    this._noMatchVisible = false;
    
    // 검색 입력창도 초기화
    const searchInput = this.querySelector(`.${CSS_CLASSES.SEARCH_INPUT} input`) as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
  }

  public override calculateAutoWidth(): void {
    if (this.width || this._options.length === 0) {
      this._calculatedWidth = null;
      return;
    }

    const optionTexts = this._options.map(opt => opt.textContent || '');
    
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
    this.requestUpdate();
  }

  public setSearchTexts(customSearchTexts: Partial<SearchLocalizedTexts>): void {
    this.searchTexts = { ...this.searchTexts, ...customSearchTexts };
    this.requestUpdate();
  }

  public clearSearchText(): void {
    this._searchText = '';
    this._applyFilteredOptions();
    this.requestUpdate();
  }

  public getSearchText(): string {
    return this._searchText;
  }

  public setSearchText(searchText: string): void {
    this._searchText = searchText;
    this._applyFilteredOptions();
    this.requestUpdate();
  }
}

if (!customElements.get('seo-select-search')) {
  customElements.define('seo-select-search', SeoSelectSearch);
}