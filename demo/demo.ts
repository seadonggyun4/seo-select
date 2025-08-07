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
// Page Loader Manager (개선된 버전)
// ==========================================
class PageLoaderManager {
  private readonly LOADER_TIMEOUT = 5000; // 최대 5초 대기

  public initialize(): void {
    const hasLoaded = sessionStorage.getItem('page-loaded');
    const pageLoader = document.querySelector('.page-loder') as HTMLElement | null;
    
    if (!pageLoader) {
      console.warn('Page loader element not found');
      return;
    }

    // 이미 로드된 적이 있다면 즉시 숨김
    if (hasLoaded) {
      this.hideLoader(pageLoader, true);
      return;
    }

    // 로딩 애니메이션 시작
    this.startLoadingAnimation(pageLoader);
  }

  private startLoadingAnimation(pageLoader: HTMLElement): void {
    // 최소 로딩 시간과 실제 컴포넌트 로딩 완료 시점 중 늦은 시점에 숨김
    Promise.all([
      this.waitForMinimumTime(),
      this.waitForComponentsReady()
    ]).then(() => {
      this.hideLoader(pageLoader, false);
    }).catch((error) => {
      console.error('Loading error:', error);
      // 에러가 발생해도 최대 시간 후에는 로더를 숨김
      setTimeout(() => this.hideLoader(pageLoader, false), this.LOADER_TIMEOUT);
    });
  }

  private waitForMinimumTime(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, 1500); // 최소 1.5초 대기
    });
  }

  private async waitForComponentsReady(): Promise<void> {
    // Web Components가 로드될 때까지 대기
    await this.waitForWebComponents();
    
    // DOM이 완전히 준비될 때까지 대기
    await this.waitForDOMReady();
    
    // 중요한 요소들이 렌더링될 때까지 대기
    await this.waitForCriticalElements();
  }

  private waitForWebComponents(): Promise<void> {
    return new Promise((resolve) => {
      const checkComponents = () => {
        const seoSelectDefined = customElements.get('seo-select');
        const seoSelectSearchDefined = customElements.get('seo-select-search');
        
        if (seoSelectDefined && seoSelectSearchDefined) {
          resolve();
        } else {
          setTimeout(checkComponents, 100);
        }
      };
      
      checkComponents();
      
      // 최대 3초 대기 후 타임아웃
      setTimeout(() => {
        console.warn('Web Components loading timeout');
        resolve();
      }, 3000);
    });
  }

  private waitForDOMReady(): Promise<void> {
    return new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', () => resolve(), { once: true });
        
        // 최대 2초 대기 후 타임아웃
        setTimeout(() => {
          console.warn('DOM ready timeout');
          resolve();
        }, 2000);
      }
    });
  }

  private waitForCriticalElements(): Promise<void> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const checkElements = () => {
        // 중요한 요소들이 존재하는지 확인
        const headerDemo = document.querySelector('seo-select-search[name="welcome"]');
        const demoNav = document.querySelector('.demo-nav');
        const content = document.querySelector('.content');
        
        if (headerDemo && demoNav && content) {
          // 추가로 요소들이 실제로 렌더링되었는지 확인
          requestAnimationFrame(() => {
            resolve();
          });
        } else {
          // 최대 2초 대기
          if (Date.now() - startTime > 2000) {
            console.warn('Critical elements timeout');
            resolve();
          } else {
            setTimeout(checkElements, 100);
          }
        }
      };
      
      checkElements();
    });
  }

  private hideLoader(pageLoader: HTMLElement, immediate: boolean = false): void {
    if (immediate) {
      pageLoader.style.display = 'none';
      sessionStorage.setItem('page-loaded', 'true');
      return;
    }

    pageLoader.classList.add('hide');
    
    const handleAnimationEnd = () => {
      pageLoader.classList.add('full-hide');
      pageLoader.style.display = 'none';
      sessionStorage.setItem('page-loaded', 'true');
      pageLoader.removeEventListener('animationend', handleAnimationEnd);
    };
    
    pageLoader.addEventListener('animationend', handleAnimationEnd);
    
    // 애니메이션이 실행되지 않을 경우를 대비한 fallback
    setTimeout(() => {
      if (!pageLoader.classList.contains('full-hide')) {
        console.warn('Animation fallback triggered');
        handleAnimationEnd();
      }
    }, 1000);
  }
}

// ==========================================
// Main Demo Setup
// ==========================================
class DemoManager {
  private eventCount = 0;
  private pageLoaderManager: PageLoaderManager;

