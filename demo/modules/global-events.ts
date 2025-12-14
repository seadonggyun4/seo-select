/**
 * 전역 이벤트 관리자
 */

import { CONFIG } from './constants';
import { isSeoSelectElement } from './utils';
import { addSeoSelectListener, addMultipleEventListeners } from './event-helpers';
import { showNotification } from './notification';

export class GlobalEventManager {
  public initialize(): void {
    this.initializeGlobalListeners();
    this.setupKeyboardShortcuts();
    this.setupHeaderDemo();
    this.watchForNewComponents();
  }

  private initializeGlobalListeners(): void {
    document.querySelectorAll('seo-select, seo-select-search').forEach(select => {
      if (!isSeoSelectElement(select) || select.dataset.eventListenersInitialized) return;

      const componentName = select.name || select.id || 'unnamed';

      addMultipleEventListeners(select, {
        'onSelect': (event) => {
          const eventData = {
            label: event.label || event.detail?.label,
            value: event.value || event.detail?.value
          };
          console.log(`[${componentName}] Selected:`, eventData);
        },
        'onDeselect': (event) => {
          const eventData = {
            label: event.label || event.detail?.label,
            value: event.value || event.detail?.value
          };
          console.log(`[${componentName}] Deselected:`, eventData);
        },
        'onReset': (event) => {
          const eventData = event.detail || {
            label: event.label,
            value: event.value,
            values: event.values,
            labels: event.labels
          };
          console.log(`[${componentName}] Reset:`, eventData);
        },
        'onChange': (event) => {
          const target = event.target as HTMLInputElement | null;
          console.log(`[${componentName}] Change:`, target?.value);
        }
      });

      select.dataset.eventListenersInitialized = 'true';
    });
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e) => {
      if (e.altKey && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const sectionIndex = parseInt(e.key) - 1;
        const navButtons = document.querySelectorAll('.nav-btn');
        if (navButtons[sectionIndex]) {
          (navButtons[sectionIndex] as HTMLElement).click();
        }
      }
    });
  }

  private setupHeaderDemo(): void {
    const headerDemo = document.querySelector('seo-select-search[name="welcome"]');
    if (!isSeoSelectElement(headerDemo)) return;

    addSeoSelectListener(headerDemo, 'onSelect', (event) => {
      const eventData = {
        label: event.label || event.detail?.label,
        value: event.value || event.detail?.value
      };
      showNotification(`Welcome! You selected: ${eventData.label}`);
      console.log('Header demo selection:', eventData);
    });
  }

  private watchForNewComponents(): void {
    const observer = new MutationObserver(mutations => {
      let hasNewComponents = false;
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName === 'SEO-SELECT' || element.tagName === 'SEO-SELECT-SEARCH') {
              hasNewComponents = true;
            } else if (element.querySelectorAll) {
              const selectComponents = element.querySelectorAll('seo-select, seo-select-search');
              if (selectComponents.length > 0) {
                hasNewComponents = true;
              }
            }
          }
        });
      });

      if (hasNewComponents) {
        setTimeout(() => this.initializeGlobalListeners(), CONFIG.NEW_COMPONENT_DELAY);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}
