import { SeoSelect } from '../seo-select/index.js';
import { SupportedLanguage, SelectTheme, SearchLocalizedTexts, EVENT_NAMES } from '../../constants/constants.js';
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
    onSearchFilter(handler: (filteredOptions: VirtualSelectOption[]) => void): void;
    private getSearchLocalizedText;
    updated(changed: Map<string, unknown>): void;
    private getSearchIcon;
    private renderSearchDropdown;
    protected getThemeClass(): string;
    render(): import('lit-html').TemplateResult<1>;
    private renderMultiSelectSearch;
    private renderSingleSelectSearch;
    _createVirtualSelect(options: VirtualSelectOption[], container: HTMLDivElement): import('../../core/InteractiveVirtualSelect.js').InteractiveVirtualSelect;
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
export {};
