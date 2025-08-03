import { InteractiveVirtualSelect as InteractiveVirtualSelect_2 } from '../../core/InteractiveVirtualSelect.js';
import { LitElement } from 'lit';
import { TemplateResult } from 'lit-html';

declare const EVENT_NAMES: {
    readonly SELECT_OPEN: "onOpen";
    readonly SELECT: "onSelect";
    readonly DESELECT: "onDeselect";
    readonly RESET: "onReset";
    readonly CHANGE: "onChange";
};

declare class InteractiveVirtualSelect {
    static activeInstance: InteractiveVirtualSelect | null;
    private container;
    private data;
    private rowHeight;
    private overscan;
    private renderOption;
    private onClick;
    private onEscape;
    private isMultiple;
    private total;
    private focusedIndex;
    private activeIndex;
    private _prevStart;
    private _prevEnd;
    private pool;
    private wrapper;
    private topPad;
    private botPad;
    private visibleCount;
    private poolSize;
    private _ticking;
    private _prevStartIdx;
    private _onScroll;
    constructor(container: HTMLElement, data: OptionData[], options?: InteractiveVirtualSelectOptions);
    deactivate(): void;
    renderToIndex(index: number): void;
    private _ensureWrapper;
    private _buildDOM;
    private _initializeContainer;
    private _buildPool;
    private _bindScroll;
    private _isVisible;
    render(): void;
    setActiveIndex(index: number): void;
    private _setPlaceholders;
    private _renderPool;
    private _applyHighlight;
    private _handleDisabledOption;
    private _resetClass;
    private _createOptionElement;
    private _handleClick;
    handleKeydown: (e: KeyboardEvent) => void;
    setFocusedIndex(index: number): void;
    private _scrollIntoView;
    getFocusedOption(): OptionData | null;
    setData(newData: OptionData[], activeValue?: string): void;
    destroy(): void;
    applyHighlight(): void;
    setActiveAndFocusedIndex(index: number): void;
}

declare interface InteractiveVirtualSelectOptions {
    rowHeight?: number;
    overscan?: number;
    renderOption?: ((element: HTMLElement, option: OptionData) => void) | null;
    onClick?: ((option: OptionData, index: number, event: Event) => void) | null;
    onEscape?: (() => void) | null;
    isMultiple?: boolean;
}

declare interface LocalizedTexts {
    placeholder: string;
    loadingText: string;
    noDataText: string;
    removeTag: string;
    clearAll: string;
    resetToDefault: string;
    required: string;
}

declare interface OptionData {
    value: string;
    label: string;
    [key: string]: any;
}

declare interface SearchLocalizedTexts {
    searchPlaceholder: string;
    noMatchText: string;
}

declare type SelectTheme = 'basic' | 'float';

