import { EVENT_NAMES } from '../constants/constants.js';

export class SeoSearchChangeEvent extends Event {
  public readonly searchText: string;
  public readonly previousSearchText?: string;

  constructor(searchText: string, previousSearchText?: string) {
    super(EVENT_NAMES.SEARCH_CHANGE, { bubbles: true, composed: true });
    this.searchText = searchText;
    if(previousSearchText) this.previousSearchText = previousSearchText;
  }
}

export class SeoSearchFilterEvent extends Event {
  public readonly filteredOptions: Array<{ value: string; label: string }>;
  public readonly searchText: string;
  public readonly hasResults: boolean;

  constructor(
    filteredOptions: Array<{ value: string; label: string }>,
    searchText: string,
    hasResults: boolean = true
  ) {
    super(EVENT_NAMES.SEARCH_FILTER, { bubbles: true, composed: true });
    this.filteredOptions = filteredOptions;
    this.searchText = searchText;
    this.hasResults = hasResults;
  }
}