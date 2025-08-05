import { LitElement, html } from 'lit';
import { InteractiveVirtualSelect } from '../../core/InteractiveVirtualSelect.js';
import '../../styles/components/style.scss';
import {
  SupportedLanguage,
  SelectTheme,
  LocalizedTexts,
  LOCALIZED_TEXTS,
  SUPPORTED_LANGUAGES,
  DEFAULT_CONFIG,
  EVENT_NAMES,
  CSS_CLASSES,
  TIMING,
  ICONS
} from '../../constants/constants.js';
import {
  triggerSelectEvent,
  triggerDeselectEvent,
  triggerResetEvent,
  triggerChangeEvent,
  triggerOpenEvent,
  SeoSelectEventListener
} from '../../event/index.js';

export interface VirtualSelectOption {
  value: string;
  label: string;
}

// 글로벌 타입 확장 - HTMLElementEventMap에 커스텀 이벤트 추가
declare global {
  interface HTMLElementEventMap {
    [EVENT_NAMES.SELECT]: import('../../event/SeoSelectEvent.js').SeoSelectEvent;
    [EVENT_NAMES.DESELECT]: import('../../event/SeoSelectEvent.js').SeoDeselectEvent;
    [EVENT_NAMES.RESET]: import('../../event/SeoSelectEvent.js').SeoResetEvent;
    [EVENT_NAMES.CHANGE]: import('../../event/SeoSelectEvent.js').SeoChangeEvent;
    [EVENT_NAMES.SELECT_OPEN]: import('../../event/SeoSelectEvent.js').SeoOpenEvent;
  }
}

export class SeoSelect extends LitElement {
  static formAssociated = true;

  static get properties() {
    return {
      id: { type: String },
      name: { type: String },
      required: { type: Boolean, reflect: true },
      width: { type: String },
      height: { type: String },
      optionItems: { 
        type: Array,
        hasChanged: (newVal: VirtualSelectOption[], oldVal: VirtualSelectOption[]) => {
          // 깊은 비교를 통한 실제 변경 감지
          return JSON.stringify(newVal) !== JSON.stringify(oldVal);
        }
      },
      open: { type: Boolean, state: true },
      _labelText: { type: String, state: true },
      showReset: { type: Boolean },
      multiple: { type: Boolean },
      _selectedValues: { type: Array, state: true },
      _isLoading: { type: Boolean, state: true },
      theme: { type: String },
      dark: { type: Boolean },
      language: { type: String },
      texts: { type: Object },
      autoWidth: { type: Boolean },
    };
  }

  declare id: string;
  declare name: string;
  declare required: boolean;
  declare width: string | null;
  declare height: string;
  declare showReset: boolean;
  declare multiple: boolean;
  declare theme: SelectTheme;
  declare dark: boolean;
  declare language: SupportedLanguage;
  declare texts: Partial<LocalizedTexts>;
  declare autoWidth: boolean;

  declare open: boolean;
  declare _labelText: string;
  declare _selectedValues: string[];
  declare _isLoading: boolean;

  declare _value: string | null;
  declare _initialValue: string | null;
  declare _initialLabel: string | null;
  declare _virtual: InteractiveVirtualSelect | null;
  declare _options: HTMLOptionElement[];
  declare _internals: ElementInternals;
  declare _pendingActiveIndex: number | null;
  declare _calculatedWidth: string | null;

  // 최적화를 위한 캐시 및 플래그
  public _optionsCache: Map<string, HTMLOptionElement> = new Map();
  private _localizedTextCache: LocalizedTexts | null = null;
  private _lastLanguage: string = '';
  private _lastTextsHash: string = '';
  private _widthCalculationCache: Map<string, number> = new Map();
  private _isUpdating: boolean = false;
  private _updateDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  // Reactive optionItems 관련 속성들
  private _lastOptionItemsSnapshot: string = '';
  private _optionItemsProxy: VirtualSelectOption[] = [];
  private _isProcessingOptionChange: boolean = false;

