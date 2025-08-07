// ==========================================
// Type Definitions
// ==========================================
interface LanguageNames {
  ko: string;
  en: string;
  ja: string;
  zh: string;
}

interface SampleLanguage {
  prefix: string;
  code: string;
}

interface OptionItem {
  value: string;
  label: string;
}

interface SeoSelectElement extends HTMLElement {
  optionItems: OptionItem[];
  value: string;
  selectedValues: string[];
  dark: boolean;
  showReset: boolean;
  name: string;
  id: string;
  setLanguage?: (lang: string) => void;
  calculateAutoWidth?: () => void;
  addSeoSelectEventListener?: (eventType: string, handler: (event: SeoSelectEvent) => void) => void;
  // 동적 메서드들 추가
  addOptions?: (options: OptionItem[], preserveSelection?: boolean) => void;
  addOption?: (option: OptionItem, index?: number) => void;
  clearOption?: (value: string) => void;
  clearAllOptions?: () => void;
  batchUpdateOptions?: (updates: Array<{
    action: 'add' | 'remove' | 'update';
    option?: OptionItem;
    value?: string;
    index?: number;
  }>) => void;
  loadOptionsForSearch?: (searchText: string, loader: (search: string) => Promise<OptionItem[]>) => Promise<void>;
  dataset: DOMStringMap & {
    eventListenersInitialized?: string;
  };
}

interface SeoSelectEvent extends Event {
  label?: string;
  value?: string;
  values?: string[];
  labels?: string[];
  detail?: {
    label?: string;
    value?: string;
    values?: string[];
    labels?: string[];
  };
}

interface EventHandlers {
  [key: string]: (event: SeoSelectEvent) => void;
}

// ==========================================
// Constants
// ==========================================
const CONFIG = {
  PAGE_LOAD_TIME: 2000,
  MOBILE_BREAKPOINT: 768,
  NOTIFICATION_DURATION: 3000,
  NOTIFICATION_FADE_DELAY: 300,
  RESIZE_DEBOUNCE_TIMEOUT: 100,
  ORIENTATION_CHANGE_DELAY: 300,
  NEW_COMPONENT_DELAY: 50,
} as const;

const ORIGINAL_WIDTH_KEY = 'data-original-width';

const LANGUAGE_NAMES: LanguageNames = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
};

const SAMPLE_LANGUAGES: SampleLanguage[] = [
  { prefix: '한국어', code: 'ko' },
  { prefix: '日本語', code: 'ja' },
  { prefix: '中文', code: 'zh' },
  { prefix: 'English', code: 'en' },
  { prefix: '混合語', code: 'mixed' },
];

const DEMO_DATA = {
  MULTILINGUAL: [
    { value: 'item1', label: '한국어 아이템 1' },
    { value: 'item2', label: '日本語アイテム 2' },
    { value: 'item3', label: '中文项目 3' },
    { value: 'item4', label: 'English Item 4' },
    { value: 'item5', label: '混合 Mixed アイテム 5' },
  ],
  BRANDS: [
    { value: 'kia', label: 'Kia Motors' },
    { value: 'hyundai', label: 'Hyundai Motor' },
    { value: 'bmw', label: 'BMW' },
    { value: 'benz', label: 'Mercedes-Benz' },
  ],
  SKILLS: {
    DEFAULT_SELECTED: ['js', 'ts', 'react'],
    DARK_MULTI_SELECTED: ['js', 'react'],
  },
} as const;

// ==========================================
// Utility Functions
// ==========================================
function isSeoSelectElement(element: Element | null): element is SeoSelectElement {
  return element !== null && (
    element.tagName === 'SEO-SELECT' || 
    element.tagName === 'SEO-SELECT-SEARCH'
  );
}

function isHTMLButtonElement(element: EventTarget | null): element is HTMLButtonElement {
  return element !== null && element instanceof HTMLButtonElement;
}