declare class SeoSelect extends LitElement {
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
    protected getCloseIcon(): TemplateResult<1>;
    protected getChevronDownIcon(): TemplateResult<1>;
    protected getChevronUpIcon(): TemplateResult<1>;
    protected renderLoadingSpinner(): TemplateResult<1>;
    protected renderNoData(): TemplateResult<1>;
    protected renderDropdown(): TemplateResult<1>;
    protected getThemeClass(): string;
    render(): TemplateResult<1>;
    protected renderMultiSelect(): TemplateResult<1>;
    protected renderSingleSelect(): TemplateResult<1>;
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

declare type SeoSelectEventListener<T extends keyof HTMLElementEventMap> = (event: HTMLElementEventMap[T]) => void;

export declare class SeoSelectSearch extends SeoSelect {
    static get properties(): {
        _searchText: {
            type: StringConstructor;
        };
        _noMatchVisible: {
            type: BooleanConstructor;
        };
        theme: {
            type: StringConstructor;
        };
        dark: {
            type: BooleanConstructor;
        };
        searchTexts: {
            type: ObjectConstructor;
        };
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
    _searchText: string;
    _noMatchVisible: boolean;
    theme: SelectTheme;
    dark: boolean;
    searchTexts: Partial<SearchLocalizedTexts>;
    constructor();
    /**
     * @deprecated 표준 addEventListener를 사용하세요
     */
    addSeoSelectEventListener<T extends keyof HTMLElementEventMap>(type: T, listener: SeoSelectEventListener<T>, options?: AddEventListenerOptions): void;
    /**
     * @deprecated 표준 removeEventListener를 사용하세요
     */
    removeSeoSelectEventListener<T extends keyof HTMLElementEventMap>(type: T, listener: SeoSelectEventListener<T>, options?: EventListenerOptions): void;
    /**
     * 선택 이벤트 리스너 추가 (타입 안전)
     * @example
     * searchSelect.onSelect((event) => {
     *   console.log('Selected:', event.label, event.value);
     * });
     */
    onSelect(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.SELECT]) => void): void;
    /**
     * 선택 해제 이벤트 리스너 추가 (타입 안전)
     * @example
     * searchSelect.onDeselect((event) => {
     *   console.log('Deselected:', event.label, event.value);
     * });
     */
    onDeselect(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.DESELECT]) => void): void;
    /**
     * 리셋 이벤트 리스너 추가 (타입 안전)
     * @example
     * searchSelect.onReset((event) => {
     *   if (event.values && event.labels) {
     *     console.log('Reset multiple:', event.values, event.labels);
     *   } else {
     *     console.log('Reset single:', event.value, event.label);
     *   }
     * });
     */
    onReset(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.RESET]) => void): void;
    /**
     * 변경 이벤트 리스너 추가 (타입 안전)
     * @example
     * searchSelect.onChange((event) => {
     *   console.log('Value changed');
     * });
     */
    onChange(handler: (event: HTMLElementEventMap[typeof EVENT_NAMES.CHANGE]) => void): void;
    /**
     * 검색 텍스트 변경 이벤트 리스너 추가 (검색 컴포넌트 전용)
     * @example
     * searchSelect.onSearchChange((searchText) => {
     *   console.log('Search text changed:', searchText);
     * });
     */
    onSearchChange(handler: (searchText: string) => void): void;
    /**
     * 검색 결과 필터링 이벤트 리스너 추가 (검색 컴포넌트 전용)
     * @example
     * searchSelect.onSearchFilter((filteredOptions) => {
     *   console.log('Filtered options:', filteredOptions);
     * });
     */
    onSearchFilter(handler: (filteredOptions: VirtualSelectOption_2[]) => void): void;
    private getSearchLocalizedText;
    updated(changed: Map<string, unknown>): void;
    private getSearchIcon;
    private renderSearchDropdown;
    protected getThemeClass(): string;
    render(): TemplateResult<1>;
    private renderMultiSelectSearch;
    private renderSingleSelectSearch;
    _createVirtualSelect(options: VirtualSelectOption_2[], container: HTMLDivElement): InteractiveVirtualSelect_2;
    protected initializeVirtualSelect(): void;
    private _handleSearchInput;
    private getCurrentValue;
    private _applyFilteredOptions;
    removeTag: (e: Event, valueToRemove: string) => void;
    resetToDefault: (e: Event) => void;
    openDropdown(): void;
    selectOption(value: string, label: string): void;
    _setValue(newVal: string, emit?: boolean): void;
    closeDropdown(): void;
    calculateAutoWidth(): void;
    setLanguage(language: SupportedLanguage): void;
    setSearchTexts(customSearchTexts: Partial<SearchLocalizedTexts>): void;
    clearSearchText(): void;
    getSearchText(): string;
    setSearchText(searchText: string): void;
    static getSearchLocalizedTexts(): Record<SupportedLanguage, SearchLocalizedTexts>;
    static getDefaultSearchTexts(): Record<SupportedLanguage, SearchLocalizedTexts>;
    testMultilingualSearch(searchText: string, targetText: string): boolean;
    getPerformanceMetrics(): {
        optionCount: number;
        cacheSize: number;
        isUpdating: boolean;
        hasCalculatedWidth: boolean;
        searchText: string;
        hasSearchResults: boolean;
    };
}

declare type SupportedLanguage = 'en' | 'ko' | 'ja' | 'zh';

declare interface VirtualSelectOption {
    value: string;
    label: string;
}

declare interface VirtualSelectOption_2 {
    value: string;
    label: string;
}

export { }