  constructor() {
    // PageLoaderManager 먼저 초기화
    this.pageLoaderManager = new PageLoaderManager();
    this.pageLoaderManager.initialize();
    
    // 다른 초기화 작업
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
    
    // 환영 메시지 출력
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

/**
 * 간단한 텍스트 애니메이터 클래스 - 브라우저 직접 사용 버전
 * 텍스트 순환 애니메이션과 연기 효과를 제공합니다.
 */
class SimpleTextAnimator {
  private texts: NodeListOf<HTMLElement>;
  private currentIndex: number = 0;
  private isAnimating: boolean = false;
  private isPaused: boolean = false;
  private intervalId: number | null = null;
  private speed: number = 3000; // 기본 3초
  private isHighSpeed: boolean = false;

  constructor(selector: string = '.text-item') {
    this.texts = document.querySelectorAll(selector);
    
    if (this.texts.length === 0) {
      console.warn(`텍스트 요소를 찾을 수 없습니다: ${selector}`);
      return;
    }
    
    this.start();
  }

  /**
   * 애니메이션 시작
   */
  public start(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = window.setInterval(() => {
      if (!this.isAnimating && !this.isPaused) {
        this.next();
      }
    }, this.speed);
  }

  /**
   * 다음 텍스트로 전환
   */
  public next(): void {
    if (this.isAnimating || this.texts.length === 0) return;

    this.isAnimating = true;
    const currentText = this.texts[this.currentIndex];
    const nextIndex = (this.currentIndex + 1) % this.texts.length;
    const nextText = this.texts[nextIndex];

    // 현재 텍스트를 연기 효과로 사라지게
    currentText.classList.add('smoke-out');
    currentText.classList.remove('active');

    // 잠시 후 새 텍스트 표시
    setTimeout(() => {
      // 모든 텍스트 숨기기
      this.texts.forEach(text => {
        text.classList.remove('active', 'smoke-out');
      });

      // 새 텍스트 표시
      nextText.classList.add('active');
      this.currentIndex = nextIndex;

      // 애니메이션 완료
      setTimeout(() => {
        this.isAnimating = false;
      }, 100);
    }, 400);
  }

  /**
   * 애니메이션 일시정지
   */
  public pause(): void {
    this.isPaused = true;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * 애니메이션 재개
   */
  public resume(): void {
    if (this.isPaused) {
      this.isPaused = false;
      this.start();
    }
  }

  /**
   * 속도 전환 (빠름/보통)
   */
  public toggleSpeed(): void {
    this.isHighSpeed = !this.isHighSpeed;
    this.speed = this.isHighSpeed ? 1000 : 3000;
    
    if (!this.isPaused) {
      this.start(); // 새 속도로 재시작
    }
  }

  /**
   * 커스텀 속도 설정
   * @param speed 밀리초 단위의 속도
   */
  public setSpeed(speed: number): void {
    if (speed < 100) {
      console.warn('속도는 100ms 이상이어야 합니다.');
      return;
    }
    
    this.speed = speed;
    this.isHighSpeed = speed <= 1500;
    
    if (!this.isPaused) {
      this.start();
    }
  }

  /**
   * 특정 인덱스로 즉시 이동
   * @param index 이동할 텍스트 인덱스
   */
  public goToIndex(index: number): void {
    if (index < 0 || index >= this.texts.length) {
      console.warn('유효하지 않은 인덱스입니다.');
      return;
    }

    if (this.isAnimating) return;

    // 모든 텍스트 숨기기
    this.texts.forEach(text => {
      text.classList.remove('active', 'smoke-out');
    });

    // 지정된 텍스트 표시
    this.texts[index].classList.add('active');
    this.currentIndex = index;
  }

  /**
   * 페이지 visibility 변경 처리
   */
  public handleVisibilityChange(): void {
    if (document.hidden) {
      this.pause();
    } else {
      this.resume();
    }
  }

  /**
   * 애니메이터 정리 (메모리 누수 방지)
   */
  public destroy(): void {
    this.pause();
    
    // 모든 클래스 제거
    this.texts.forEach(text => {
      text.classList.remove('active', 'smoke-out');
    });
  }

  /**
   * 현재 상태 조회
   */
  public getState(): {
    currentIndex: number;
    isAnimating: boolean;
    isPaused: boolean;
    speed: number;
    isHighSpeed: boolean;
    totalTexts: number;
  } {
    return {
      currentIndex: this.currentIndex,
      isAnimating: this.isAnimating,
      isPaused: this.isPaused,
      speed: this.speed,
      isHighSpeed: this.isHighSpeed,
      totalTexts: this.texts.length
    };
  }

  /**
   * 현재 활성 텍스트 내용 반환
   */
  public getCurrentText(): string {
    return this.texts[this.currentIndex]?.textContent || '';
  }

  /**
   * 모든 텍스트 내용 배열로 반환
   */
  public getAllTexts(): string[] {
    return Array.from(this.texts).map(text => text.textContent || '');
  }
}

/**
 * 애니메이터 초기화 함수
 * @param selector 텍스트 요소 선택자 (기본: '.text-item')
 * @param autoSetupEvents 자동으로 이벤트 리스너 설정 여부 (기본: true)
 * @returns SimpleTextAnimator 인스턴스
 */
function initializeTextAnimator(
  selector: string = '.text-item', 
  autoSetupEvents: boolean = true
): SimpleTextAnimator {
  const animator = new SimpleTextAnimator(selector);

  if (autoSetupEvents) {
    // 페이지가 보이지 않을 때 애니메이션 정지
    document.addEventListener('visibilitychange', () => {
      animator.handleVisibilityChange();
    });

    // Reduced motion 사용자 설정 확인
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      animator.pause(); // 애니메이션 자동 정지
    }

    // 페이지 언로드 시 정리
    window.addEventListener('beforeunload', () => {
      animator.destroy();
    });
  }

  return animator;
}

// 전역 변수로 등록
let globalAnimator: SimpleTextAnimator | null = null;

/**
 * 전역 애니메이터 초기화
 * @param selector 텍스트 요소 선택자
 * @returns SimpleTextAnimator 인스턴스
 */
function createGlobalAnimator(selector?: string): SimpleTextAnimator {
  if (globalAnimator) {
    globalAnimator.destroy();
  }
  
  globalAnimator = initializeTextAnimator(selector);
  return globalAnimator;
}

/**
 * 전역 애니메이터 반환
 */
function getGlobalAnimator(): SimpleTextAnimator | null {
  return globalAnimator;
}

// ==========================================
// 통합 앱 초기화 시스템
// ==========================================

/**
 * 전체 애플리케이션 초기화 함수
 */
function initializeApp(): void {
  console.log('🚀 Initializing SEO Select Demo App...');

  // Text Animator 초기화
  if (document.querySelector('.text-item')) {
    globalAnimator = createGlobalAnimator();
    console.log('✅ Text Animator initialized');
  }
  
  // Demo Manager 초기화 (Page Loader 포함)
  new DemoManager();
  console.log('✅ Demo Manager initialized');
}

// Window 객체에 등록 (전역 접근 가능)
declare global {
  interface Window {
    SimpleTextAnimator: typeof SimpleTextAnimator;
    initializeTextAnimator: typeof initializeTextAnimator;
    createGlobalAnimator: typeof createGlobalAnimator;
    getGlobalAnimator: typeof getGlobalAnimator;
    DemoActions: typeof DemoActions;
    DynamicDemoActions: typeof DynamicDemoActions;
    initializeApp: typeof initializeApp;
  }
}

// 브라우저 환경에서 전역 등록
if (typeof window !== 'undefined') {
  window.SimpleTextAnimator = SimpleTextAnimator;
  window.initializeTextAnimator = initializeTextAnimator;
  window.createGlobalAnimator = createGlobalAnimator;
  window.getGlobalAnimator = getGlobalAnimator;
  window.DemoActions = DemoActions;
  window.DynamicDemoActions = DynamicDemoActions;
  window.initializeApp = initializeApp;
}

// ==========================================
// 메인 애플리케이션 시작점
// ==========================================

// Page Loader 안전 장치 (즉시 실행)
(function() {
  // 최대 10초 후 강제로 로더 숨김
  setTimeout(function() {
    const loader = document.querySelector('.page-loder') as HTMLElement | null;
    if (loader && loader.style.display !== 'none' && !loader.classList.contains('full-hide')) {
      loader.style.display = 'none';
      console.warn('Page loader hidden by safety timeout (10s)');
    }
  }, 10000);
  
  // 에러 발생 시 로더 숨김
  window.addEventListener('error', function(event) {
    const loader = document.querySelector('.page-loder') as HTMLElement | null;
    if (loader && loader.style.display !== 'none') {
      loader.style.display = 'none';
      console.warn('Page loader hidden due to error:', event.error);
    }
  });

  // 스크립트 로드 에러 시 로더 숨김
  window.addEventListener('unhandledrejection', function(event) {
    const loader = document.querySelector('.page-loder') as HTMLElement | null;
    if (loader && loader.style.display !== 'none') {
      loader.style.display = 'none';
      console.warn('Page loader hidden due to unhandled rejection:', event.reason);
    }
  });
})();

// DOM 준비 상태에 따른 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Content Loaded');
    // 약간의 지연을 두어 다른 스크립트들이 로드되도록 함
    setTimeout(() => {
      try {
        initializeApp();
      } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        // 에러가 발생해도 로더는 숨김
        const loader = document.querySelector('.page-loder') as HTMLElement | null;
        if (loader) {
          loader.style.display = 'none';
        }
      }
    }, 100);
  });
} else {
  console.log('📄 DOM already loaded');
  // DOM이 이미 로드된 경우 즉시 초기화
  setTimeout(() => {
    try {
      initializeApp();
    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
      // 에러가 발생해도 로더는 숨김
      const loader = document.querySelector('.page-loder') as HTMLElement | null;
      if (loader) {
        loader.style.display = 'none';
      }
    }
  }, 50);
}