function debounce<T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// ==========================================
// Event Helper Functions
// ==========================================
function addSeoSelectListener(
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

function addMultipleEventListeners(
  element: SeoSelectElement, 
  eventHandlers: EventHandlers
): void {
  Object.entries(eventHandlers).forEach(([eventType, handler]) => {
    addSeoSelectListener(element, eventType, handler);
  });
}

function logSeoSelectEvent(
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

// ==========================================
// Notification System
// ==========================================
function showNotification(message: string): void {
  // Remove existing notifications
  document.querySelectorAll('.notification').forEach(notification => {
    notification.remove();
  });

  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    font-weight: 500;
    font-size: 14px;
    max-width: 300px;
  `;
  
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Hide notification
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, CONFIG.NOTIFICATION_FADE_DELAY);
  }, CONFIG.NOTIFICATION_DURATION);
}

// ==========================================
// Demo Functions
// ==========================================
namespace DemoActions {
  export function loadMultilingualData(): void {
    const select = document.getElementById('loading-demo');
    const btn = document.activeElement as HTMLButtonElement | null;

    if (!isSeoSelectElement(select) || !btn) return;

    btn.classList.add('loading');
    btn.disabled = true;

    setTimeout(() => {
      const additionalItems = Array.from({ length: 45 }, (_, i) => ({
        value: `item-${i + 6}`,
        label: `다국어 Multi-언어 Item ${i + 6}`,
      }));

      select.optionItems = [...DEMO_DATA.MULTILINGUAL, ...additionalItems];

      btn.classList.remove('loading');
      btn.disabled = false;
      btn.textContent = 'Data Loaded!';
      btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

      showNotification('Multilingual data loaded successfully!');
      console.log('Multilingual data loading complete');
    }, CONFIG.PAGE_LOAD_TIME);
  }

  export function loadLargeDataset(): void {
    const select = document.getElementById('large-multilang-search');
    const btn = document.activeElement as HTMLButtonElement | null;

    if (!isSeoSelectElement(select) || !btn) return;

    btn.classList.add('loading');
    btn.disabled = true;

    setTimeout(() => {
      select.optionItems = Array.from({ length: 10000 }, (_, i) => {
        const lang = SAMPLE_LANGUAGES[i % SAMPLE_LANGUAGES.length];
        const num = i.toString().padStart(4, '0');

        return {
          value: `item-${lang.code}-${num}`,
          label: `[${lang.prefix}] 기술 스택 ${num} (Tech Stack ${num})`,
        };
      });

      btn.classList.remove('loading');
      btn.disabled = false;
      btn.textContent = '10,000 Items Loaded!';
      btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

      showNotification('10,000 multilingual items loaded!');
      console.log('10,000 multilingual items loaded with virtual scrolling!');
    }, 1500);
  }

  export function toggleDarkMode(): void {
    const dynamicSelect = document.getElementById('dynamic-dark');
    if (!isSeoSelectElement(dynamicSelect)) return;

    dynamicSelect.dark = !dynamicSelect.dark;

    const btn = document.activeElement as HTMLButtonElement | null;
    if (btn) {
      btn.textContent = dynamicSelect.dark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }

    showNotification(`${dynamicSelect.dark ? 'Dark' : 'Light'} mode activated!`);
    console.log('Dynamic dark mode:', dynamicSelect.dark ? 'enabled' : 'disabled');
  }

  export function setLanguage(lang: keyof LanguageNames): void {
    const dynamicLangSelect = document.getElementById('dynamic-lang');
    if (!isSeoSelectElement(dynamicLangSelect) || !dynamicLangSelect.setLanguage) return;

    dynamicLangSelect.setLanguage(lang);
    showNotification(`Language changed to ${LANGUAGE_NAMES[lang]}`);
    console.log(`Language changed to: ${lang}`);
  }
}

// ==========================================
// Main Demo Setup
// ==========================================
class DemoManager {
  private eventCount = 0;

  constructor() {
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
    
    showNotification('Documentation loaded successfully!');
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
}

// ==========================================
// Responsive Width Manager
// ==========================================
class ResponsiveWidthManager {
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
    
    // Observe new components
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

// ==========================================
// Global Event Manager
// ==========================================
class GlobalEventManager {
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

// ==========================================
// Page Loader Manager
// ==========================================
class PageLoaderManager {
  public initialize(): void {
    const hasLoaded = sessionStorage.getItem('page-loaded');
    const pageLoader = document.querySelector('.page-loder') as HTMLElement | null;
    
    if (hasLoaded && pageLoader) {
      pageLoader.style.display = 'none';
      return;
    }

    if (pageLoader) {
      setTimeout(() => {
        pageLoader.classList.add('hide');
        
        const handleAnimationEnd = () => {
          pageLoader.classList.add('full-hide');
          sessionStorage.setItem('page-loaded', 'true');
          pageLoader.removeEventListener('animationend', handleAnimationEnd);
        };
        
        pageLoader.addEventListener('animationend', handleAnimationEnd);
      }, CONFIG.PAGE_LOAD_TIME);
    }
  }
}

// ==========================================
// Console Welcome Message
// ==========================================
function printWelcomeMessage(): void {
  console.log(`
🎯 SEO Select Components Documentation  
=========================================
Advanced multilingual select components with enterprise features

🔍 Key Features:
• Semantic HTML with SEO optimization
• Enhanced event system with type safety
• Multilingual search (Korean 초성, Japanese romaji, Chinese pinyin)
• Theme system with dark mode support
• Multiple selection with tag management
• Virtual scrolling for large datasets (10,000+ items)
• Full keyboard navigation and accessibility
• Form integration with validation
• Internationalization (i18n) support
• Custom text configuration
• Event-driven architecture with improved performance

💡 Navigation Tips:
• Use Alt+1-5 for quick section switching
• All interactions are logged in console with enhanced details
• Try multilingual search: ㅎㄱ, にほんご, zhongwen
• Check event logs for detailed debugging
• New event system provides better type safety and performance

🆕 Event System Updates:
• Event classes with direct property access (event.label, event.value)
• Backward compatibility with detail-based events
• Enhanced event logging and debugging
• Type-safe event listeners

📚 This documentation demonstrates production-ready components suitable for enterprise applications.
`);
}

// ==========================================
// Dynamic Demo Actions (Separated for clarity)
// ==========================================
namespace DynamicDemoActions {
  const TECH_STACK_OPTIONS: OptionItem[] = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'nuxt', label: 'Nuxt.js' },
    { value: 'gatsby', label: 'Gatsby' },
    { value: 'remix', label: 'Remix' }
  ];

  const LANGUAGE_OPTIONS: OptionItem[] = [
    { value: 'js', label: 'JavaScript' },
    { value: 'ts', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'kotlin', label: 'Kotlin' }
  ];

  const FRAMEWORK_OPTIONS: OptionItem[] = [
    { value: 'express', label: 'Express.js' },
    { value: 'fastify', label: 'Fastify' },
    { value: 'nestjs', label: 'NestJS' },
    { value: 'django', label: 'Django' },
    { value: 'flask', label: 'Flask' },
    { value: 'spring', label: 'Spring Boot' },
    { value: 'dotnet', label: '.NET Core' }
  ];

  const USER_DATA: OptionItem[] = [
    { value: 'user1', label: 'Alice Johnson (Frontend Developer)' },
    { value: 'user2', label: 'Bob Smith (Backend Engineer)' },
    { value: 'user3', label: 'Carol Davis (Full Stack Developer)' },
    { value: 'user4', label: 'David Wilson (DevOps Engineer)' },
    { value: 'user5', label: 'Emma Brown (UI/UX Designer)' },
    { value: 'user6', label: 'Frank Miller (Data Scientist)' }
  ];

  const COUNTRY_DATA: OptionItem[] = [
    { value: 'kr', label: '🇰🇷 South Korea (대한민국)' },
    { value: 'jp', label: '🇯🇵 Japan (日本)' },
    { value: 'us', label: '🇺🇸 United States' },
    { value: 'cn', label: '🇨🇳 China (中国)' },
    { value: 'de', label: '🇩🇪 Germany (Deutschland)' },
    { value: 'fr', label: '🇫🇷 France (France)' },
    { value: 'gb', label: '🇬🇧 United Kingdom' },
    { value: 'ca', label: '🇨🇦 Canada' }
  ];

  function getElement(id: string): SeoSelectElement | null {
    const element = document.getElementById(id);
    return isSeoSelectElement(element) ? element : null;
  }

  function updateAsyncStatus(message: string, type: 'loading' | 'success' | 'error' = 'loading'): void {
    const status = document.getElementById('async-status');
    if (status) {
      status.textContent = message;
      status.className = `async-status ${type}`;
    }
  }

  function addPerformanceMetric(label: string, value: string, type: 'normal' | 'warning' | 'error' = 'normal'): void {
    const metrics = document.getElementById('performance-metrics');
    if (metrics) {
      const row = document.createElement('div');
      row.className = 'metric-row';
      row.innerHTML = `
        <span class="metric-label">${label}:</span>
        <span class="metric-value ${type}">${value}</span>
      `;
      metrics.appendChild(row);
      metrics.scrollTop = metrics.scrollHeight;
    }
  }

  function simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Async helper for button states
  async function withButtonLoading<T>(
    btn: HTMLButtonElement | null, 
    operation: () => Promise<T>,
    successText?: string
  ): Promise<T> {
    if (!btn) throw new Error('Button not found');

    btn.classList.add('loading');
    btn.disabled = true;

    try {
      const result = await operation();
      
      if (successText) {
        btn.classList.remove('loading');
        btn.classList.add('success');
        btn.disabled = false;
        btn.textContent = successText;
        
        setTimeout(() => {
          btn.classList.remove('success');
          btn.textContent = btn.getAttribute('data-original-text') || 'Load Data';
        }, 2000);
      }

      return result;
    } catch (error) {
      btn.classList.remove('loading');
      btn.classList.add('error');
      btn.disabled = false;
      throw error;
    }
  }

  // Main demo functions
  export async function loadTechStack(): Promise<void> {
    const select = getElement('batch-demo');
    const btn = document.activeElement as HTMLButtonElement | null;
    
    if (!select) return;

    await withButtonLoading(btn, async () => {
      await simulateDelay(800);
      
      if (select.addOptions) {
        select.addOptions(TECH_STACK_OPTIONS, true);
      } else {
        select.optionItems = TECH_STACK_OPTIONS;
      }
    }, 'Tech Stack Loaded!');

    showNotification('Tech stack options loaded successfully!');
    console.log('Dynamic Demo: Tech stack loaded', TECH_STACK_OPTIONS);
  }

  export async function loadLanguages(): Promise<void> {
    const select = getElement('batch-demo');
    const btn = document.activeElement as HTMLButtonElement | null;
    
    if (!select) return;

    await withButtonLoading(btn, async () => {
      await simulateDelay(600);
      
      if (select.addOptions) {
        select.addOptions(LANGUAGE_OPTIONS, true);
      } else {
        select.optionItems = LANGUAGE_OPTIONS;
      }
    }, 'Languages Loaded!');

    showNotification('Programming languages loaded!');
    console.log('Dynamic Demo: Languages loaded', LANGUAGE_OPTIONS);
  }

  export async function loadFrameworks(): Promise<void> {
    const select = getElement('batch-demo');
    const btn = document.activeElement as HTMLButtonElement | null;
    
    if (!select) return;

    await withButtonLoading(btn, async () => {
      await simulateDelay(700);
      
      if (select.addOptions) {
        select.addOptions(FRAMEWORK_OPTIONS, true);
      } else {
        select.optionItems = FRAMEWORK_OPTIONS;
      }
    }, 'Frameworks Loaded!');

    showNotification('Framework options loaded!');
    console.log('Dynamic Demo: Frameworks loaded', FRAMEWORK_OPTIONS);
  }

  export function clearAllOptions(selectId: string): void {
    const select = getElement(selectId);
    if (!select) return;

    if (select.clearAllOptions) {
      select.clearAllOptions();
    } else {
      select.optionItems = [];
    }

    showNotification('All options cleared');
    console.log(`Dynamic Demo: Cleared all options for ${selectId}`);
  }

  export function addCustomOption(): void {
    const select = getElement('individual-demo');
    const valueInput = document.getElementById('new-option-value') as HTMLInputElement | null;
    const labelInput = document.getElementById('new-option-label') as HTMLInputElement | null;

    if (!select || !valueInput || !labelInput) return;

    const value = valueInput.value.trim();
    const label = labelInput.value.trim();

    if (!value || !label) {
      showNotification('Please enter both value and label');
      return;
    }

    const newOption = { value, label };

    if (select.addOption) {
      select.addOption(newOption);
    } else {
      const currentOptions = select.optionItems || [];
      select.optionItems = [...currentOptions, newOption];
    }

    valueInput.value = '';
    labelInput.value = '';

    showNotification(`Added option: ${label}`);
    console.log('Dynamic Demo: Added custom option', newOption);
  }

  export function removeOption(): void {
    const select = getElement('individual-demo');
    const valueInput = document.getElementById('remove-option-value') as HTMLInputElement | null;

    if (!select || !valueInput) return;

    const value = valueInput.value.trim();
    if (!value) {
      showNotification('Please enter a value to remove');
      return;
    }

    if (select.clearOption) {
      select.clearOption(value);
    } else {
      const currentOptions = select.optionItems || [];
      select.optionItems = currentOptions.filter(opt => opt.value !== value);
    }

    valueInput.value = '';
    showNotification(`Removed option: ${value}`);
    console.log('Dynamic Demo: Removed option', value);
  }

  export async function loadUserData(): Promise<void> {
    const select = getElement('async-demo');
    if (!select) return;

    updateAsyncStatus('Loading user data...', 'loading');

    try {
      await simulateDelay(1200);

      if (select.addOptions) {
        select.addOptions(USER_DATA, true);
      } else {
        select.optionItems = USER_DATA;
      }

      updateAsyncStatus('User data loaded successfully', 'success');
      showNotification('User data loaded!');
      console.log('Dynamic Demo: User data loaded', USER_DATA);
    } catch (error) {
      updateAsyncStatus('Failed to load user data', 'error');
      console.error('Dynamic Demo: Error loading user data', error);
    }
  }

  export async function loadCountryData(): Promise<void> {
    const select = getElement('async-demo');
    if (!select) return;

    updateAsyncStatus('Loading country data...', 'loading');

    try {
      await simulateDelay(900);

      if (select.addOptions) {
        select.addOptions(COUNTRY_DATA, true);
      } else {
        select.optionItems = COUNTRY_DATA;
      }

      updateAsyncStatus('Country data loaded successfully', 'success');
      showNotification('Country data loaded!');
      console.log('Dynamic Demo: Country data loaded', COUNTRY_DATA);
    } catch (error) {
      updateAsyncStatus('Failed to load country data', 'error');
      console.error('Dynamic Demo: Error loading country data', error);
    }
  }

  export async function simulateApiError(): Promise<void> {
    updateAsyncStatus('Attempting to load data...', 'loading');

    try {
      await simulateDelay(1500);
      throw new Error('Simulated API error');
    } catch (error) {
      updateAsyncStatus('API Error: Failed to load data (simulated)', 'error');
      showNotification('API error simulated');
      console.log('Dynamic Demo: Simulated API error');
    }
  }

  export async function loadIncrementalData(): Promise<void> {
    const select = getElement('async-demo');
    if (!select) return;

    updateAsyncStatus('Loading incremental data...', 'loading');

    try {
      await simulateDelay(800);

      const currentOptions = select.optionItems || [];
      const newOptions = [
        ...currentOptions,
        { value: `item-${Date.now()}`, label: `New Item ${currentOptions.length + 1}` },
        { value: `item-${Date.now() + 1}`, label: `New Item ${currentOptions.length + 2}` },
        { value: `item-${Date.now() + 2}`, label: `New Item ${currentOptions.length + 3}` }
      ];

      if (select.addOptions) {
        select.addOptions(newOptions, true);
      } else {
        select.optionItems = newOptions;
      }

      updateAsyncStatus(`Added 3 more items (total: ${newOptions.length})`, 'success');
      showNotification('Incremental data loaded!');
      console.log('Dynamic Demo: Incremental data loaded');
    } catch (error) {
      updateAsyncStatus('Failed to load incremental data', 'error');
      console.error('Dynamic Demo: Error loading incremental data', error);
    }
  }

  export async function performanceTest1K(): Promise<void> {
    const select = getElement('performance-demo');
    if (!select) return;

    const startTime = performance.now();
    
    const options = Array.from({ length: 1000 }, (_, i) => ({
      value: `item-${i}`,
      label: `Performance Test Item ${i + 1}`
    }));

    if (select.addOptions) {
      select.addOptions(options, false);
    } else {
      select.optionItems = options;
    }

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);

    addPerformanceMetric('Load 1K Items', `${duration}ms`, Number(duration) > 100 ? 'warning' : 'normal');
    showNotification(`Loaded 1,000 items in ${duration}ms`);
    console.log(`Dynamic Demo: Performance test 1K - ${duration}ms`);
  }

  export async function performanceTest10K(): Promise<void> {
    const select = getElement('performance-demo');
    if (!select) return;

    const startTime = performance.now();
    
    const options = Array.from({ length: 10000 }, (_, i) => ({
      value: `item-${i}`,
      label: `Large Dataset Item ${i + 1} - Performance Test`
    }));

    if (select.addOptions) {
      select.addOptions(options, false);
    } else {
      select.optionItems = options;
    }

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);

    addPerformanceMetric('Load 10K Items', `${duration}ms`, Number(duration) > 500 ? 'error' : Number(duration) > 200 ? 'warning' : 'normal');
    showNotification(`Loaded 10,000 items in ${duration}ms`);
    console.log(`Dynamic Demo: Performance test 10K - ${duration}ms`);
  }

  export async function performanceTestUpdates(): Promise<void> {
    const select = getElement('performance-demo');
    if (!select) return;

    const iterations = 50;
    const startTime = performance.now();

    for (let i = 0; i < iterations; i++) {
      const options = Array.from({ length: 10 }, (_, j) => ({
        value: `rapid-${i}-${j}`,
        label: `Rapid Update ${i + 1}-${j + 1}`
      }));

      if (select.addOptions) {
        select.addOptions(options, false);
      } else {
        select.optionItems = options;
      }

      await simulateDelay(20);
    }

    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    const avgPerUpdate = (parseFloat(duration) / iterations).toFixed(2);

    addPerformanceMetric('Rapid Updates', `${iterations} updates in ${duration}ms`, 'normal');
    addPerformanceMetric('Avg per Update', `${avgPerUpdate}ms`, parseFloat(avgPerUpdate) > 10 ? 'warning' : 'normal');
    
    showNotification(`Completed ${iterations} rapid updates`);
    console.log(`Dynamic Demo: Rapid updates test - ${duration}ms total, ${avgPerUpdate}ms average`);
  }

  export function clearPerformanceDemo(): void {
    const select = getElement('performance-demo');
    const metrics = document.getElementById('performance-metrics');
    
    if (select) {
      if (select.clearAllOptions) {
        select.clearAllOptions();
      } else {
        select.optionItems = [];
      }
    }

    if (metrics) {
      metrics.innerHTML = '';
    }

    showNotification('Performance demo cleared');
    console.log('Dynamic Demo: Performance demo cleared');
  }
}

// ==========================================
// Framework Text Animator TypeScript
// ==========================================

interface FrameworkConfig {
  selector: string;
  text: string;
  color: string;
  displayDuration: number;
}

interface AnimationConfig {
  cycleDuration: number;
  transitionDuration: number;
  pauseOnHover: boolean;
  enableKeyboardNavigation: boolean;
  enableClickNavigation: boolean;
  performanceMode: 'high' | 'medium' | 'low' | 'auto';
}

interface DeviceCapabilities {
  cores: number;
  memory: number;
  isMobile: boolean;
  prefersReducedMotion: boolean;
}

class FrameworkTextAnimator {
  private texts: NodeListOf<HTMLElement>;
  private container: HTMLElement | null;
  private currentIndex: number = 0;
  private isAnimating: boolean = false;
  private isPaused: boolean = false;
  private intervalId: number | null = null;
  private config: AnimationConfig;
  private frameworks: FrameworkConfig[];
  private deviceCapabilities: DeviceCapabilities;

  constructor(config: Partial<AnimationConfig> = {}) {
    // Default configuration
    this.config = {
      cycleDuration: 3000,
      transitionDuration: 600,
      pauseOnHover: true,
      enableKeyboardNavigation: true,
      enableClickNavigation: true,
      performanceMode: 'auto',
      ...config
    };

    // Framework configurations
    this.frameworks = [
      {
        selector: 'javascript',
        text: 'JavaScript',
        color: '#F7DF1E',
        displayDuration: this.config.cycleDuration
      },
      {
        selector: 'react',
        text: 'React',
        color: '#61DAFB',
        displayDuration: this.config.cycleDuration
      },
      {
        selector: 'typescript',
        text: 'TypeScript',
        color: '#3178C6',
        displayDuration: this.config.cycleDuration
      }
    ];

    this.texts = document.querySelectorAll('.framework-text');
    this.container = document.querySelector('.framework-text-container');
    this.deviceCapabilities = this.detectDeviceCapabilities();

    this.initialize();
  }

  private detectDeviceCapabilities(): DeviceCapabilities {
    return {
      cores: navigator.hardwareConcurrency || 2,
      memory: (navigator as any).deviceMemory || 4,
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent),
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };
  }

  private initialize(): void {
    if (!this.container || this.texts.length === 0) {
      console.warn('FrameworkTextAnimator: Required elements not found');
      return;
    }

    this.optimizePerformanceMode();
    this.setupEventListeners();
    this.setupAccessibility();
    this.startAnimation();

    // Remove loading class after setup
    requestAnimationFrame(() => {
      this.container?.classList.remove('loading');
    });
  }

  private optimizePerformanceMode(): void {
    if (this.config.performanceMode === 'auto') {
      if (this.deviceCapabilities.prefersReducedMotion) {
        this.config.performanceMode = 'low';
      } else if (this.isSlowDevice()) {
        this.config.performanceMode = 'medium';
      } else {
        this.config.performanceMode = 'high';
      }
    }

    // Apply performance mode to container
    this.container?.setAttribute('data-performance', this.config.performanceMode);
    
    // Adjust transition duration based on performance
    if (this.config.performanceMode === 'low') {
      this.config.transitionDuration = 400;
    } else if (this.config.performanceMode === 'medium') {
      this.config.transitionDuration = 500;
    }
  }

  private isSlowDevice(): boolean {
    const { cores, memory, isMobile } = this.deviceCapabilities;
    return cores < 4 || (isMobile && memory < 4);
  }

  private setupEventListeners(): void {
    if (!this.container) return;

    // Hover events
    if (this.config.pauseOnHover) {
      this.container.addEventListener('mouseenter', () => this.pauseAnimation());
      this.container.addEventListener('mouseleave', () => this.resumeAnimation());
    }

    // Focus events for accessibility
    this.container.addEventListener('focusin', () => this.pauseAnimation());
    this.container.addEventListener('focusout', () => this.resumeAnimation());

    // Click navigation
    if (this.config.enableClickNavigation) {
      this.texts.forEach((text, index) => {
        text.style.cursor = 'pointer';
        text.addEventListener('click', (e) => {
          e.preventDefault();
          this.navigateToIndex(index);
        });
      });
    }

    // Keyboard navigation
    if (this.config.enableKeyboardNavigation) {
      this.container.addEventListener('keydown', (e) => this.handleKeydown(e));
      this.makeContainerFocusable();
    }

    // Media query listeners
    this.setupMediaQueryListeners();

    // Visibility API
    this.setupVisibilityHandler();
  }

  private setupAccessibility(): void {
    if (!this.container) return;

    // Add ARIA attributes
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-label', 'Supported frameworks rotation');
    this.container.setAttribute('aria-describedby', 'framework-description');

    // Create screen reader description
    this.createScreenReaderElements();
  }

  private createScreenReaderElements(): void {
    const description = document.createElement('div');
    description.id = 'framework-description';
    description.className = 'sr-only';
    description.textContent = 'Automatically rotating list of supported frameworks. Use arrow keys to navigate or press space to pause.';
    
    const instructions = document.createElement('div');
    instructions.className = 'sr-only';
    instructions.textContent = 'Press arrow keys to navigate, space to pause, or click to select specific framework.';
    
    this.container?.appendChild(description);
    this.container?.appendChild(instructions);
  }

  private makeContainerFocusable(): void {
    if (this.container && !this.container.hasAttribute('tabindex')) {
      this.container.setAttribute('tabindex', '0');
    }
  }

  private setupMediaQueryListeners(): void {
    // Reduced motion preference changes
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionQuery.addEventListener('change', () => {
      this.deviceCapabilities.prefersReducedMotion = reducedMotionQuery.matches;
      this.optimizePerformanceMode();
      
      if (reducedMotionQuery.matches) {
        this.pauseAnimation();
      } else {
        this.resumeAnimation();
      }
    });
  }

  private setupVisibilityHandler(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimation();
      } else {
        this.resumeAnimation();
      }
    });
  }

  private handleKeydown(e: KeyboardEvent): void {
    if (!this.config.enableKeyboardNavigation) return;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        this.navigateToPrevious();
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        this.navigateToNext();
        break;
      case 'Home':
        e.preventDefault();
        this.navigateToIndex(0);
        break;
      case 'End':
        e.preventDefault();
        this.navigateToIndex(this.texts.length - 1);
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        this.togglePause();
        break;
    }
  }

  private startAnimation(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = window.setInterval(() => {
      if (!this.isAnimating && !this.isPaused) {
        this.navigateToNext();
      }
    }, this.config.cycleDuration);
  }

  private pauseAnimation(): void {
    this.isPaused = true;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private resumeAnimation(): void {
    if (this.isPaused) {
      this.isPaused = false;
      this.startAnimation();
    }
  }

  private togglePause(): void {
    if (this.isPaused) {
      this.resumeAnimation();
    } else {
      this.pauseAnimation();
    }
  }

  private navigateToNext(): void {
    if (this.isAnimating) return;
    const nextIndex = (this.currentIndex + 1) % this.texts.length;
    this.animateToIndex(nextIndex);
  }

  private navigateToPrevious(): void {
    if (this.isAnimating) return;
    const prevIndex = this.currentIndex === 0 ? this.texts.length - 1 : this.currentIndex - 1;
    this.animateToIndex(prevIndex);
  }

  private navigateToIndex(targetIndex: number): void {
    if (this.isAnimating || targetIndex === this.currentIndex || 
        targetIndex < 0 || targetIndex >= this.texts.length) {
      return;
    }
    this.animateToIndex(targetIndex);
  }

  private animateToIndex(targetIndex: number): void {
    if (this.isAnimating) return;

    this.isAnimating = true;
    const currentText = this.texts[this.currentIndex];
    const nextText = this.texts[targetIndex];

    // Start smooth transition
    this.startSmoothTransition(currentText, nextText);

    // Update index and announce change
    this.currentIndex = targetIndex;
    this.announceChange(nextText);

    // Reset animation state
    setTimeout(() => {
      this.isAnimating = false;
    }, this.config.transitionDuration + 100);
  }

  private startSmoothTransition(currentText: HTMLElement, nextText: HTMLElement): void {
    // Phase 1: Fade out current text
    currentText.classList.add('leaving');
    currentText.classList.remove('active');

    // Phase 2: Prepare next text
    this.prepareNextText(nextText);

    // Phase 3: Smooth transition
    setTimeout(() => {
      this.hideAllTexts();
      this.showNextText(nextText);
    }, this.config.transitionDuration / 2);
  }

  private prepareNextText(nextText: HTMLElement): void {
    nextText.style.opacity = '0';
    nextText.style.transform = 'translateY(10px) scale(0.95)';
  }

  private hideAllTexts(): void {
    this.texts.forEach(text => {
      text.classList.remove('active', 'leaving');
      text.style.opacity = '0';
      text.style.transform = 'translateY(0) scale(1)';
    });
  }

  private showNextText(nextText: HTMLElement): void {
    nextText.classList.add('active');
    
    // Smooth fade in animation
    requestAnimationFrame(() => {
      nextText.style.transition = `all ${this.config.transitionDuration / 2}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      nextText.style.opacity = '1';
      nextText.style.transform = 'translateY(0) scale(1)';
    });
  }

  private announceChange(element: HTMLElement): void {
    let announcer = document.getElementById('framework-announcer') as HTMLElement;
    
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'framework-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(announcer);
    }

    announcer.textContent = `SEO Select for ${element.textContent}`;
  }

  // Public API methods
  public goToIndex(index: number): void {
    this.navigateToIndex(index);
  }

  public pause(): void {
    this.pauseAnimation();
  }

  public resume(): void {
    this.resumeAnimation();
  }

  public destroy(): void {
    this.pauseAnimation();
    
    // Remove event listeners by cloning nodes
    this.texts.forEach(text => {
      text.style.cursor = '';
      const newText = text.cloneNode(true) as HTMLElement;
      text.parentNode?.replaceChild(newText, text);
    });

    if (this.container) {
      const newContainer = this.container.cloneNode(true) as HTMLElement;
      this.container.parentNode?.replaceChild(newContainer, this.container);
    }

    // Clean up announcer
    const announcer = document.getElementById('framework-announcer');
    announcer?.remove();
  }

  public updateConfig(newConfig: Partial<AnimationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.cycleDuration) {
      this.startAnimation();
    }
    
    if (newConfig.performanceMode) {
      this.optimizePerformanceMode();
    }
  }

  public getCurrentFramework(): FrameworkConfig | null {
    const currentText = this.texts[this.currentIndex];
    if (!currentText) return null;

    return this.frameworks.find(fw => 
      currentText.classList.contains(fw.selector)
    ) || null;
  }

  public getAllFrameworks(): FrameworkConfig[] {
    return [...this.frameworks];
  }

  public getPerformanceInfo(): object {
    return {
      performanceMode: this.config.performanceMode,
      deviceCapabilities: this.deviceCapabilities,
      currentIndex: this.currentIndex,
      totalFrameworks: this.texts.length,
      isAnimating: this.isAnimating,
      isPaused: this.isPaused,
      config: { ...this.config }
    };
  }
}

