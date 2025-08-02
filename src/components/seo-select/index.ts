import { LitElement, html } from 'lit';
import { InteractiveVirtualSelect } from '../../class/InteractiveVirtualSelect.js';
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

interface VirtualSelectOption {
  value: string;
  label: string;
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
      optionItems: { type: Array },
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
  declare optionItems: VirtualSelectOption[];
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
  private _optionsCache: Map<string, HTMLOptionElement> = new Map();
  private _localizedTextCache: LocalizedTexts | null = null;
  private _lastLanguage: string = '';
  private _lastTextsHash: string = '';
  private _widthCalculationCache: Map<string, number> = new Map();
  private _isUpdating: boolean = false;
  private _pendingUpdate: Promise<void> | null = null;
  private _updateDebounceTimer: ReturnType<typeof setTimeout> | null = null;

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
    this.optionItems = [];
    this.open = false;
    this._labelText = '';
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
    this.style.width = '';
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
    this.style.width = '';
    
    const needsOptionsUpdate = changed.has('optionItems') || 
                              changed.has('language') || 
                              changed.has('texts');
    
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

    this.dispatchEvent(
      new CustomEvent(EVENT_NAMES.DESELECT, {
        detail: { value: valueToRemove, label: option?.textContent || '' },
        bubbles: true,
        composed: true,
      })
    );

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

      this.dispatchEvent(
        new CustomEvent(EVENT_NAMES.RESET, {
          detail: { values: [], labels: [] },
          bubbles: true,
          composed: true,
        })
      );
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

        this.dispatchEvent(
          new CustomEvent(EVENT_NAMES.RESET, {
            detail: { value: firstOption.value, label: firstOption.textContent || '' },
            bubbles: true,
            composed: true,
          })
        );
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

