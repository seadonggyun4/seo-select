import { EVENT_NAMES } from '../constants/constants.js';

export class SeoSearchChangeEvent extends CustomEvent<
  { searchText: string } | { searchText: string; previousSearchText: string }
> {
  constructor(searchText: string, previousSearchText?: string) {
    const detail = { searchText, ...(previousSearchText !== undefined ? { previousSearchText } : {}) };
    super(EVENT_NAMES.SEARCH_CHANGE, { detail, bubbles: true, composed: true });
  }
}

export class SeoSearchFilterEvent extends CustomEvent<{ 
  filteredOptions: Array<{ value: string; label: string }>; 
  searchText: string; 
  hasResults: boolean 
}> {
  constructor(filteredOptions: Array<{ value: string; label: string }>, searchText: string, hasResults: boolean = true) {
    super(EVENT_NAMES.SEARCH_FILTER, { detail: { filteredOptions, searchText, hasResults }, bubbles: true, composed: true });
  }
}