// ==========================================
// Animation Manager
// ==========================================
class FrameworkAnimationManager {
  private animator: FrameworkTextAnimator | null = null;

  public initialize(): void {
    if (this.animator) {
      this.animator.destroy();
    }

    const config = this.createOptimalConfig();
    this.animator = new FrameworkTextAnimator(config);

    // Make globally accessible for debugging
    (window as any).frameworkAnimator = this.animator;
  }

  private createOptimalConfig(): Partial<AnimationConfig> {
    const config: Partial<AnimationConfig> = {
      cycleDuration: 3000,
      transitionDuration: 600,
      pauseOnHover: true,
      enableKeyboardNavigation: true,
      enableClickNavigation: true,
      performanceMode: 'auto'
    };

    // Override config based on URL parameters for testing
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('animation-speed')) {
      const speed = urlParams.get('animation-speed');
      if (speed === 'fast') {
        config.cycleDuration = 1500;
        config.transitionDuration = 300;
      } else if (speed === 'slow') {
        config.cycleDuration = 5000;
        config.transitionDuration = 900;
      }
    }

    if (urlParams.has('performance')) {
      const performance = urlParams.get('performance') as 'high' | 'medium' | 'low';
      if (['high', 'medium', 'low'].includes(performance)) {
        config.performanceMode = performance;
      }
    }

