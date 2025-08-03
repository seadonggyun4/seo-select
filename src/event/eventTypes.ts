import { EVENT_NAMES } from '../constants/constants.js';

/**
 * 리셋 이벤트 데이터 타입
 */
export interface ResetEventData {
  label?: string;
  value?: string;
  labels?: string[];
  values?: string[];
}

/**
 * 이벤트 상수들 (EVENT_NAMES와 매핑)
 */
export const SeoSelectEvents = {
  SELECT: EVENT_NAMES.SELECT,
  DESELECT: EVENT_NAMES.DESELECT,
  RESET: EVENT_NAMES.RESET,
  CHANGE: EVENT_NAMES.CHANGE,
  SELECT_OPEN: EVENT_NAMES.SELECT_OPEN,
} as const;

/**
 * 이벤트 타입 유니온
 */
export type SeoSelectEventType = typeof SeoSelectEvents[keyof typeof SeoSelectEvents];

/**
 * 커스텀 이벤트 디테일 타입 (레거시 지원용)
 */
export interface SelectEventDetail {
  value: string;
  label: string;
}

export interface DeselectEventDetail {
  value: string;
  label: string;
}

export interface ResetEventDetail {
  value?: string;
  label?: string;
  values?: string[];
  labels?: string[];
}