  private _handleKeydownBound: (e: KeyboardEvent) => void;

  constructor() {
    super();
    this._internals = this.attachInternals();
    this._value = null;
    this._initialValue = null;
    this._initialLabel = null;
    this._virtual = null;
    this._options = [];
    this.width = null;
    this.required = DEFAULT_CONFIG.required;
    this.showReset = DEFAULT_CONFIG.showReset;
    this.multiple = DEFAULT_CONFIG.multiple;
    this._selectedValues = [];
    this._isLoading = false;
    this.theme = DEFAULT_CONFIG.theme;
    this.dark = DEFAULT_CONFIG.dark;
    this.language = DEFAULT_CONFIG.language;
    this.texts = {};
    this.autoWidth = false;
    this._calculatedWidth = null;
    this._handleKeydownBound = (e: KeyboardEvent) => this._virtual?.handleKeydown(e);
    this.tabIndex = 0;
    this._pendingActiveIndex = null;
    
    this.open = false;
    this._labelText = '';
    
    // optionItems를 빈 배열로 초기화하고 Proxy 설정
    this._optionItemsProxy = [];
    this._setupReactiveOptionItems();
  }

  // optionItems를 반응형으로 만드는 Proxy 설정
  private _setupReactiveOptionItems(): void {
    const arrayMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
    const self = this; // this 참조를 캡처
    
    this._optionItemsProxy = new Proxy(this._optionItemsProxy || [], {
      set: (target: VirtualSelectOption[], property: string | symbol, value: any): boolean => {
        const result = Reflect.set(target, property, value);
        
        // 배열 인덱스나 length 변경 시 업데이트
        if (typeof property === 'string' && 
            (property === 'length' || /^\d+$/.test(property))) {
          self._scheduleOptionItemsUpdate();
        }
        
        return result;
      },
      
      get: (target: VirtualSelectOption[], property: string | symbol): any => {
        const value = Reflect.get(target, property);
        
        // 배열 변경 메서드들을 감지
        if (arrayMethods.includes(property as string)) {
          return function(this: VirtualSelectOption[], ...args: any[]): any {
            const result = (value as Function).apply(this, args);
            self._scheduleOptionItemsUpdate();
            return result;
          };
        }
        
        return value;
      }
    });
  }

  // optionItems 변경 스케줄링 (디바운싱)
  private _scheduleOptionItemsUpdate(): void {
    if (this._isProcessingOptionChange) return;
    
    // 마이크로태스크로 다음 틱에 실행
    Promise.resolve().then(() => {
      if (!this._isProcessingOptionChange) {
        this._handleOptionItemsReactiveChange();
      }
    });
  }

  // optionItems 반응형 변경 처리
  protected _handleOptionItemsReactiveChange(): void {
    if (this._isProcessingOptionChange) return;
    
    const currentSnapshot = JSON.stringify(this._optionItemsProxy);
    if (this._lastOptionItemsSnapshot === currentSnapshot) return;
    
    this._isProcessingOptionChange = true;
    
    try {
      // 기존 선택값 보존을 위한 백업
      const previousSelectedValues = this.multiple ? [...this._selectedValues] : [this._value];
      
      // 옵션 재구성
      this._rebuildOptionsFromItems();
      
      // 유효한 선택값들만 복원
      this._restoreValidSelections(previousSelectedValues);
      
      // 가상 스크롤 업데이트
      if (this._virtual && this.open) {
        this._updateVirtualScrollData();
      }
      
      // 상태 업데이트
      this._lastOptionItemsSnapshot = currentSnapshot;
      this._debouncedUpdate();
      
    } finally {
      this._isProcessingOptionChange = false;
    }
  }

