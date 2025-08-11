import { EVENT_NAMES } from '../constants/constants';

type SearchChangeDetail = { searchText: string } | { searchText: string; previousSearchText: string };

export class SeoSearchChangeEvent extends CustomEvent<SearchChangeDetail> {
  constructor(searchText: string, previousSearchText?: string) {
    const detail: SearchChangeDetail =
      previousSearchText === undefined ? { searchText } : { searchText, previousSearchText };
    super(EVENT_NAMES.SEARCH_CHANGE, { detail, bubbles: true, composed: true });
  }
}

export class SeoSearchFilterEvent extends CustomEvent<{
  filteredOptions: Array<{ value: string; label: string }>;
  searchText: string;
  hasResults: boolean;
}> {
  constructor(filteredOptions: Array<{ value: string; label: string }>, searchText: string, hasResults: boolean) {
    super(EVENT_NAMES.SEARCH_FILTER, { detail: { filteredOptions, searchText, hasResults }, bubbles: true, composed: true });
  }
}
