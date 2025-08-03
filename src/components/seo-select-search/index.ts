import { html } from 'lit';
import { isMultilingualMatch } from '../../utils/search.js';
import { SeoSelect } from '../seo-select/index.js';
import {
  SupportedLanguage,
  SelectTheme,
  SearchLocalizedTexts,
  SEARCH_LOCALIZED_TEXTS,
  CSS_CLASSES,
  ICONS
} from '../../constants/constants.js';

import {
  triggerSelectEvent,
  triggerDeselectEvent,
  triggerResetEvent,
  triggerChangeEvent,
  triggerOpenEvent,
  SeoSelectEventMap,
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
   * 타입 안전한 이벤트 리스너 추가 메서드 (부모 클래스 메서드 오버라이드)
   */
  public override addSeoSelectEventListener<T extends keyof SeoSelectEventMap>(
    type: T,
    listener: SeoSelectEventListener<T>,
    options?: AddEventListenerOptions
  ): void {
    super.addSeoSelectEventListener(type, listener, options);
  }

  /**
   * 타입 안전한 이벤트 리스너 제거 메서드 (부모 클래스 메서드 오버라이드)
   */
  public override removeSeoSelectEventListener<T extends keyof SeoSelectEventMap>(
    type: T,
    listener: SeoSelectEventListener<T>,
    options?: EventListenerOptions
  ): void {
    super.removeSeoSelectEventListener(type, listener, options);
  }

  // 검색 관련 다국어 텍스트를 가져오고 커스텀 텍스트로 오버라이드하는 헬퍼 메서드
  private getSearchLocalizedText(): SearchLocalizedTexts {
    const baseTexts = SEARCH_LOCALIZED_TEXTS[this.language] || SEARCH_LOCALIZED_TEXTS.en;
    return {
      ...baseTexts,
      ...this.searchTexts
    };
  }

  updated(changed: Map<string, unknown>): void {
    super.updated?.(changed);
    if (changed.has('optionItems') || changed.has('_searchText') || changed.has('language') || changed.has('searchTexts')) {
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
    const effectiveWidth = this.getEffectiveWidth(); // 부모 클래스의 public 메서드 사용

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

  // 부모 클래스의 getThemeClass 메서드를 오버라이드하여 다크 모드 지원
  protected override getThemeClass(): string {
    const themeClass = `theme-${this.theme}`;
    const darkClass = this.dark ? 'dark' : '';
    return `${themeClass} ${darkClass}`.trim();
  }

  render() {
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
        <button type="button" class="${CSS_CLASSES.SELECTED} ${showResetButton ? CSS_CLASSES.WITH_RESET : ''}" @click=${this.toggleDropdown}>
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
        </button>
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

  // 가상 스크롤 초기화 - 부모 클래스 메서드 오버라이드하여 검색 처리 추가
  protected override initializeVirtualSelect(): void {
    const scrollEl = this.querySelector(`.${CSS_CLASSES.SCROLL}`) as HTMLDivElement;
    const optionData = this.getAllOptionData();

    // 다중선택에서 모든 항목이 선택된 경우 가상 스크롤 생성하지 않음
    if (this.multiple && optionData.length === 0) {
      return;
    }

    if (!this._virtual && scrollEl && !this._isLoading && optionData.length > 0) {
      this._virtual = this._createVirtualSelect(optionData, scrollEl);

      // 검색 텍스트가 있으면 필터 적용
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
    this._searchText = input.value;
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
      this._virtual.setData(this.getAllOptionData(), this.multiple ? undefined : this.getCurrentValue());
      this._noMatchVisible = false;
      return;
    }

    const allOptions: OptionItem[] = this.getAllOptionData();
    
    // 향상된 다국어 검색 적용
    const filtered = allOptions.filter(opt => {
      const label = (opt.label ?? '').toString();
      return isMultilingualMatch(rawInput, label);
    });

    if (filtered.length === 0) {
      this._virtual.setData(
        [{ value: 'no_match', label: searchTexts.noMatchText, disabled: true }],
        this.multiple ? undefined : this.getCurrentValue(),
      );
      return;
    }

    this._virtual.setData(filtered, this.multiple ? undefined : this.getCurrentValue());
  }

  // 부모 클래스의 removeTag 메서드를 오버라이드하여 검색 기능 추가 및 분리된 이벤트 사용
  public override removeTag = (e: Event, valueToRemove: string): void => {
    e.stopPropagation();
    this._selectedValues = this._selectedValues.filter(value => value !== valueToRemove);
    this.updateFormValue();

    const option = this._optionsCache.get(valueToRemove) || this._options.find(opt => opt.value === valueToRemove);

    if (this.open) {
      this._virtual?.destroy();
      this._virtual = null;

      // 선택 해제 후 옵션이 있으면 가상 스크롤 재생성
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

    // 분리된 이벤트 헬퍼 사용
    triggerDeselectEvent(this, option?.textContent || '', valueToRemove);

    this._debouncedUpdate();
  };

  // 부모 클래스의 resetToDefault 메서드를 오버라이드하여 검색 기능 추가 및 분리된 이벤트 사용
  public override resetToDefault = (e: Event): void => {
    e.stopPropagation();

    if (this.multiple) {
      this._selectedValues = [];
      this.updateFormValue();

      if (this.open) {
        this._virtual?.destroy();
        this._virtual = null;

        // 리셋 후 모든 옵션이 다시 사용 가능하므로 가상 스크롤 재생성
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

      // 분리된 이벤트 헬퍼 사용
      triggerResetEvent(this, { values: [], labels: [] });
    } else {
      if (this._options.length > 0) {
        const firstOption = this._options[0];
        this.value = firstOption.value;
        this._labelText = firstOption.textContent || '';

        // 드롭다운이 열려있는 경우 즉시 activeIndex와 focusedIndex를 첫 번째로 설정
        if (this.open && this._virtual) {
          requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
            // 가상 스크롤의 내부 상태도 첫 번째 옵션으로 설정
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

        // 분리된 이벤트 헬퍼 사용
        triggerResetEvent(this, { value: firstOption.value, label: firstOption.textContent || '' });
      }
    }
    
    this._debouncedUpdate();
  };

  // 드롭다운 열기 메서드 오버라이드 - 분리된 이벤트 사용
  public override openDropdown(): void {
    // 분리된 이벤트 헬퍼 사용
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

  // 옵션 선택 메서드 오버라이드 - 분리된 이벤트 사용
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

      // 분리된 이벤트 헬퍼 사용
      triggerSelectEvent(this, label, value);

    } else {
      this._labelText = label;
      this._setValue(value);
      this.closeDropdown();

      // 분리된 이벤트 헬퍼 사용
      triggerSelectEvent(this, label, value);
    }
  }

  // 값 설정 메서드 오버라이드 - 분리된 이벤트 사용
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
    
    // 분리된 이벤트 헬퍼 사용
    if (emit) triggerChangeEvent(this);
  }

  public override closeDropdown(): void {
    super.closeDropdown();
    this._searchText = '';
    this._noMatchVisible = false;
  }

  // 자동 너비 계산 오버라이드 - 검색 입력창 고려
  public override calculateAutoWidth(): void {
    // width가 명시적으로 설정되지 않은 경우에만 계산
    if (this.width || this._options.length === 0) {
      this._calculatedWidth = null;
      return;
    }

    // 모든 옵션 텍스트를 수집
    const optionTexts = this._options.map(opt => opt.textContent || '');
    
    // placeholder 텍스트와 검색 placeholder도 고려
    const texts = this.getLocalizedText();
    const searchTexts = this.getSearchLocalizedText();
    
    if (this.multiple) {
      optionTexts.push(texts.placeholder);
    }
    optionTexts.push(searchTexts.searchPlaceholder);

    // 현재 요소의 font 스타일을 가져와서 측정
    const computedStyle = window.getComputedStyle(this);
    const font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
    
    // 가장 긴 텍스트의 너비를 계산
    const maxTextWidth = this.getMaxOptionWidth(optionTexts, font);
    
    // 검색 컴포넌트는 추가 여백을 더 많이 필요로 함 (검색 아이콘 + reset 버튼 + 화살표 + 패딩)
    const additionalSpace = this.multiple ? 140 : 100; // 검색 기능으로 인해 더 넓게
    const totalWidth = maxTextWidth + additionalSpace;
    
    this._calculatedWidth = `${Math.max(totalWidth, 200)}px`; // 검색 컴포넌트는 최소 200px
  }

  // 부모 클래스의 언어 변경 메서드를 오버라이드하여 검색 관련 UI도 업데이트
  public override setLanguage(language: SupportedLanguage): void {
    super.setLanguage(language);
    // 검색 관련 UI 업데이트를 위해 강제 리렌더링
    this.requestUpdate();
  }

  // 검색 관련 커스텀 텍스트 설정 메서드
  public setSearchTexts(customSearchTexts: Partial<SearchLocalizedTexts>): void {
    this.searchTexts = { ...this.searchTexts, ...customSearchTexts };
    this.requestUpdate();
  }

  // 검색 관련 다국어 텍스트를 반환하는 정적 메서드
  static getSearchLocalizedTexts(): Record<SupportedLanguage, SearchLocalizedTexts> {
    return SEARCH_LOCALIZED_TEXTS;
  }

  // 검색 관련 기본 텍스트 구조를 반환하는 정적 메서드
  static getDefaultSearchTexts(): Record<SupportedLanguage, SearchLocalizedTexts> {
    return SEARCH_LOCALIZED_TEXTS;
  }

  // 디버깅을 위한 검색 테스트 메서드 (개발용)
  public testMultilingualSearch(searchText: string, targetText: string): boolean {
    return isMultilingualMatch(searchText, targetText);
  }
}

customElements.define('seo-select-search', SeoSelectSearch);