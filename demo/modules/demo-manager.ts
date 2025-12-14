/**
 * Demo 관리자 클래스
 */

import type { SeoSelectEvent } from './types';
import { DEMO_DATA } from './constants';
import { isSeoSelectElement } from './utils';
import { showNotification } from './notification';
import { addMultipleEventListeners, logSeoSelectEvent } from './event-helpers';
import { PageLoaderManager } from './page-loader';
import { ResponsiveWidthManager } from './responsive-manager';
import { GlobalEventManager } from './global-events';
import { printWelcomeMessage } from './welcome-message';

export class DemoManager {
  private eventCount = 0;
  private pageLoaderManager: PageLoaderManager;

  constructor() {
    this.pageLoaderManager = new PageLoaderManager();
    this.pageLoaderManager.initialize();

    this.initialize();
  }

  private initialize(): void {
    this.setupNavigation();
    this.setupBasicUsage();
    this.setupEventHandling();
    this.setupThemes();
    this.setupMultipleSelection();
    this.setupAdvancedFeatures();
    this.setupFormIntegration();
    this.setupResponsiveWidth();
    this.setupGlobalEventListeners();
    this.setupFrameworkTabs();

    showNotification('Documentation loaded successfully!');
    printWelcomeMessage();
  }

  private setupNavigation(): void {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.demo-section');

    navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetSection = (btn as HTMLElement).dataset.section;

        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        sections.forEach(section => {
          section.classList.remove('active');
          if (section.id === targetSection) {
            section.classList.add('active');
          }
        });
      });
    });
  }

  private setupBasicUsage(): void {
    const arraySelect = document.querySelector('seo-select[name="brand-alt"]');
    if (isSeoSelectElement(arraySelect)) {
      arraySelect.optionItems = DEMO_DATA.BRANDS;
      arraySelect.value = 'hyundai';
    }
  }

  private setupEventHandling(): void {
    const eventDemo = document.getElementById('event-demo');
    const eventLog = document.getElementById('event-log');

    if (!isSeoSelectElement(eventDemo) || !eventLog) return;

    const logEvent = (eventType: string, event: SeoSelectEvent): void => {
      this.eventCount++;
      const logEntry = document.createElement('div');
      logEntry.style.marginBottom = '4px';

      const countBadge = document.createElement('span');
      countBadge.textContent = `#${this.eventCount}`;
      countBadge.style.cssText = `
        background: #374151;
        color: #9ca3af;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 11px;
        margin-right: 8px;
        font-weight: bold;
      `;

      const content = document.createElement('span');
      logSeoSelectEvent(content, eventType, event);

      logEntry.appendChild(countBadge);
      logEntry.appendChild(content);
      eventLog.appendChild(logEntry);
      eventLog.scrollTop = eventLog.scrollHeight;
    };

    addMultipleEventListeners(eventDemo, {
      'onSelect': (event) => {
        logEvent('onSelect', event);
        console.log('Event Demo - Selected:', {
          label: event.label || event.detail?.label,
          value: event.value || event.detail?.value
        });
      },
      'onDeselect': (event) => {
        logEvent('onDeselect', event);
        console.log('Event Demo - Deselected:', {
          label: event.label || event.detail?.label,
          value: event.value || event.detail?.value
        });
      },
      'onReset': (event) => {
        logEvent('onReset', event);
        console.log('Event Demo - Reset:', event.detail || {
          label: event.label,
          value: event.value,
          values: event.values,
          labels: event.labels
        });
      },
      'onChange': (event) => {
        logEvent('onChange', event);
        const target = event.target as HTMLInputElement | null;
        console.log('Event Demo - Form Change:', target?.value);
      }
    });

    this.setupClearLogButton(eventLog);
  }

  private setupClearLogButton(eventLog: HTMLElement): void {
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear Log';
    clearBtn.style.cssText = `
      margin-top: 8px;
      padding: 4px 8px;
      background: #374151;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    `;
    clearBtn.addEventListener('click', () => {
      eventLog.innerHTML = '';
      this.eventCount = 0;
      showNotification('Event log cleared');
    });

    if (eventLog.parentNode) {
      eventLog.parentNode.appendChild(clearBtn);
    }
  }

  private setupThemes(): void {
    const darkMulti = document.querySelector('seo-select[name="dark-multi"]');
    if (isSeoSelectElement(darkMulti)) {
      darkMulti.selectedValues = DEMO_DATA.SKILLS.DARK_MULTI_SELECTED;
    }
  }

  private setupMultipleSelection(): void {
    this.setupSkillsSelect();
    this.setupMultilangSkillsSelect();
  }

  private setupSkillsSelect(): void {
    const multiSelect = document.querySelector('seo-select[name="skills"]');
    if (!isSeoSelectElement(multiSelect)) return;

    multiSelect.selectedValues = DEMO_DATA.SKILLS.DEFAULT_SELECTED;

    addMultipleEventListeners(multiSelect, {
      'onSelect': (event) => {
        const eventData = {
          label: event.label || event.detail?.label,
          value: event.value || event.detail?.value
        };
        console.log('Skills - Additional selection:', eventData);
        console.log('Skills - All current selections:', multiSelect.selectedValues);
        showNotification(`Added skill: ${eventData.label}`);
      },
      'onDeselect': (event) => {
        const eventData = {
          label: event.label || event.detail?.label,
          value: event.value || event.detail?.value
        };
        console.log('Skills - Deselected:', eventData);
        showNotification(`Removed skill: ${eventData.label}`);
      },
      'onReset': (event) => {
        console.log('Skills - Reset:', event.detail || event);
        showNotification('Skills reset to default');
      }
    });
  }

  private setupMultilangSkillsSelect(): void {
    const multiSearchSelect = document.querySelector('seo-select-search[name="multilang-skills"]');
    if (!isSeoSelectElement(multiSearchSelect)) return;

    addMultipleEventListeners(multiSearchSelect, {
      'onSelect': (event) => {
        const eventData = {
          label: event.label || event.detail?.label,
          value: event.value || event.detail?.value
        };
        console.log('Multilang Skills - Selected:', eventData);
        console.log('Multilang Skills - All selections:', multiSearchSelect.selectedValues);
        showNotification(`Selected: ${eventData.label}`);
      },
      'onDeselect': (event) => {
        const eventData = {
          label: event.label || event.detail?.label,
          value: event.value || event.detail?.value
        };
        console.log('Multilang Skills - Deselected:', eventData);
        showNotification(`Removed: ${eventData.label}`);
      },
      'onReset': (event) => {
        console.log('Multilang Skills - Reset:', event.detail || event);
        showNotification('Multilingual skills reset');
      }
    });
  }

  private setupAdvancedFeatures(): void {
    const noResetSelect = document.getElementById('no-reset');
    if (isSeoSelectElement(noResetSelect)) {
      noResetSelect.showReset = false;
    }

    const autoWidthSelect = document.querySelector('seo-select[name="auto-width-demo"]');
    if (isSeoSelectElement(autoWidthSelect)) {
      setTimeout(() => {
        autoWidthSelect.calculateAutoWidth?.();
      }, 1000);
    }
  }

  private setupFormIntegration(): void {
    const demoForm = document.getElementById('demo-form') as HTMLFormElement | null;
    const formResult = document.getElementById('form-result');

    if (!demoForm || !formResult) return;

    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);

      let result = '<h4>Form Submission Data:</h4>';
      let hasData = false;

      for (const [key, value] of formData.entries()) {
        result += `<div><strong>${key}:</strong> ${value}</div>`;
        hasData = true;
      }

      if (!hasData) {
        result += '<div style="color: #9ca3af; font-style: italic;">No data submitted.</div>';
      }

      formResult.innerHTML = result;
      showNotification('Form submitted successfully!');

      console.log('=== Form Submission Data ===');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
    });
  }

  private setupResponsiveWidth(): void {
    const responsiveManager = new ResponsiveWidthManager();
    responsiveManager.initialize();
  }

  private setupGlobalEventListeners(): void {
    const globalEventManager = new GlobalEventManager();
    globalEventManager.initialize();
  }

  private setupFrameworkTabs(): void {
    const tabs = document.querySelectorAll<HTMLButtonElement>('.framework-tab');
    const contents = document.querySelectorAll<HTMLElement>('.framework-content');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.framework;

        tabs.forEach((t) => t.classList.remove('active'));
        contents.forEach((c) => c.classList.remove('active'));

        tab.classList.add('active');

        const targetContent = document.getElementById(`${target}-content`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }
}