  // optionItems에서 실제 DOM 옵션들 재구성
  private _rebuildOptionsFromItems(): void {
    // 기존 옵션들 정리
    this._options.forEach(opt => opt.remove());
    this._options = [];
    this._optionsCache.clear();
    this._widthCalculationCache.clear();

    if (!Array.isArray(this._optionItemsProxy) || this._optionItemsProxy.length === 0) {
      this._isLoading = true;
      // 옵션이 없을 때 labelText도 초기화
      if (!this.multiple) {
        this._labelText = '';
      }
      return;
    }

    // DocumentFragment로 DOM 조작 최적화
    const fragment = document.createDocumentFragment();
    
    this._options = this._optionItemsProxy.map(item => {
      const optionEl = document.createElement('option');
      optionEl.value = item.value;
      optionEl.textContent = item.label;
      optionEl.hidden = true;
      
      this._optionsCache.set(item.value, optionEl);
      fragment.appendChild(optionEl);
      
      return optionEl;
    });

    // 한 번에 DOM에 추가
    this.appendChild(fragment);
    this._isLoading = false;

    // 단일 선택 모드에서 labelText 설정
    if (!this.multiple) {
      if (this._value) {
        // 현재 값이 있으면 해당 옵션의 라벨 설정
        const matchedOption = this._optionsCache.get(this._value);
        if (matchedOption) {
          this._labelText = matchedOption.textContent || '';
        } else if (this._options.length > 0) {
          // 현재 값이 유효하지 않으면 첫 번째 옵션으로 설정
          const firstOption = this._options[0];
          this._value = firstOption.value;
          this._labelText = firstOption.textContent || '';
        }
      } else if (this._options.length > 0) {
        // 값이 없으면 첫 번째 옵션으로 초기화
        const firstOption = this._options[0];
        this._value = firstOption.value;
        this._labelText = firstOption.textContent || '';
      } else {
        // 옵션이 없으면 빈 값으로 설정
        this._labelText = '';
      }
    }

    // 너비 재계산
    this.calculateAutoWidth();
  }

  // 유효한 선택값들 복원
  private _restoreValidSelections(previousSelectedValues: (string | null)[]): void {
    const validValues = this._options.map(opt => opt.value);
    
    if (this.multiple) {
      // 다중 선택: 여전히 유효한 값들만 유지
      this._selectedValues = this._selectedValues.filter(value => 
        validValues.includes(value)
      );
      this.updateFormValue();
    } else {
      // 단일 선택: 현재 값이 유효하지 않으면 첫 번째 옵션으로 변경
      if (this._value && !validValues.includes(this._value)) {
        if (this._options.length > 0) {
          this._setValue(this._options[0].value, false);
        } else {
          this._setValue('', false);
        }
      }
    }
  }

  // 가상 스크롤 데이터 업데이트
  private _updateVirtualScrollData(): void {
    const optionData = this.getAllOptionData();
    if (optionData.length > 0) {
      this._virtual?.setData(optionData, this.multiple ? undefined : this._value || undefined);
    } else {
      this._virtual?.clearData();
    }
  }

  // optionItems setter/getter
  set optionItems(newItems: VirtualSelectOption[]) {
    this._optionItemsProxy = newItems || [];
    this._setupReactiveOptionItems();
    this.requestUpdate('optionItems');
  }

  get optionItems(): VirtualSelectOption[] {
    return this._optionItemsProxy || [];
  }

