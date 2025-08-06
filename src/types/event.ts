import { EVENT_NAMES } from '../constants/constants';

export interface ResetEventData {
  label?: string;
  value?: string;
  labels?: string[];
  values?: string[];
}

export const SeoSelectEvents = {
  SELECT: EVENT_NAMES.SELECT,
  DESELECT: EVENT_NAMES.DESELECT,
  RESET: EVENT_NAMES.RESET,
  CHANGE: EVENT_NAMES.CHANGE,
  SELECT_OPEN: EVENT_NAMES.SELECT_OPEN,
  SEARCH_CHANGE: EVENT_NAMES.SEARCH_CHANGE,
  SEARCH_FILTER: EVENT_NAMES.SEARCH_FILTER,
} as const;

export type SeoSelectEventType = typeof SeoSelectEvents[keyof typeof SeoSelectEvents];
