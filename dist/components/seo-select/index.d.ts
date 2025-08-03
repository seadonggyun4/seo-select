import { LitElement } from 'lit';
import { InteractiveVirtualSelect } from '../../core/InteractiveVirtualSelect.js';
import { SupportedLanguage, SelectTheme, LocalizedTexts, EVENT_NAMES } from '../../constants/constants.js';
import { SeoSelectEventListener } from '../../event/index.js';
interface VirtualSelectOption {
    value: string;
    label: string;
}
declare global {
    interface HTMLElementEventMap {
        [EVENT_NAMES.SELECT]: import('../../event/SeoSelectEvent.js').SeoSelectEvent;
        [EVENT_NAMES.DESELECT]: import('../../event/SeoSelectEvent.js').SeoDeselectEvent;
        [EVENT_NAMES.RESET]: import('../../event/SeoSelectEvent.js').SeoResetEvent;
        [EVENT_NAMES.CHANGE]: import('../../event/SeoSelectEvent.js').SeoChangeEvent;
        [EVENT_NAMES.SELECT_OPEN]: import('../../event/SeoSelectEvent.js').SeoOpenEvent;
    }
}
export declare class SeoSelect extends LitElement {
    static formAssociated: boolean;
    static get properties(): {
        id: {
            type: StringConstructor;
        };
        name: {
            type: StringConstructor;
        };
        required: {
            type: BooleanConstructor;
            reflect: boolean;
        };
        width: {
            type: StringConstructor;
        };
        height: {
            type: StringConstructor;
        };
        optionItems: {
            type: ArrayConstructor;
        };
        open: {
            type: BooleanConstructor;
            state: boolean;
        };
        _labelText: {
            type: StringConstructor;
            state: boolean;
        };
        showReset: {
            type: BooleanConstructor;
        };
        multiple: {
            type: BooleanConstructor;
        };
        _selectedValues: {
            type: ArrayConstructor;
            state: boolean;
        };
        _isLoading: {
            type: BooleanConstructor;
            state: boolean;
        };
        theme: {
            type: StringConstructor;
        };
        dark: {
            type: BooleanConstructor;
        };
        language: {
            type: StringConstructor;
        };
        texts: {
            type: ObjectConstructor;
        };
        autoWidth: {
            type: BooleanConstructor;
        };
    };
    id: string;
    name: string;
    required: boolean;
    width: string | null;
    height: string;
    optionItems: VirtualSelectOption[];
    showReset: boolean;
    multiple: boolean;
    theme: SelectTheme;
    dark: boolean;
    language: SupportedLanguage;
    texts: Partial<LocalizedTexts>;
    autoWidth: boolean;
    open: boolean;
    _labelText: string;
    _selectedValues: string[];
    _isLoading: boolean;
    _value: string | null;
    _initialValue: string | null;
    _initialLabel: string | null;
    _virtual: InteractiveVirtualSelect | null;
    _options: HTMLOptionElement[];
    _internals: ElementInternals;
    _pendingActiveIndex: number | null;
    _calculatedWidth: string | null;
    _optionsCache: Map<string, HTMLOptionElement>;
    private _localizedTextCache;
    private _lastLanguage;
    private _lastTextsHash;
    private _widthCalculationCache;
    private _isUpdating;
    private _updateDebounceTimer;
    private _handleKeydownBound;
    constructor();
    /**
     * @deprecated 표준 addEventListener를 사용하세요
     */
    addSeoSelectEventListener<T extends keyof HTMLElementEventMap>(type: T, listener: SeoSelectEventListener<T>, options?: AddEventListenerOptions): void;
    /**
     * @deprecated 표준 removeEventListener를 사용하세요
     */
    removeSeoSelectEventListener<T extends keyof HTMLElementEventMap>(type: T, listener: SeoSelectEventListener<T>, options?: EventListenerOptions): void;
    getLocalizedText(): LocalizedTexts;
    createRenderRoot(): this;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _debouncedUpdate(): void;
    updated(changed: Map<string, unknown>): void;
    calculateAutoWidth(): void;
    getEffectiveWidth(): string;
    protected getCloseIcon(): import('lit-html').TemplateResult<1>;
    protected getChevronDownIcon(): import('lit-html').TemplateResult<1>;
    protected getChevronUpIcon(): import('lit-html').TemplateResult<1>;
    protected renderLoadingSpinner(): import('lit-html').TemplateResult<1>;
    protected renderNoData(): import('lit-html').TemplateResult<1>;
    protected renderDropdown(): import('lit-html').TemplateResult<1>;
    protected getThemeClass(): string;
    render(): import('lit-html').TemplateResult<1>;
    protected renderMultiSelect(): import('lit-html').TemplateResult<1>;
    protected renderSingleSelect(): import('lit-html').TemplateResult<1>;
    removeTag: (e: Event, valueToRemove: string) => void;
    resetToDefault: (e: Event) => void;
    toggleDropdown: () => void;
    hasNoOptions(): boolean;
    initializeOptionsFromPropsOrSlot(): void;
    openDropdown(): void;
    closeDropdown(): void;
    protected initializeVirtualSelect(): void;
    loadOptionsAsync(): Promise<void>;
    selectOption(value: string, label: string): void;
    protected updateFormValue(): void;
    handleOutsideClick: (e: MouseEvent) => Promise<void>;
    onOtherSelectOpened: (e: Event) => void;
    getMaxOptionWidth(texts: string[], font: string): number;
    getAllOptionData(): VirtualSelectOption[];
    _createVirtualSelect(options: VirtualSelectOption[], container: HTMLDivElement): InteractiveVirtualSelect;
    _setValue(newVal: string, emit?: boolean): void;
    get options(): HTMLOptionElement[];
    get selectedIndex(): number;
    get value(): string | null;
    set value(newVal: string);
    get defaultValue(): string | null;
    get selectedValues(): string[];
    set selectedValues(values: string[]);
    resetToDefaultValue(): void;
    setLanguage(language: SupportedLanguage): void;
    setTexts(customTexts: Partial<LocalizedTexts>): void;
    setAutoWidth(enabled: boolean): void;
    batchUpdateOptions(newOptions: VirtualSelectOption[]): void;
    addOption(option: VirtualSelectOption): void;
    removeOption(value: string): void;
    findOption(value: string): HTMLOptionElement | null;
    clearOptions(): void;
    getPerformanceMetrics(): {
        optionCount: number;
        cacheSize: number;
        isUpdating: boolean;
        hasCalculatedWidth: boolean;
    };
    clearCaches(): void;
    onSelect(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.SELECT]) => void): void;
    /**
     * 선택 해제 이벤트 리스너 추가 (타입 안전)
     */
    onDeselect(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.DESELECT]) => void): void;
    /**
     * 리셋 이벤트 리스너 추가 (타입 안전)
     */
    onReset(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.RESET]) => void): void;
    /**
     * 변경 이벤트 리스너 추가 (타입 안전)
     */
    onChange(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.CHANGE]) => void): void;
    static getSupportedLanguages(): SupportedLanguage[];
    static getDefaultTexts(): Record<SupportedLanguage, LocalizedTexts>;
}
export {};