// ==========================================
// 추가 안전 장치 및 디버깅 도구
// ==========================================

// 개발 환경 디버깅 도구
if (typeof window !== 'undefined') {
  // 전역 디버깅 함수
  (window as any).debugSeoSelect = {
    // 모든 SEO Select 컴포넌트 찾기
    findAllComponents: () => {
      const components = document.querySelectorAll('seo-select, seo-select-search');
      console.log(`Found ${components.length} SEO Select components:`, components);
      return components;
    },
    
    // 컴포넌트 상태 확인
    checkComponent: (nameOrId: string) => {
      const element = document.querySelector(`seo-select[name="${nameOrId}"], seo-select-search[name="${nameOrId}"], #${nameOrId}`) as SeoSelectElement | null;
      if (element && isSeoSelectElement(element)) {
        console.log(`Component ${nameOrId} state:`, {
          name: element.name,
          value: element.value,
          selectedValues: element.selectedValues,
          optionItems: element.optionItems,
          dark: element.dark,
          showReset: element.showReset
        });
        return element;
      } else {
        console.warn(`Component ${nameOrId} not found or not a SEO Select component`);
        return null;
      }
    },
    
    // 페이지 로더 강제 숨김
    hideLoader: () => {
      const loader = document.querySelector('.page-loder') as HTMLElement | null;
      if (loader) {
        loader.style.display = 'none';
        loader.classList.add('full-hide');
        console.log('✅ Page loader manually hidden');
      } else {
        console.log('ℹ️ Page loader not found');
      }
    },
    
    // 페이지 로더 상태 확인
    checkLoader: () => {
      const loader = document.querySelector('.page-loder') as HTMLElement | null;
      if (loader) {
        console.log('Page loader status:', {
          display: loader.style.display,
          classList: Array.from(loader.classList),
          offsetHeight: loader.offsetHeight,
          offsetWidth: loader.offsetWidth
        });
      } else {
        console.log('Page loader element not found');
      }
    },
    
    // 애니메이터 상태 확인
    checkAnimator: () => {
      const animator = getGlobalAnimator();
      if (animator) {
        const state = animator.getState();
        console.log('Text animator state:', state);
        console.log('Current text:', animator.getCurrentText());
        return state;
      } else {
        console.log('Text animator not initialized');
        return null;
      }
    },
    
    // 모든 이벤트 리스너가 초기화된 컴포넌트 확인
    checkEventListeners: () => {
      const components = document.querySelectorAll('seo-select, seo-select-search');
      const initialized: Element[] = [];
      const notInitialized: Element[] = [];
      
      components.forEach(component => {
        if (isSeoSelectElement(component) && component.dataset.eventListenersInitialized) {
          initialized.push(component);
        } else {
          notInitialized.push(component);
        }
      });
      
      console.log(`Event listeners initialized: ${initialized.length}, Not initialized: ${notInitialized.length}`);
      console.log('Initialized components:', initialized);
      console.log('Not initialized components:', notInitialized);
      
      return { initialized, notInitialized };
    },
    
    // 성능 메트릭 확인
    getPerformanceMetrics: () => {
      const metrics = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      console.log('Page load performance:', {
        domContentLoaded: `${metrics.domContentLoadedEventEnd - metrics.navigationStart}ms`,
        loadComplete: `${metrics.loadEventEnd - metrics.navigationStart}ms`,
        domInteractive: `${metrics.domInteractive - metrics.navigationStart}ms`
      });
      return metrics;
    }
  };
  
  console.log(`
🛠️  SEO Select Debug Tools Available:
• window.debugSeoSelect.findAllComponents() - Find all components
• window.debugSeoSelect.checkComponent('component-name') - Check component state
• window.debugSeoSelect.hideLoader() - Manually hide page loader
• window.debugSeoSelect.checkLoader() - Check loader status
• window.debugSeoSelect.checkAnimator() - Check text animator
• window.debugSeoSelect.checkEventListeners() - Check event initialization
• window.debugSeoSelect.getPerformanceMetrics() - Get performance data
`);
}

// 환경 정보 출력
console.log(`
🌐 Environment Info:
• User Agent: ${navigator.userAgent}
• Screen: ${screen.width}x${screen.height}
• Viewport: ${window.innerWidth}x${window.innerHeight}
• DOM Ready State: ${document.readyState}
• Page Loaded: ${document.readyState === 'complete'}
• Custom Elements Support: ${typeof customElements !== 'undefined'}
`);