    return config;
  }

  public getAnimator(): FrameworkTextAnimator | null {
    return this.animator;
  }
}

// ==========================================
// Utility Functions
// ==========================================
function createFrameworkConfig(
  selector: string,
  text: string,
  color: string,
  displayDuration: number = 3000
): FrameworkConfig {
  return { selector, text, color, displayDuration };
}

function validateFrameworkConfig(config: FrameworkConfig): boolean {
  return !!(
    config.selector &&
    config.text &&
    config.color &&
    typeof config.displayDuration === 'number' &&
    config.displayDuration > 0
  );
}

function monitorAnimationPerformance(): void {
  if (!window.performance || !window.PerformanceObserver) return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name.includes('framework') || entry.name.includes('animation')) {
        console.log('Framework Animation Performance:', {
          name: entry.name,
          duration: entry.duration,
          startTime: entry.startTime
        });
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['measure', 'navigation'] });
  } catch (error) {
    console.warn('Performance monitoring not supported:', error);
  }
}

function enhanceAccessibility(): void {
  const container = document.querySelector('.framework-text-container') as HTMLElement;
  if (!container) return;

  // Add ARIA labels if not already present
  if (!container.hasAttribute('role')) {
    container.setAttribute('role', 'region');
  }
  
  if (!container.hasAttribute('aria-label')) {
    container.setAttribute('aria-label', 'Supported frameworks rotation');
  }

  // Ensure proper keyboard navigation
  container.addEventListener('focus', () => {
    container.style.outline = '2px solid rgba(97, 218, 251, 0.5)';
    container.style.outlineOffset = '4px';
  });

  container.addEventListener('blur', () => {
    container.style.outline = '';
    container.style.outlineOffset = '';
  });
}