  /**
   * @deprecated 표준 addEventListener를 사용하세요
   */
  public addSeoSelectEventListener<T extends keyof HTMLElementEventMap>(
    type: T,
    listener: SeoSelectEventListener<T>,
    options?: AddEventListenerOptions
  ): void {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`addSeoSelectEventListener is deprecated. Use standard addEventListener instead:
Before: select.addSeoSelectEventListener('${type}', handler);
After:  select.addEventListener('${type}', handler);`);
    }
    this.addEventListener(type, listener as EventListener, options);
  }

  /**
   * @deprecated 표준 removeEventListener를 사용하세요
   */
  public removeSeoSelectEventListener<T extends keyof HTMLElementEventMap>(
    type: T,
    listener: SeoSelectEventListener<T>,
    options?: EventListenerOptions
  ): void {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`removeSeoSelectEventListener is deprecated. Use standard removeEventListener instead:
Before: select.removeSeoSelectEventListener('${type}', handler);
After:  select.removeEventListener('${type}', handler);`);
    }
    this.removeEventListener(type, listener as EventListener, options);
  }

  // 최적화된 getLocalizedText - 캐싱 적용
  public getLocalizedText(): LocalizedTexts {
    const textsHash = JSON.stringify(this.texts);
    
    if (this._localizedTextCache && 
        this._lastLanguage === this.language && 
        this._lastTextsHash === textsHash) {
      return this._localizedTextCache;
    }

    const baseTexts = LOCALIZED_TEXTS[this.language] || LOCALIZED_TEXTS.en;
    this._localizedTextCache = {
      ...baseTexts,
      ...this.texts
    };
    this._lastLanguage = this.language;
    this._lastTextsHash = textsHash;

    return this._localizedTextCache;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback(): void {
    this.style.width = this.width !== '100%' ? '' : '100%';
    super.connectedCallback();
    this.initializeOptionsFromPropsOrSlot();
    window.addEventListener(EVENT_NAMES.SELECT_OPEN, this.onOtherSelectOpened);
    window.addEventListener('click', this.handleOutsideClick, true);
    this.addEventListener('keydown', this._handleKeydownBound);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener(EVENT_NAMES.SELECT_OPEN, this.onOtherSelectOpened);
    window.removeEventListener('click', this.handleOutsideClick);
    this.removeEventListener('keydown', this._handleKeydownBound);
    this._virtual?.destroy();
    this._virtual = null;

    // 캐시 정리
    this._optionsCache.clear();
    this._widthCalculationCache.clear();
    this._localizedTextCache = null;

    if (this._updateDebounceTimer) {
      clearTimeout(this._updateDebounceTimer);
    }

    if (this.multiple) {
      this._selectedValues = [];
    } else {
      this.value = '';
    }
  }

  // 디바운스된 업데이트 메서드
  public _debouncedUpdate(): void {
    if (this._updateDebounceTimer) {
      clearTimeout(this._updateDebounceTimer);
    }
    
    this._updateDebounceTimer = setTimeout(() => {
      this.requestUpdate();
      this._updateDebounceTimer = null;
    }, 16) as ReturnType<typeof setTimeout>; // ~60fps
  }

  updated(changed: Map<string, unknown>) {
    if (this._isUpdating) return;
    this.style.width = this.width !== '100%' ? '' : '100%';
    
    // optionItems가 직접 설정된 경우 (속성으로)
    if (changed.has('optionItems')) {
      this._handleOptionItemsDirectChange();
    }
    
    const needsOptionsUpdate = changed.has('language') || changed.has('texts');
    const needsWidthUpdate = changed.has('width') || 
                            changed.has('optionItems') || 
                            changed.has('_options');

    if (needsOptionsUpdate) {
      this.initializeOptionsFromPropsOrSlot();
    }
    
    if (needsWidthUpdate) {
      this.calculateAutoWidth();
    }
  }

  // optionItems 직접 변경 처리 (속성 설정)
  private _handleOptionItemsDirectChange(): void {
    const currentSnapshot = JSON.stringify(this._optionItemsProxy);
    if (this._lastOptionItemsSnapshot === currentSnapshot) return;
    
    // Proxy 재설정
    this._setupReactiveOptionItems();
    
    // 반응형 변경 처리
    this._handleOptionItemsReactiveChange();
  }

  // 최적화된 자동 너비 계산 - 캐싱 및 배치 처리
  public calculateAutoWidth(): void {
    if (this.width || this._options.length === 0) {
      this._calculatedWidth = null;
      return;
    }

    // 캐시 키 생성
    const optionTexts = this._options.map(opt => opt.textContent || '');
    const cacheKey = optionTexts.join('|') + `|${this.multiple}`;
    
    if (this._widthCalculationCache.has(cacheKey)) {
      const cachedWidth = this._widthCalculationCache.get(cacheKey)!;
      this._calculatedWidth = `${cachedWidth}px`;
      return;
    }

    // requestAnimationFrame으로 배치 처리
    requestAnimationFrame(() => {
      const texts = this.getLocalizedText();
      const textsToMeasure = [...optionTexts];
      
      if (this.multiple) {
        textsToMeasure.push(texts.placeholder);
      }

      const computedStyle = window.getComputedStyle(this);
      const font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
      
      const maxTextWidth = this.getMaxOptionWidth(textsToMeasure, font);
      const additionalSpace = this.multiple ? 120 : 80;
      const totalWidth = Math.max(maxTextWidth + additionalSpace, 150);
      
      // 캐시에 저장
      this._widthCalculationCache.set(cacheKey, totalWidth);
      this._calculatedWidth = `${totalWidth}px`;
      
      // 필요한 경우에만 업데이트
      if (this.isConnected) {
        this._debouncedUpdate();
      }
    });
  }

  public getEffectiveWidth(): string {
    if (this.width) {
      return this.width;
    }
    if (!this.width && this._calculatedWidth) {
      return this._calculatedWidth;
    }
    return 'auto';
  }

  protected getCloseIcon() {
    return ICONS.CLOSE();
  }

  protected getChevronDownIcon() {
    return ICONS.CHEVRON_DOWN();
  }

  protected getChevronUpIcon() {
    return ICONS.CHEVRON_UP();
  }

  protected renderLoadingSpinner() {
    const texts = this.getLocalizedText();
    return html`
      <div class="${CSS_CLASSES.LOADING_CONTAINER}">
        <div class="${CSS_CLASSES.LOADING_DOTS}">
          <div class="${CSS_CLASSES.DOT}"></div>
          <div class="${CSS_CLASSES.DOT}"></div>
          <div class="${CSS_CLASSES.DOT}"></div>
        </div>  
        <span class="${CSS_CLASSES.LOADING_TEXT}">${texts.loadingText}</span>
      </div>
    `;
  }

  protected renderNoData() {
    const texts = this.getLocalizedText();
    return html`
      <div class="${CSS_CLASSES.NO_DATA_CONTAINER}">
        <span class="${CSS_CLASSES.NO_DATA_TEXT}">${texts.noDataText}</span>
      </div>
    `;
  }

  protected renderDropdown() {
    const hasOptions = this.getAllOptionData().length > 0;
    const showNoData = this.multiple && !this._isLoading && !hasOptions;
    const effectiveWidth = this.getEffectiveWidth();
    return html`
      <div class="${CSS_CLASSES.LISTBOX} ${CSS_CLASSES.SCROLL} ${this.open ? '' : CSS_CLASSES.HIDDEN}" role="listbox" style="width: ${effectiveWidth};">
        ${this._isLoading
          ? this.renderLoadingSpinner()
          : showNoData
            ? this.renderNoData()
            : ''
        }
      </div>
    `;
  }

  protected getThemeClass(): string {
    const themeClass = `theme-${this.theme}`;
    const darkClass = this.dark ? 'dark' : '';
    return `${themeClass} ${darkClass}`.trim();
  }

  render() {
    if (this.multiple) {
      return this.renderMultiSelect();
    } else {
      return this.renderSingleSelect();
    }
  }

  protected renderMultiSelect() {
    const texts = this.getLocalizedText();
    const showResetButton = this.showReset && this._selectedValues.length > 0;
    const effectiveWidth = this.getEffectiveWidth();

    return html`
      <div class="${CSS_CLASSES.SELECT} ${CSS_CLASSES.MULTI_SELECT} ${this.getThemeClass()} ${this.open ? CSS_CLASSES.OPEN : ''}" style="width: ${effectiveWidth};">
        <div class="${CSS_CLASSES.SELECTED_CONTAINER} ${showResetButton ? CSS_CLASSES.WITH_RESET : ''}" @click=${this.toggleDropdown}>
          <div class="${CSS_CLASSES.SELECTED_TAGS}">
            ${this._selectedValues.map(value => {
              const option = this._optionsCache.get(value) || this._options.find(opt => opt.value === value);
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
        ${this.renderDropdown()}
      </div>
    `;
  }

  protected renderSingleSelect() {
    const texts = this.getLocalizedText();
    const firstOptionValue = this._options && this._options.length > 0 ? this._options[0].value : null;
    const showResetButton = this.showReset &&
                          this._value !== null &&
                          firstOptionValue !== null &&
                          this._value !== firstOptionValue;
    const effectiveWidth = this.getEffectiveWidth();

    // labelText가 비어있을 때 placeholder 표시
    const displayText = this._labelText || texts.placeholder;

    return html`
      <div class="${CSS_CLASSES.SELECT} ${this.getThemeClass()} ${this.open ? CSS_CLASSES.OPEN : ''}" style="width: ${effectiveWidth};">
        <div class="${CSS_CLASSES.SELECTED} ${showResetButton ? CSS_CLASSES.WITH_RESET : ''}" @click=${this.toggleDropdown}>
          <span class="${!this._labelText ? CSS_CLASSES.PLACEHOLDER : ''}">${displayText}</span>
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
        ${this.renderDropdown()}
      </div>
    `;
  }

  public removeTag = (e: Event, valueToRemove: string): void => {
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
          requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
          });
        }
      }
    }

    // 표준 이벤트 발생
    triggerDeselectEvent(this, option?.textContent || '', valueToRemove);

    this._debouncedUpdate();
  };

  public resetToDefault = (e: Event): void => {
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
          requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
          });
        }
      } else {
        this._pendingActiveIndex = 0;
      }

      // 표준 이벤트 발생
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

        // 표준 이벤트 발생
        triggerResetEvent(this, { value: firstOption.value, label: firstOption.textContent || '' });
      }
    }
    
    this._debouncedUpdate();
  };

  public toggleDropdown = (): void => {
    if (this.open) this.closeDropdown();
    else this.openDropdown();
  };

  public hasNoOptions(): boolean {
    return this._options.length === 0;
  }

  // 초기화 시 기존 슬롯 옵션들을 optionItems로 변환
  public initializeOptionsFromPropsOrSlot(): void {
    if (this._isUpdating) return;
    this._isUpdating = true;

    try {
      const optionEls = Array.from(this.querySelectorAll('option')) as HTMLOptionElement[];

      if (optionEls.length > 0) {
        // 슬롯에서 optionItems로 변환
        const itemsFromSlot = optionEls.map(opt => ({
          value: opt.value,
          label: opt.textContent || ''
        }));

        // 기존 optionItems가 비어있다면 슬롯 데이터로 초기화
        if (!this.optionItems || this.optionItems.length === 0) {
          this.optionItems = itemsFromSlot;
        }

        // DOM에서 제거 (optionItems가 원본이 됨)
        optionEls.forEach(el => el.remove());
      }

      // optionItems에서 실제 DOM 구성
      this._rebuildOptionsFromItems();

      // 선택된 값 처리 - _rebuildOptionsFromItems 이후에 처리
      if (this.multiple) {
        const selectedOptions = this._options.filter(opt => opt.selected);
        this._selectedValues = selectedOptions.map(opt => opt.value);
      } else {
        const selected = this._options.find(opt => opt.selected);
        if (selected) {
          this._setValue(selected.value, false);
        }
        // _rebuildOptionsFromItems에서 이미 처리하므로 여기서는 제거
      }

      // 초기값 설정
      if (this._options.length > 0) {
        this._initialValue = this._options[0].value;
        this._initialLabel = this._options[0].textContent || '';
      }

      // 너비 계산을 비동기로 처리
      this.calculateAutoWidth();
      
    } finally {
      this._isUpdating = false;
      this._debouncedUpdate();
    }
  }

  public openDropdown(): void {
    // 표준 이벤트 발생
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

  public closeDropdown(): void {
    this.open = false;
    this._debouncedUpdate();
  }

  protected initializeVirtualSelect(): void {
    const scrollEl = this.querySelector(`.${CSS_CLASSES.SCROLL}`) as HTMLDivElement;
    const optionData = this.getAllOptionData();

    if (this.multiple && optionData.length === 0) {
      return;
    }

    if (!this._virtual && scrollEl && !this._isLoading && optionData.length > 0) {
      this._virtual = this._createVirtualSelect(optionData, scrollEl);

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

  public async loadOptionsAsync(): Promise<void> {
    return new Promise((resolve) => {
      // 더 빠른 로딩을 위해 타이밍 최적화
      const loadingTime = Math.min(
        Math.random() * (TIMING.LOADING_MAX - TIMING.LOADING_MIN) + TIMING.LOADING_MIN,
        500 // 최대 500ms로 제한
      );
      
      setTimeout(() => {
        resolve();
      }, loadingTime);
    });
  }

  public selectOption(value: string, label: string): void {
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
          requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
          });
        }
      }

      // 표준 이벤트 발생
      triggerSelectEvent(this, label, value);

    } else {
      this._labelText = label;
      this._setValue(value);
      this.closeDropdown();

      // 표준 이벤트 발생
      triggerSelectEvent(this, label, value);
    }
  }

  protected updateFormValue(): void {
    const texts = this.getLocalizedText();
    
    if (this.multiple) {
      const formValue = this._selectedValues.join(',');
      this._internals.setFormValue(formValue);

      if (this.required && this._selectedValues.length === 0) {
        this._internals.setValidity({ valueMissing: true }, texts.required);
      } else {
        this._internals.setValidity({});
      }
    }
  }

  public handleOutsideClick = async (e: MouseEvent) => {
    const target = e.target as Node;
    const box = this.querySelector(`.${CSS_CLASSES.SELECT}`) as HTMLDivElement;
    if (box?.contains(target)) return;
    if (!this.contains(target)) await this.closeDropdown();
  };

  public onOtherSelectOpened = (e: Event): void => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail !== this && this.open) {
      this.closeDropdown();
    }
  };

  // 최적화된 텍스트 너비 측정 - 캐싱 적용
  public getMaxOptionWidth(texts: string[], font: string): number {
    const cacheKey = `${texts.join('|')}|${font}`;
    
    if (this._widthCalculationCache.has(cacheKey)) {
      return this._widthCalculationCache.get(cacheKey)!;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.font = font;
    
    const maxWidth = Math.max(...texts.map((t) => {
      const width = ctx.measureText(t).width;
      return width > 100 ? width : 100;
    }));
    
    this._widthCalculationCache.set(cacheKey, maxWidth);
    return maxWidth;
  }

  public getAllOptionData(): VirtualSelectOption[] {
    if (this.multiple) {
      return this._options
        .filter((opt) => !this._selectedValues.includes(opt.value))
        .map((opt) => ({
          value: opt.value,
          label: opt.textContent ?? '',
        }));
    } else {
      return this._options.map((opt) => ({
        value: opt.value,
        label: opt.textContent ?? '',
      }));
    }
  }

  public _createVirtualSelect(options: VirtualSelectOption[], container: HTMLDivElement) {
    return new InteractiveVirtualSelect(container, options, {
      isMultiple: this.multiple,
      renderOption: (el: HTMLElement, opt: VirtualSelectOption) => {
        el.textContent = opt.label;

        if (this.multiple) {
          const isSelected = this._selectedValues.includes(opt.value);
          el.classList.toggle(CSS_CLASSES.SELECTED, isSelected);
          if (isSelected) {
            el.innerHTML = `<span class="${CSS_CLASSES.CHECK_MARK}">✓</span> ${opt.label}`;
          }
        }
      },
      onClick: (opt: VirtualSelectOption) => setTimeout(() => this.selectOption(opt.value, opt.label), TIMING.SELECT_DELAY),
      onEscape: () => this.closeDropdown(),
    });
  }

  public _setValue(newVal: string, emit: boolean = true): void {
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
    
    // 표준 이벤트 발생
    if (emit) triggerChangeEvent(this);
  }

  get options(): HTMLOptionElement[] {
    return this._options;
  }

  get selectedIndex(): number {
    if (this.multiple) {
      return -1;
    }
    return this._options.findIndex((opt) => opt.value === this._value);
  }

  get value(): string | null {
    if (this.multiple) {
      return this._selectedValues.join(',');
    }
    return this._value;
  }

  set value(newVal: string) {
    if (this.multiple) {
      this._selectedValues = newVal ? newVal.split(',').filter(v => v.trim()) : [];
      this.updateFormValue();
      this._debouncedUpdate();
    } else {
      this._setValue(newVal, true);
    }
  }

  get defaultValue(): string | null {
    return this._options.length > 0 ? this._options[0].value : null;
  }

  get selectedValues(): string[] {
    return this.multiple ? [...this._selectedValues] : [];
  }

  set selectedValues(values: string[]) {
    if (this.multiple) {
      this._selectedValues = [...values];
      this.updateFormValue();
      this._debouncedUpdate();
    }
  }

  public resetToDefaultValue(): void {
    this.resetToDefault(new Event('reset'));
  }

  public setLanguage(language: SupportedLanguage): void {
    this.language = language;
    this._localizedTextCache = null; // 캐시 무효화
    this._debouncedUpdate();
  }

  public setTexts(customTexts: Partial<LocalizedTexts>): void {
    this.texts = { ...this.texts, ...customTexts };
    this._localizedTextCache = null; // 캐시 무효화
    this._debouncedUpdate();
  }

  public setAutoWidth(enabled: boolean): void {
    this.autoWidth = enabled;
    this.calculateAutoWidth();
    this._debouncedUpdate();
  }

  // 캐시 수동 정리 메서드
  public clearCaches(): void {
    this._optionsCache.clear();
    this._widthCalculationCache.clear();
    this._localizedTextCache = null;
    this._lastLanguage = '';
    this._lastTextsHash = '';
  }

  // 타입 안전한 이벤트 리스너 헬퍼 메서드들 (표준 addEventListener 권장)
  public onSelect(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.SELECT]) => void): void {
    this.addEventListener(EVENT_NAMES.SELECT, handler as EventListener);
  }

  /**
   * 선택 해제 이벤트 리스너 추가 (타입 안전)
   */
  public onDeselect(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.DESELECT]) => void): void {
    this.addEventListener(EVENT_NAMES.DESELECT, handler as EventListener);
  }

  /**
   * 리셋 이벤트 리스너 추가 (타입 안전)
   */
  public onReset(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.RESET]) => void): void {
    this.addEventListener(EVENT_NAMES.RESET, handler as EventListener);
  }

  /**
   * 드롭다운 열기 이벤트 리스너 추가 (타입 안전)
   */
  public onOpen(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.SELECT_OPEN]) => void): void {
    this.addEventListener(EVENT_NAMES.SELECT_OPEN, handler as EventListener);
  }

  /**
   * 변경 이벤트 리스너 추가 (타입 안전)
   */
  public onChange(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.CHANGE]) => void): void {
    this.addEventListener(EVENT_NAMES.CHANGE, handler as EventListener);
  }

  static getSupportedLanguages(): SupportedLanguage[] {
    return SUPPORTED_LANGUAGES;
  }

  static getDefaultTexts(): Record<SupportedLanguage, LocalizedTexts> {
    return LOCALIZED_TEXTS;
  }
}

if (!customElements.get('seo-select')) {
  customElements.define('seo-select', SeoSelect);
}