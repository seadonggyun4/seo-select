import { LitElement, html } from 'lit';
import { InteractiveVirtualSelect } from '../../class/InteractiveVirtualSelect';
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
} from '../../constants/constants';

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
    this.height = DEFAULT_CONFIG.height;
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
    this._handleKeydownBound = (e) => this._virtual?.handleKeydown(e);
    this.tabIndex = 0;
    this._pendingActiveIndex = null;
  }

  // 현재 언어의 텍스트를 가져오고 커스텀 텍스트로 오버라이드하는 헬퍼 메서드
  public getLocalizedText(): LocalizedTexts {
    const baseTexts = LOCALIZED_TEXTS[this.language] || LOCALIZED_TEXTS.en;
    return {
      ...baseTexts,
      ...this.texts
    };
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback(): void {
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

    if (this.multiple) {
      this._selectedValues = [];
    } else {
      this.value = '';
    }
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('optionItems') || changed.has('language') || changed.has('texts')) {
      this.initializeOptionsFromPropsOrSlot();
    }
    if (changed.has('width') || changed.has('optionItems') || changed.has('_options')) {
      this.calculateAutoWidth();
    }
  }

  // 자동 너비 계산 메서드 - public으로 변경
  public calculateAutoWidth(): void {
    // width가 명시적으로 설정되지 않은 경우에만 계산
    if (this.width || this._options.length === 0) {
      this._calculatedWidth = null;
      return;
    }

    // 모든 옵션 텍스트를 수집
    const optionTexts = this._options.map(opt => opt.textContent || '');
    
    // placeholder 텍스트도 고려
    const texts = this.getLocalizedText();
    if (this.multiple) {
      optionTexts.push(texts.placeholder);
    }

    // 현재 요소의 font 스타일을 가져와서 측정
    const computedStyle = window.getComputedStyle(this);
    const font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
    
    // 가장 긴 텍스트의 너비를 계산
    const maxTextWidth = this.getMaxOptionWidth(optionTexts, font);
    
    // 추가 여백 계산 (reset 버튼 + 화살표 + 패딩)
    const additionalSpace = this.multiple ? 120 : 80; // multiple일 때는 더 넓게
    const totalWidth = maxTextWidth + additionalSpace;
    
    this._calculatedWidth = `${Math.max(totalWidth, 150)}px`; // 최소 150px
  }

  // 실제 렌더링에서 사용할 너비를 반환 - public으로 변경
  public getEffectiveWidth(): string {
    if (this.width) {
      return this.width;
    }
    // width가 없으면 자동으로 autoWidth 활성화
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
      <div class="${CSS_CLASSES.SELECT} ${CSS_CLASSES.MULTI_SELECT} ${this.getThemeClass()} ${this.open ? CSS_CLASSES.OPEN : ''}" style="width: ${effectiveWidth}; height: ${this.height};">
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
      <div class="${CSS_CLASSES.SELECT} ${this.getThemeClass()} ${this.open ? CSS_CLASSES.OPEN : ''}" style="width: ${effectiveWidth}; height: ${this.height};">
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

  // removeTag 메서드를 public으로 변경
  public removeTag = (e: Event, valueToRemove: string): void => {
    e.stopPropagation();
    this._selectedValues = this._selectedValues.filter(value => value !== valueToRemove);
    this.updateFormValue();

    const option = this._options.find(opt => opt.value === valueToRemove);

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

    this.requestUpdate();
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
          // 드롭다운이 닫혀있을 때도 다음에 열릴 때를 위해 activeIndex 설정
          this._pendingActiveIndex = 0;
          
          // 드롭다운이 닫혀있을 때 기존 virtual select 인스턴스가 있다면 정리
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
    
    // 상태 변경 후 UI 업데이트 강제 실행
    this.requestUpdate();
  };

  public toggleDropdown = (): void => {
    if (this.open) this.closeDropdown();
    else this.openDropdown();
  };

  // hasNoOptions 메서드를 public으로 변경
  public hasNoOptions(): boolean {
    return this._options.length === 0;
  }

  // initializeOptionsFromPropsOrSlot 메서드를 public으로 변경
  public initializeOptionsFromPropsOrSlot(): void {
    const optionEls = Array.from(this.querySelectorAll('option')) as HTMLOptionElement[];

    if (optionEls.length > 0) {
      this._options = optionEls.map(opt => {
        opt.hidden = true;
        return opt;
      });
    } else if (Array.isArray(this.optionItems) && this.optionItems.length > 0) {
      this._options = this.optionItems.map(opt => {
        const el = document.createElement('option');
        el.value = opt.value;
        el.textContent = opt.label;
        el.hidden = true;
        this.appendChild(el);
        return el;
      });
    } else {
      this._options = [];
    }

    if (this._options.length > 0) {
      this._isLoading = false;
    }

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

    // 옵션이 변경될 때마다 자동 너비 재계산
    this.calculateAutoWidth();
    this.requestUpdate();
  }

  // openDropdown 메서드를 public으로 변경
  public openDropdown(): void {
    window.dispatchEvent(new CustomEvent(EVENT_NAMES.SELECT_OPEN, { detail: this }));
    this.open = true;
    this.requestUpdate();

    if (this.hasNoOptions()) {
      this._isLoading = true;
      this.requestUpdate();

      this.loadOptionsAsync().then(() => {
        this.initializeVirtualSelect();
      }).catch(() => {
        this._isLoading = false;
        this.requestUpdate();
      });
    } else {
      this.initializeVirtualSelect();
    }
  }

  public closeDropdown(): void {
    this.open = false;
    this.requestUpdate();
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

  // loadOptionsAsync 메서드를 public으로 변경
  public async loadOptionsAsync(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, Math.random() * (TIMING.LOADING_MAX - TIMING.LOADING_MIN) + TIMING.LOADING_MIN);
    });
  }

  // selectOption 메서드를 public으로 변경
  public selectOption(value: string, label: string): void {
    if (this.multiple) {
      this._selectedValues = [...this._selectedValues, value];
      this.updateFormValue();
      this.requestUpdate();

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

  // handleOutsideClick 메서드를 public으로 변경
  public handleOutsideClick = async (e: MouseEvent) => {
    const target = e.target as Node;
    const box = this.querySelector(`.${CSS_CLASSES.SELECT}`) as HTMLDivElement;
    if (box?.contains(target)) return;
    if (!this.contains(target)) await this.closeDropdown();
  };

  // onOtherSelectOpened 메서드를 public으로 변경
  public onOtherSelectOpened = (e: Event): void => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail !== this && this.open) {
      this.closeDropdown();
    }
  };

  public getMaxOptionWidth(texts: string[], font: string): number {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    ctx.font = font;
    return Math.max(...texts.map((t) => (ctx.measureText(t).width > 100 ? ctx.measureText(t).width : 100)));
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

  // _setValue 메서드를 public으로 변경
  public _setValue(newVal: string, emit: boolean = true): void {
    if (this._value === newVal) return;

    this._value = newVal;
    const matched = this._options.find((opt) => opt.value === newVal);
    this._labelText = matched?.textContent ?? this._labelText ?? '';

    this._internals.setFormValue(this._value || '');

    const texts = this.getLocalizedText();
    if (this.required && !this._value) {
      this._internals.setValidity({ valueMissing: true }, texts.required);
    } else {
      this._internals.setValidity({});
    }

    this.requestUpdate();
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
      this.requestUpdate();
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
      this.requestUpdate();
    }
  }

  public resetToDefaultValue(): void {
    this.resetToDefault(new Event('reset'));
  }

  // 언어 변경을 위한 공개 메서드
  public setLanguage(language: SupportedLanguage): void {
    this.language = language;
    this.requestUpdate();
  }

  // 커스텀 텍스트 설정 메서드
  public setTexts(customTexts: Partial<LocalizedTexts>): void {
    this.texts = { ...this.texts, ...customTexts };
    this.requestUpdate();
  }

  // 자동 너비 기능 제어 메서드
  public setAutoWidth(enabled: boolean): void {
    this.autoWidth = enabled;
    this.calculateAutoWidth();
    this.requestUpdate();
  }

  // 현재 지원하는 언어 목록을 반환하는 정적 메서드
  static getSupportedLanguages(): SupportedLanguage[] {
    return SUPPORTED_LANGUAGES;
  }

  // 기본 텍스트 구조를 반환하는 정적 메서드
  static getDefaultTexts(): Record<SupportedLanguage, LocalizedTexts> {
    return LOCALIZED_TEXTS;
  }
}

if (!customElements.get('seo-select')) {
  customElements.define('seo-select', SeoSelect);
}