  // 최적화된 옵션 초기화 - 배치 처리 및 캐싱
  public initializeOptionsFromPropsOrSlot(): void {
    if (this._isUpdating) return;
    this._isUpdating = true;

    try {
      // 기존 캐시 정리
      this._optionsCache.clear();

      const optionEls = Array.from(this.querySelectorAll('option')) as HTMLOptionElement[];

      if (optionEls.length > 0) {
        this._options = optionEls.map(opt => {
          opt.hidden = true;
          this._optionsCache.set(opt.value, opt);
          return opt;
        });
      } else if (Array.isArray(this.optionItems) && this.optionItems.length > 0) {
        // DocumentFragment를 사용하여 DOM 조작 최적화
        const fragment = document.createDocumentFragment();
        
        this._options = this.optionItems.map(opt => {
          const el = document.createElement('option');
          el.value = opt.value;
          el.textContent = opt.label;
          el.hidden = true;
          this._optionsCache.set(opt.value, el);
          fragment.appendChild(el);
          return el;
        });
        
        // 한 번에 DOM에 추가
        this.appendChild(fragment);
      } else {
        this._options = [];
      }

      if (this._options.length > 0) {
        this._isLoading = false;
      }

      // 선택된 값 처리
      if (this.multiple) {
        const selectedOptions = this._options.filter(opt => opt.selected);
        this._selectedValues = selectedOptions.map(opt => opt.value);
      } else {
        const selected = this._options.find(opt => opt.selected);
        if (selected) {
          this._setValue(selected.value, false);
        } else if (this._options.length > 0) {
          this._setValue(this._options[0].value, false);
        }
      }

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
    window.dispatchEvent(new CustomEvent(EVENT_NAMES.SELECT_OPEN, { detail: this }));
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

      this.dispatchEvent(
        new CustomEvent(EVENT_NAMES.SELECT, {
          detail: { value, label },
          bubbles: true,
          composed: true,
        })
      );

    } else {
      this._labelText = label;
      this._setValue(value);
      this.closeDropdown();

      this.dispatchEvent(
        new CustomEvent(EVENT_NAMES.SELECT, {
          detail: { value, label },
          bubbles: true,
          composed: true,
        })
      );
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
    if (emit) this.dispatchEvent(new CustomEvent(EVENT_NAMES.CHANGE, { bubbles: true, composed: true }));
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

  // 대량 옵션 업데이트를 위한 배치 처리 메서드
  public batchUpdateOptions(newOptions: VirtualSelectOption[]): void {
    if (this._isUpdating) return;
    
    // 업데이트 중 플래그 설정
    this._isUpdating = true;
    
    try {
      // 기존 옵션 정리
      this._options.forEach(opt => opt.remove());
      this._options = [];
      this._optionsCache.clear();
      this._widthCalculationCache.clear();

      // 새 옵션들을 DocumentFragment로 배치 생성
      const fragment = document.createDocumentFragment();
      
      this._options = newOptions.map(opt => {
        const el = document.createElement('option');
        el.value = opt.value;
        el.textContent = opt.label;
        el.hidden = true;
        this._optionsCache.set(opt.value, el);
        fragment.appendChild(el);
        return el;
      });

      // 한 번에 DOM에 추가
      this.appendChild(fragment);

      // 초기값 설정
      if (this._options.length > 0) {
        this._initialValue = this._options[0].value;
        this._initialLabel = this._options[0].textContent || '';
        this._isLoading = false;
        
        // 단일 선택 모드에서 기본값 설정
        if (!this.multiple && !this._value) {
          this._setValue(this._options[0].value, false);
        }
      }

      // 너비 재계산
      this.calculateAutoWidth();
      
    } finally {
      this._isUpdating = false;
      this._debouncedUpdate();
    }
  }

  // 옵션 추가를 위한 최적화된 메서드
  public addOption(option: VirtualSelectOption): void {
    const el = document.createElement('option');
    el.value = option.value;
    el.textContent = option.label;
    el.hidden = true;
    
    this._options.push(el);
    this._optionsCache.set(option.value, el);
    this.appendChild(el);
    
    // 캐시 무효화
    this._widthCalculationCache.clear();
    this.calculateAutoWidth();
    this._debouncedUpdate();
  }

  // 옵션 제거를 위한 최적화된 메서드
  public removeOption(value: string): void {
    const index = this._options.findIndex(opt => opt.value === value);
    if (index === -1) return;

    const optionEl = this._options[index];
    optionEl.remove();
    this._options.splice(index, 1);
    this._optionsCache.delete(value);
    
    // 선택된 값에서도 제거
    if (this.multiple) {
      this._selectedValues = this._selectedValues.filter(v => v !== value);
      this.updateFormValue();
    } else if (this._value === value) {
      // 현재 선택된 값이 제거되면 첫 번째 옵션으로 변경
      if (this._options.length > 0) {
        this._setValue(this._options[0].value, true);
      } else {
        this._setValue('', true);
      }
    }
    
    // 캐시 무효화
    this._widthCalculationCache.clear();
    this.calculateAutoWidth();
    this._debouncedUpdate();
  }

  // 옵션 검색을 위한 최적화된 메서드
  public findOption(value: string): HTMLOptionElement | null {
    return this._optionsCache.get(value) || null;
  }

  // 모든 옵션 클리어
  public clearOptions(): void {
    this._options.forEach(opt => opt.remove());
    this._options = [];
    this._optionsCache.clear();
    this._widthCalculationCache.clear();
    
    if (this.multiple) {
      this._selectedValues = [];
      this.updateFormValue();
    } else {
      this._setValue('', true);
    }
    
    this._debouncedUpdate();
  }

  // 성능 모니터링을 위한 메서드
  public getPerformanceMetrics(): {
    optionCount: number;
    cacheSize: number;
    isUpdating: boolean;
    hasCalculatedWidth: boolean;
  } {
    return {
      optionCount: this._options.length,
      cacheSize: this._optionsCache.size,
      isUpdating: this._isUpdating,
      hasCalculatedWidth: this._calculatedWidth !== null
    };
  }

  // 캐시 수동 정리 메서드
  public clearCaches(): void {
    this._optionsCache.clear();
    this._widthCalculationCache.clear();
    this._localizedTextCache = null;
    this._lastLanguage = '';
    this._lastTextsHash = '';
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