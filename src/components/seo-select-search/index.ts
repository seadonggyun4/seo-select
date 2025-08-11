import { html } from 'lit';
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

// 타입들을 types 디렉토리에서 import
import type {
  VirtualSelectOption,
  OptionItem,
  BatchUpdateOption,
  SupportedLanguage,
  SelectTheme,
  SearchLocalizedTexts
} from '../../types/index.js';

// 글로벌 타입 확장 - 검색 이벤트 추가
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
  public onSearchChange(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.SEARCH_CHANGE]) => void): void {
    this.addEventListener(EVENT_NAMES.SEARCH_CHANGE, handler as EventListener);
  }

  /**
   * 검색 결과 필터링 이벤트 리스너 추가 (검색 컴포넌트 전용)
   */
  public onSearchFilter(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.SEARCH_FILTER]) => void): void {
    this.addEventListener(EVENT_NAMES.SEARCH_FILTER, handler as EventListener);
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
      this._applyFilteredOptions();
    }
  }

  // 검색 컴포넌트의 높이 계산 오버라이드 - 수정된 버전
  public override calculateDropdownHeight(): string {
    const searchInputHeight = 50;
    
    // 로딩 중인 경우
    if (this._isLoading) {
      return `${80 + searchInputHeight}px`;
    }

    // 실제 표시될 옵션 수를 먼저 확인 (멀티셀렉트는 선택된 항목 제외)
    const availableOptions = this.getAllOptionData();
    
    // 멀티셀렉트에서 모든 옵션이 선택되어 표시할 옵션이 없는 경우
    if (this.multiple && availableOptions.length === 0) {
      return `${60 + searchInputHeight}px`; // no-data 컨테이너 + 검색 입력
    }
    
    // 옵션이 없는 경우 - 기본 SeoSelect와 일관성 있게 처리
    if (this._options.length === 0) {
      if (this.multiple) {
        // 멀티셀렉트에서 검색 텍스트가 있을 때만 no-data 영역 표시
        if (this._searchText.trim()) {
          return `${60 + searchInputHeight}px`; // no-data + 검색 입력
        }
        // 검색 텍스트가 없고 옵션도 없으면 최소 높이로 축소
        return `${searchInputHeight + 20}px`; // 검색 입력 + 최소 패딩
      }
      return 'auto';
    }

    // 옵션이 있는 경우 높이 계산
    const rowHeight = 36;
    const maxHeight = 360;
    const computedHeight = availableOptions.length * rowHeight;
    const finalHeight = availableOptions.length > 10 ? maxHeight : computedHeight;
    
    return `${finalHeight + searchInputHeight + 5}px`;
  }

  private getSearchIcon() {
    return ICONS.SEARCH();
  }

  // 검색 기능이 있는 드롭다운 렌더링 - 수정된 버전
  private renderSearchDropdown() {
    const availableOptions = this.getAllOptionData();
    const hasOptions = availableOptions.length > 0;
    
    // 멀티셀렉트에서 모든 옵션이 선택되었거나 검색 결과가 없을 때 no-data 표시
    const showNoData = this.multiple && !this._isLoading && (
      (availableOptions.length === 0) || // 모든 옵션이 선택됨
      (!hasOptions && this._searchText.trim()) // 검색 결과 없음
    );
    
    const effectiveWidth = this.getEffectiveWidth();
    const effectiveHeight = this.getEffectiveHeight();

    const searchTexts = this.getSearchLocalizedText();

    return html`
      <div class="${CSS_CLASSES.LISTBOX} ${this.open ? '' : CSS_CLASSES.HIDDEN}" 
           style="width: ${effectiveWidth}; height: ${effectiveHeight};">
        <div class="${CSS_CLASSES.SEARCH_INPUT}">
          <span class="${CSS_CLASSES.SEARCH_ICON}" aria-hidden="true">${this.getSearchIcon()}</span>
          <input
            type="text"
            placeholder="${searchTexts.searchPlaceholder}"
            .value=${this._searchText}
            @input=${this._handleSearchInput}
          />
        </div>
        <div class="${CSS_CLASSES.SCROLL}" role="listbox" style="height: calc(${effectiveHeight} - 50px);">
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

    // 높이 재계산
    this._calculatedHeight = this.calculateDropdownHeight();

    // 멀티셀렉트에서 표시할 옵션이 없으면 가상 스크롤을 생성하지 않음
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

  // null을 undefined로 변환하는 헬퍼 함수
  private getCurrentValue(): string | undefined {
    return this.value ?? undefined;
  }

  // 향상된 다국어 검색 필터 적용 - searchTexts.noMatchText 사용
  private _applyFilteredOptions(): void {
    if (!this._virtual) return;

    const searchTexts = this.getSearchLocalizedText();
    const rawInput = this._searchText.trim();
    
    if (!rawInput) {
      const allOptions = this.getAllOptionData();
      
      // 멀티셀렉트에서 모든 옵션이 선택되어 표시할 옵션이 없는 경우
      if (this.multiple && allOptions.length === 0) {
        // 검색 텍스트에서 noMatchText 사용 (모든 옵션 선택 상태)
        const noDataOption = [{ value: 'all_selected', label: searchTexts.noMatchText, disabled: true }];
        this._virtual.setData(noDataOption, undefined);
        this._calculatedHeight = this.calculateDropdownHeight();
        triggerSearchFilterEvent(this, [], rawInput, false);
        this._debouncedUpdate();
        return;
      }
      
      this._virtual.setData(allOptions, this.multiple ? undefined : this.getCurrentValue());
      this._noMatchVisible = false;

      // 높이 재계산 - 검색 텍스트가 없을 때 정확한 높이 계산
      this._calculatedHeight = this.calculateDropdownHeight();
      triggerSearchFilterEvent(this, allOptions, rawInput, true);
      this._debouncedUpdate();
      return;
    }

    const allOptions: OptionItem[] = this.getAllOptionData();
    
    // 모든 옵션이 선택되어 검색할 옵션이 없는 경우
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
      
      // no-match 상태 높이
      this._calculatedHeight = `${60 + 50 + 5}px`;
      triggerSearchFilterEvent(this, [], rawInput, false);
      this._debouncedUpdate();
      return;
    }

    this._virtual.setData(filtered, this.multiple ? undefined : this.getCurrentValue());
    
    // 필터링된 결과에 따른 정확한 높이 계산
    const rowHeight = 36;
    const maxHeight = 360;
    const searchInputHeight = 50;
    const computedHeight = filtered.length * rowHeight;
    const finalHeight = filtered.length > 10 ? maxHeight : computedHeight;
    this._calculatedHeight = `${finalHeight + searchInputHeight + 5}px`;

    triggerSearchFilterEvent(this, filtered, rawInput, true);
    this._debouncedUpdate();
  }

  // removeTag 메서드 수정 - 높이 재계산 강화
  public override removeTag = (e: Event, valueToRemove: string): void => {
    e.stopPropagation();
    this._selectedValues = this._selectedValues.filter(value => value !== valueToRemove);
    this.updateFormValue();

    const option = this._optionsCache.get(valueToRemove) || this._options.find(opt => opt.value === valueToRemove);

    if (this.open) {
      this._virtual?.destroy();
      this._virtual = null;

      const optionData = this.getAllOptionData();
      const scrollEl = this.querySelector(`.${CSS_CLASSES.SCROLL}`) as HTMLDivElement;
      
      if (scrollEl) {
        if (optionData.length > 0) {
          this._virtual = this._createVirtualSelect(optionData, scrollEl);
          
          // 검색 필터 재적용 (검색 텍스트가 있는 경우)
          if (this._searchText.trim()) {
            this._applyFilteredOptions();
          } else {
            // 검색 텍스트가 없으면 바로 높이 재계산
            this._calculatedHeight = this.calculateDropdownHeight();
          }
          
          requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
          });
        } else {
          // 모든 옵션이 선택되어 표시할 옵션이 없을 때도 높이 재계산하고 no-data 표시
          this._calculatedHeight = this.calculateDropdownHeight();
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
        
        // 높이 재계산
        this._calculatedHeight = this.calculateDropdownHeight();
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
      this._calculatedHeight = this.calculateDropdownHeight(); // 로딩 상태 높이
      this._debouncedUpdate();

      this.loadOptionsAsync().then(() => {
        this._calculatedHeight = this.calculateDropdownHeight(); // 로딩 완료 후 높이 재계산
        this.initializeVirtualSelect();
      }).catch(() => {
        this._isLoading = false;
        this._calculatedHeight = this.calculateDropdownHeight();
        this._debouncedUpdate();
      });
    } else {
      // 기존 가상 스크롤이 있으면 제거
      if (this._virtual) {
        this._virtual.destroy();
        this._virtual = null;
      }
      
      // 높이 재계산
      this._calculatedHeight = this.calculateDropdownHeight();
      
      // 새로운 가상 스크롤 초기화
      this.initializeVirtualSelect();
    }
  }

  // selectOption 메서드 수정 - 높이 재계산 강화
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
          
          // 검색 필터 재적용 (검색 텍스트가 있는 경우)
          if (this._searchText.trim()) {
            this._applyFilteredOptions();
          } else {
            // 검색 텍스트가 없으면 바로 높이 재계산
            this._calculatedHeight = this.calculateDropdownHeight();
          }
          
          requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
          });
        } else {
          // 선택 가능한 옵션이 모두 선택되어 없을 때 높이 재계산
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
    this.open = false;
    
    // 가상 스크롤 정리
    if (this._virtual) {
      this._virtual.destroy();
      this._virtual = null;
    }
    
    // 검색 상태 초기화
    this._searchText = '';
    this._noMatchVisible = false;
    
    // 높이 캐시 클리어
    this._calculatedHeight = null;
    
    this._debouncedUpdate();
  }

  // 검색 텍스트 클리어 시 높이 업데이트
  public clearSearchText(): void {
    this._searchText = '';
    this._calculatedHeight = this.calculateDropdownHeight();
    this._applyFilteredOptions();
    this.requestUpdate();
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

  public getSearchText(): string {
    return this._searchText;
  }

  private _emitSearchChange(prev: string, next: string) {
    // exactOptionalPropertyTypes 대응: prev가 빈 문자열이면 생략
    triggerSearchChangeEvent(this, next, prev === '' ? undefined : prev);
  }

  public setSearchText(searchText: string): void {
    const prev = this._searchText ?? '';
    const next = (searchText ?? '').toString();
    if (prev === next) return;

    this._searchText = next;
    this._applyFilteredOptions();   // 여기서 onSearchFilter도 발생하도록 유지
    this.requestUpdate?.();

    this._emitSearchChange(prev, next);
  }

  get searchText(): string {
    return this._searchText;
  }

  set searchText(v: string) {
    this.setSearchText(v);
  }

  /**
   * 가상 스크롤 데이터를 검색 필터와 함께 즉시 업데이트하는 헬퍼 메서드 - searchTexts.noMatchText 사용
   */
  private _updateVirtualScrollDataWithSearch(): void {
    if (!this._virtual) return;

    const optionData = this.getAllOptionData();
    
    if (optionData.length > 0) {
      const activeValue = this.multiple ? undefined : this._value || undefined;
      this._virtual.setData(optionData, activeValue);
      
      // 검색 텍스트가 있으면 필터 적용
      if (this._searchText) {
        requestAnimationFrame(() => {
          this._applyFilteredOptions();
        });
      } else {
        // 활성 인덱스 설정
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
      // 옵션이 없으면 no-data 표시
      if (this.multiple) {
        const searchTexts = this.getSearchLocalizedText(); // 검색 텍스트에서 noMatchText 사용
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
      // 기존 선택값 백업
      let previousValue: string | null = null;
      let previousSelectedValues: string[] = [];
      
      if (preserveSelection) {
        if (this.multiple) {
          previousSelectedValues = [...this._selectedValues];
        } else {
          previousValue = this._value;
        }
      }

      // 기존 옵션들 정리
      this._options.forEach(opt => opt.remove());
      this._options = [];
      this._optionsCache.clear();
      this._widthCalculationCache.clear();

      // 새로운 옵션들 생성
      if (Array.isArray(options) && options.length > 0) {
        const fragment = document.createDocumentFragment();
        
        this._options = options.map(opt => {
          const el = document.createElement('option');
          el.value = opt.value;
          el.textContent = opt.label;
          el.hidden = true;
          this._optionsCache.set(opt.value, el);
          fragment.appendChild(el);
          return el;
        });
        
        this.appendChild(fragment);
        this._isLoading = false;
      } else {
        this._isLoading = true;
      }

      // 선택값 복원 또는 초기화
      if (preserveSelection && options.length > 0) {
        if (this.multiple) {
          const validValues = previousSelectedValues.filter(value => 
            this._options.some(opt => opt.value === value)
          );
          this._selectedValues = validValues;
          this.updateFormValue();
        } else {
          if (previousValue && this._options.some(opt => opt.value === previousValue)) {
            this._setValue(previousValue, false);
          } else if (this._options.length > 0) {
            this._setValue(this._options[0].value, false);
          }
        }
      } else {
        if (this.multiple) {
          this._selectedValues = [];
          this.updateFormValue();
        } else if (this._options.length > 0) {
          this._setValue(this._options[0].value, false);
        }
      }

      // 검색 텍스트 초기화 (옵션이 완전히 변경된 경우)
      if (!preserveSelection) {
        this._searchText = '';
      }

      // 높이 재계산
      this._calculatedHeight = this.calculateDropdownHeight();

      // 검색 기능과 함께 가상 스크롤 즉시 업데이트
      this._updateVirtualScrollDataWithSearch();

      // 초기값 설정
      if (this._options.length > 0) {
        this._initialValue = this._options[0].value;
        this._initialLabel = this._options[0].textContent || '';
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
    
    if (this._options.some(opt => opt.value === option.value)) {
      console.warn(`Option with value "${option.value}" already exists`);
      return;
    }

    this._isUpdating = true;

    try {
      // 새 옵션 요소 생성
      const el = document.createElement('option');
      el.value = option.value;
      el.textContent = option.label;
      el.hidden = true;
      this._optionsCache.set(option.value, el);

      // 지정된 위치에 삽입
      const insertIndex = index !== undefined ? Math.max(0, Math.min(index, this._options.length)) : this._options.length;
      
      if (insertIndex >= this._options.length) {
        this._options.push(el);
        this.appendChild(el);
      } else {
        const nextOption = this._options[insertIndex];
        this._options.splice(insertIndex, 0, el);
        this.insertBefore(el, nextOption);
      }

      this._widthCalculationCache.clear();
      this._isLoading = false;

      // 높이 재계산
      this._calculatedHeight = this.calculateDropdownHeight();

      // 검색 기능과 함께 가상 스크롤 즉시 업데이트
      this._updateVirtualScrollDataWithSearch();

      // 첫 번째 옵션이면 초기값 설정
      if (this._options.length === 1) {
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
    
    const optionIndex = this._options.findIndex(opt => opt.value === value);
    if (optionIndex === -1) return;

    this._isUpdating = true;

    try {
      // 옵션 제거
      const removedOption = this._options[optionIndex];
      removedOption.remove();
      this._options.splice(optionIndex, 1);
      this._optionsCache.delete(value);
      this._widthCalculationCache.clear();

      // 선택된 값에서도 제거
      if (this.multiple) {
        const selectedIndex = this._selectedValues.indexOf(value);
        if (selectedIndex > -1) {
          this._selectedValues.splice(selectedIndex, 1);
          this.updateFormValue();
          triggerDeselectEvent(this, removedOption.textContent || '', value);
        }
      } else {
        if (this._value === value) {
          if (this._options.length > 0) {
            this._setValue(this._options[0].value, true);
          } else {
            this._setValue('', true);
            this._labelText = ''; // 라벨 초기화 추가
          }
        }
      }

      // 높이 재계산
      this._calculatedHeight = this.calculateDropdownHeight();

      // 검색 기능과 함께 가상 스크롤 즉시 업데이트
      this._updateVirtualScrollDataWithSearch();

      // 초기값 업데이트
      if (this._options.length > 0) {
        this._initialValue = this._options[0].value;
        this._initialLabel = this._options[0].textContent || '';
      } else {
        this._initialValue = null;
        this._initialLabel = null;
        this._isLoading = true;
        // 옵션이 없을 때 라벨 초기화
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
      // 모든 옵션 제거
      this._options.forEach(opt => opt.remove());
      this._options = [];
      this._optionsCache.clear();
      this._widthCalculationCache.clear();

      // 선택값 초기화
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
        this._labelText = ''; // 라벨 초기화 추가 (중요!)
        
        if (previousValue) {
          triggerResetEvent(this, { value: '', label: '' });
        }
      }

      // 검색 텍스트 초기화
      this._searchText = '';
      this._noMatchVisible = false;

      // 높이를 auto로 설정
      this._calculatedHeight = 'auto';

      // 가상 스크롤 즉시 클리어
      if (this._virtual) {
        this._virtual.clearData();
      }

      // 초기값 클리어
      this._initialValue = null;
      this._initialLabel = null;
      this._isLoading = true;
      this._calculatedWidth = null;

    } finally {
      this._isUpdating = false;
      this._debouncedUpdate();
    }
  }

  /**
   * 검색 텍스트와 함께 옵션 데이터 일괄 업데이트
   */
  public override batchUpdateOptions(updates: Array<BatchUpdateOption>): void {
    if (this._isUpdating) return;
    this._isUpdating = true;
    let hasChanges = false;

    try {
      updates.forEach(update => {
        switch (update.action) {
          case 'add':
            if (update.option && !this._options.some(opt => opt.value === update.option!.value)) {
              const el = document.createElement('option');
              el.value = update.option.value;
              el.textContent = update.option.label;
              el.hidden = true;
              this._optionsCache.set(update.option.value, el);

              const insertIndex = update.index !== undefined ? 
                Math.max(0, Math.min(update.index, this._options.length)) : 
                this._options.length;

              if (insertIndex >= this._options.length) {
                this._options.push(el);
                this.appendChild(el);
              } else {
                const nextOption = this._options[insertIndex];
                this._options.splice(insertIndex, 0, el);
                this.insertBefore(el, nextOption);
              }
              hasChanges = true;
            }
            break;

          case 'remove':
            if (update.value) {
              const optionIndex = this._options.findIndex(opt => opt.value === update.value);
              if (optionIndex !== -1) {
                const removedOption = this._options[optionIndex];
                removedOption.remove();
                this._options.splice(optionIndex, 1);
                this._optionsCache.delete(update.value);

                // 선택된 값에서도 제거
                if (this.multiple) {
                  const selectedIndex = this._selectedValues.indexOf(update.value);
                  if (selectedIndex > -1) {
                    this._selectedValues.splice(selectedIndex, 1);
                  }
                } else {
                  if (this._value === update.value) {
                    if (this._options.length > 0) {
                      this._setValue(this._options[0].value, false);
                    } else {
                      this._setValue('', false);
                      this._labelText = ''; // 라벨 초기화 추가
                    }
                  }
                }
                hasChanges = true;
              }
            }
            break;

          case 'update':
            if (update.option && update.value) {
              const existingOption = this._options.find(opt => opt.value === update.value);
              if (existingOption) {
                existingOption.textContent = update.option.label;
                this._optionsCache.set(update.value, existingOption);
                // 현재 선택된 값의 라벨도 업데이트
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
        this._isLoading = this._options.length === 0;

        // 높이 재계산
        this._calculatedHeight = this.calculateDropdownHeight();

        // 드롭다운이 열려있는 경우 검색 기능과 함께 가상 스크롤 한 번만 업데이트
        if (this.open) {
          this._updateVirtualScrollDataWithSearch();
        }

        // 초기값 업데이트
        if (this._options.length > 0) {
          this._initialValue = this._options[0].value;
          this._initialLabel = this._options[0].textContent || '';
        } else {
          this._initialValue = null;
          this._initialLabel = null;
          // 옵션이 없을 때 라벨 초기화
          if (!this.multiple) {
            this._labelText = '';
          }
        }

        // 폼 값 업데이트
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

  /**
   * 검색 상태를 유지하면서 옵션 업데이트
   * @param options - 새 옵션 배열
   * @param preserveSearch - 검색 텍스트 유지 여부 (기본값: true)
   */
  public updateOptionsWithSearch(options: VirtualSelectOption[], preserveSearch: boolean = true): void {
    const currentSearchText = preserveSearch ? this._searchText : '';
    
    // 기본 addOptions 실행
    this.addOptions(options, true);
    
    // 검색 텍스트 복원 및 필터 적용
    if (preserveSearch && currentSearchText) {
      this._searchText = currentSearchText;
      this._updateVirtualScrollDataWithSearch();
    }
  }

  /**
   * 검색 결과에 따른 동적 옵션 로딩
   * @param searchText - 검색 텍스트
   * @param optionLoader - 옵션을 로드하는 비동기 함수
   */
  public async loadOptionsForSearch(
    searchText: string, 
    optionLoader: (search: string) => Promise<VirtualSelectOption[]>
  ): Promise<void> {
    this._isLoading = true;
    this._searchText = searchText;
    this._calculatedHeight = this.calculateDropdownHeight(); // 로딩 상태 높이
    this._debouncedUpdate();

    try {
      const newOptions = await optionLoader(searchText);
      this.addOptions(newOptions, false);
      
      // 검색 텍스트 설정 및 필터 적용
      this._searchText = searchText;
      if (this._virtual && this.open) {
        this._applyFilteredOptions();
      }
    } catch (error) {
      console.error('Failed to load options for search:', error);
      this._isLoading = false;
      this._calculatedHeight = this.calculateDropdownHeight();
      this._debouncedUpdate();
    }
  }
}

if (!customElements.get('seo-select-search')) {
  customElements.define('seo-select-search', SeoSelectSearch);
}