/**
 * 이벤트 헬퍼 함수들
 */

import type { SeoSelectElement, SeoSelectEvent, EventHandlers } from './types';

/**
 * SeoSelect 요소에 이벤트 리스너 추가
 */
export function addSeoSelectListener(
  element: SeoSelectElement,
  eventType: string,
  handler: (event: SeoSelectEvent) => void
): void {
  if (element?.addSeoSelectEventListener) {
    element.addSeoSelectEventListener(eventType, handler);
  } else {
    element.addEventListener(eventType, handler as EventListener);
  }
}

/**
 * 여러 이벤트 리스너를 한번에 추가
 */
export function addMultipleEventListeners(
  element: SeoSelectElement,
  eventHandlers: EventHandlers
): void {
  Object.entries(eventHandlers).forEach(([eventType, handler]) => {
    addSeoSelectListener(element, eventType, handler);
  });
}

/**
 * SeoSelect 이벤트를 로그 요소에 기록
 */
export function logSeoSelectEvent(
  eventLog: HTMLElement,
  eventType: string,
  event: SeoSelectEvent
): void {
  const time = new Date().toLocaleTimeString();
  const logEntry = document.createElement('div');

  const eventData = event.detail || event;
  const label = event.label || eventData.label || '';
  const value = event.value || eventData.value || '';
  const values = event.values || eventData.values || [];

  let message = '';
  let color = '#6b7280';

  switch (eventType) {
    case 'onSelect':
      color = '#10b981';
      message = `<span style="color: ${color};">Selected:</span> ${label} (value: ${value})`;
      break;
    case 'onDeselect':
      color = '#ef4444';
      message = `<span style="color: ${color};">Deselected:</span> ${label} (value: ${value})`;
      break;
    case 'onReset':
      color = '#f59e0b';
      message = values.length > 0
        ? `<span style="color: ${color};">Reset:</span> Multiple items (${values.length} items)`
        : `<span style="color: ${color};">Reset:</span> ${label || 'to default'}`;
      break;
    case 'onChange':
      color = '#3b82f6';
      const target = event.target as HTMLInputElement | null;
      message = `<span style="color: ${color};">Form change:</span> ${target?.value || value}`;
      break;
    default:
      message = `<span style="color: ${color};">${eventType}:</span> ${JSON.stringify(eventData)}`;
  }

  logEntry.innerHTML = `[${time}] ${message}`;
  logEntry.style.cssText = `
    border-bottom: 1px solid #374151;
    padding: 3px 0;
    font-size: 13px;
    font-family: monospace;
  `;

  eventLog.appendChild(logEntry);
  eventLog.scrollTop = eventLog.scrollHeight;
}