function integrateWithThemeSystem(): void {
  const themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        const animationManager = (window as any).frameworkAnimationManager as FrameworkAnimationManager;
        const animator = animationManager?.getAnimator();
        
        if (animator) {
          const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
          animator.updateConfig({
            performanceMode: isDark ? 'medium' : 'high'
          });
        }
      }
    });
  });

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme', 'class']
  });
}

// ==========================================
// Global Setup and Initialization
// ==========================================
let frameworkAnimationManager: FrameworkAnimationManager | null = null;

function initializeFrameworkAnimator(): void {
  frameworkAnimationManager = new FrameworkAnimationManager();
  frameworkAnimationManager.initialize();
  
  // Make globally accessible
  (window as any).frameworkAnimationManager = frameworkAnimationManager;
}

function setupUtilities(): void {
  enhanceAccessibility();
  integrateWithThemeSystem();
  
  // Optional performance monitoring in development
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    monitorAnimationPerformance();
  }
}

// Make utilities globally available
(window as any).FrameworkAnimatorUtils = {
  createFrameworkConfig,
  validateFrameworkConfig,
  monitorAnimationPerformance,
  enhanceAccessibility,
  integrateWithThemeSystem
};

// ==========================================
// Auto-initialization
// ==========================================
function initialize(): void {
  initializeFrameworkAnimator();
  setupUtilities();
}

// DOM ready check
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// ==========================================
// Global Exports and Initialization
// ==========================================
declare global {
  interface Window {
    DemoActions: typeof DemoActions;
    DynamicDemoActions: typeof DynamicDemoActions;
    FrameworkTextAnimator: typeof FrameworkTextAnimator;
    FrameworkAnimationManager: typeof FrameworkAnimationManager;
    frameworkAnimationManager: FrameworkAnimationManager | null;
    frameworkAnimator: FrameworkTextAnimator | null;
    FrameworkAnimatorUtils: {
      createFrameworkConfig: typeof createFrameworkConfig;
      validateFrameworkConfig: typeof validateFrameworkConfig;
      monitorAnimationPerformance: typeof monitorAnimationPerformance;
      enhanceAccessibility: typeof enhanceAccessibility;
      integrateWithThemeSystem: typeof integrateWithThemeSystem;
    };
  }
}

// Make available globally
window.DemoActions = DemoActions;
window.DynamicDemoActions = DynamicDemoActions;
window.FrameworkTextAnimator = FrameworkTextAnimator;
window.FrameworkAnimationManager = FrameworkAnimationManager;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new DemoManager();
  new PageLoaderManager().initialize();
  printWelcomeMessage();
});