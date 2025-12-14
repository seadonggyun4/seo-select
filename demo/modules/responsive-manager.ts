/**
 * 반응형 너비 관리자
 */

import { CONFIG, ORIGINAL_WIDTH_KEY } from './constants';
import { debounce } from './utils';

export class ResponsiveWidthManager {
  private isMobile(): boolean {
    return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
  }

  private saveOriginalWidth(component: Element): void {
    if (!component.hasAttribute(ORIGINAL_WIDTH_KEY)) {
      const originalWidth = component.getAttribute('width') || '';
      component.setAttribute(ORIGINAL_WIDTH_KEY, originalWidth);
    }
  }

  private restoreOriginalWidth(component: Element): void {
    const originalWidth = component.getAttribute(ORIGINAL_WIDTH_KEY);
    if (originalWidth !== null) {
      if (originalWidth === '') {
        component.removeAttribute('width');
      } else {
        component.setAttribute('width', originalWidth);
      }
    }
  }

  private applyResponsiveWidth(): void {
    const components = document.querySelectorAll('seo-select, seo-select-search');

    components.forEach(component => {
      this.saveOriginalWidth(component);

      if (this.isMobile()) {
        component.setAttribute('width', '100%');
      } else {
        this.restoreOriginalWidth(component);
      }
    });
  }

  private handleNewComponents(components: Element[]): void {
    components.forEach(component => {
      this.saveOriginalWidth(component);

      if (this.isMobile()) {
        component.setAttribute('width', '100%');
      }
    });
  }

  public initialize(): void {
    this.applyResponsiveWidth();

    const debouncedApply = debounce(() => this.applyResponsiveWidth(), CONFIG.RESIZE_DEBOUNCE_TIMEOUT);

    window.addEventListener('resize', debouncedApply);
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.applyResponsiveWidth(), CONFIG.ORIENTATION_CHANGE_DELAY);
    });

    // 새로운 컴포넌트 감시
    const observer = new MutationObserver(mutations => {
      const newComponents: Element[] = [];

      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName === 'SEO-SELECT' || element.tagName === 'SEO-SELECT-SEARCH') {
              newComponents.push(element);
            } else if (element.querySelectorAll) {
              const selectComponents = element.querySelectorAll('seo-select, seo-select-search');
              newComponents.push(...Array.from(selectComponents));
            }
          }
        });
      });

      if (newComponents.length > 0) {
        setTimeout(() => this.handleNewComponents(newComponents), CONFIG.NEW_COMPONENT_DELAY);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}
