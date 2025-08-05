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
  dataset: DOMStringMap & {
    eventListenersInitialized?: string;
  };
}

interface SeoSelectEvent extends Omit<Event, 'target'> {
  label?: string;
  value?: string;
  values?: string[];
  labels?: string[];
  target?: (EventTarget & {
    value?: string;
  }) | null;
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
// Constants Declaration
// ==========================================
const PAGE_LOAD_TIME: number = 2000;
const MOBILE_BREAKPOINT: number = 768;
const ORIGINAL_WIDTH_KEY: string = 'data-original-width';

// Language names mapping
const LANGUAGE_NAMES: LanguageNames = {
    'ko': '한국어',
    'en': 'English',
    'ja': '日本語',
    'zh': '中文'
};

// Sample multilingual languages for large dataset
const SAMPLE_LANGUAGES: SampleLanguage[] = [
    { prefix: '한국어', code: 'ko' },
    { prefix: '日本語', code: 'ja' },
    { prefix: '中文', code: 'zh' },
    { prefix: 'English', code: 'en' },
    { prefix: '混合語', code: 'mixed' }
];

// Default multilingual demo data
const MULTILINGUAL_DEMO_DATA: OptionItem[] = [
    { value: 'item1', label: '한국어 아이템 1' },
    { value: 'item2', label: '日本語アイテム 2' },
    { value: 'item3', label: '中文项目 3' },
    { value: 'item4', label: 'English Item 4' },
    { value: 'item5', label: '混合 Mixed アイテム 5' }
];

// Brand options for basic usage
const BRAND_OPTIONS: OptionItem[] = [
    { value: 'kia', label: 'Kia Motors' },
    { value: 'hyundai', label: 'Hyundai Motor' },
    { value: 'bmw', label: 'BMW' },
    { value: 'benz', label: 'Mercedes-Benz' }
];

// Skills options for multiple selection demos
const DEFAULT_SELECTED_SKILLS: string[] = ['js', 'ts', 'react'];
const DEFAULT_DARK_MULTI_SKILLS: string[] = ['js', 'react'];

// Notification display duration
const NOTIFICATION_DURATION: number = 3000;
const NOTIFICATION_FADE_DELAY: number = 300;

// Resize debounce timeout
const RESIZE_DEBOUNCE_TIMEOUT: number = 100;
const ORIENTATION_CHANGE_DELAY: number = 300;
const NEW_COMPONENT_DELAY: number = 50;

// ==========================================
// Event Helper Functions (for new event system)
// ==========================================

/**
 * 타입 안전한 이벤트 리스너 추가 헬퍼
 */
function addSeoSelectListener(element: SeoSelectElement, eventType: string, handler: (event: SeoSelectEvent) => void): void {
    if (element && typeof element.addSeoSelectEventListener === 'function') {
        // 새로운 이벤트 시스템 사용
        element.addSeoSelectEventListener(eventType, handler);
    } else {
        // 폴백: 기존 방식
        element.addEventListener(eventType, handler as EventListener);
    }
}

/**
 * 다중 이벤트 리스너 추가 헬퍼
 */
function addMultipleEventListeners(element: SeoSelectElement, eventHandlers: EventHandlers): void {
    Object.entries(eventHandlers).forEach(([eventType, handler]) => {
        addSeoSelectListener(element, eventType, handler);
    });
}

/**
 * 이벤트 로깅 헬퍼 (새로운 이벤트 속성 지원)
 */
function logSeoSelectEvent(eventLog: HTMLElement, eventType: string, event: SeoSelectEvent): void {
    const time: string = new Date().toLocaleTimeString();
    const logEntry: HTMLDivElement = document.createElement('div');
    
    let message: string = '';
    let color: string = '#6b7280';
    
    // 새로운 이벤트 시스템에서는 detail 대신 직접 속성 접근
    const eventData = event.detail || event;
    const label: string = event.label || eventData.label || '';
    const value: string = event.value || eventData.value || '';
    const values: string[] = event.values || eventData.values || [];
    const labels: string[] = event.labels || eventData.labels || [];
    
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
            if (values.length > 0) {
                message = `<span style="color: ${color};">Reset:</span> Multiple items (${values.length} items)`;
            } else {
                message = `<span style="color: ${color};">Reset:</span> ${label || 'to default'}`;
            }
            break;
        case 'onChange':
            color = '#3b82f6';
            message = `<span style="color: ${color};">Form change:</span> ${event.target?.value || value}`;
            break;
        default:
            message = `<span style="color: ${color};">${eventType}:</span> ${JSON.stringify(eventData)}`;
    }
    
    logEntry.innerHTML = `[${time}] ${message}`;
    logEntry.style.borderBottom = '1px solid #374151';
    logEntry.style.padding = '3px 0';
    logEntry.style.fontSize = '13px';
    logEntry.style.fontFamily = 'monospace';
    
    eventLog.appendChild(logEntry);
    eventLog.scrollTop = eventLog.scrollHeight;
}

// ==========================================
// Type Guards
// ==========================================
function isSeoSelectElement(element: Element | null): element is SeoSelectElement {
    return element !== null && (element.tagName === 'SEO-SELECT' || element.tagName === 'SEO-SELECT-SEARCH');
}

function isHTMLButtonElement(element: EventTarget | null): element is HTMLButtonElement {
    return element !== null && element instanceof HTMLButtonElement;
}

// ==========================================
// Main JavaScript for SEO Select Documentation
// ==========================================
document.addEventListener('DOMContentLoaded', function(): void {
    initializeDemo();
});

function initializeDemo(): void {
    setupNavigation();
    setupBasicUsage();
    setupEventHandling();
    setupThemes();
    setupMultipleSelection();
    setupAdvancedFeatures();
    setupFormIntegration();
    showNotification('Documentation loaded successfully!');
}

// Navigation System
function setupNavigation(): void {
    const navButtons: NodeListOf<Element> = document.querySelectorAll('.nav-btn');
    const sections: NodeListOf<Element> = document.querySelectorAll('.demo-section');

    navButtons.forEach((btn: Element) => {
        btn.addEventListener('click', (): void => {
            const targetSection: string | undefined = (btn as HTMLElement).dataset.section;

            // Update active nav button
            navButtons.forEach((b: Element) => b.classList.remove('active'));
            btn.classList.add('active');

            // Show target section
            sections.forEach((section: Element) => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// Basic Usage Setup
function setupBasicUsage(): void {
    // Setup array method select
    const arraySelect: Element | null = document.querySelector('seo-select[name="brand-alt"]');
    if (isSeoSelectElement(arraySelect)) {
        arraySelect.optionItems = BRAND_OPTIONS;
        arraySelect.value = 'hyundai';
    }
}

// Event Handling Setup (Updated for new event system)
function setupEventHandling(): void {
    const eventDemo: HTMLElement | null = document.getElementById('event-demo');
    const eventLog: HTMLElement | null = document.getElementById('event-log');

    if (isSeoSelectElement(eventDemo) && eventLog) {
        let eventCount: number = 0;

        // Enhanced logging function
        function logEvent(eventType: string, event: SeoSelectEvent): void {
            eventCount++;
            const logEntry: HTMLDivElement = document.createElement('div');
            logEntry.style.marginBottom = '4px';
            
            const countBadge: HTMLSpanElement = document.createElement('span');
            countBadge.textContent = `#${eventCount}`;
            countBadge.style.cssText = `
                background: #374151;
                color: #9ca3af;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 11px;
                margin-right: 8px;
                font-weight: bold;
            `;
            
            const content: HTMLSpanElement = document.createElement('span');
            logSeoSelectEvent(content, eventType, event);
            
            logEntry.appendChild(countBadge);
            logEntry.appendChild(content);

            if(!eventLog) return;
            eventLog.appendChild(logEntry);
            eventLog.scrollTop = eventLog.scrollHeight;
        }

        // 새로운 이벤트 시스템 사용
        addMultipleEventListeners(eventDemo, {
            'onSelect': (event: SeoSelectEvent): void => {
                logEvent('onSelect', event);
                console.log('Event Demo - Selected:', { 
                    label: event.label || event.detail?.label, 
                    value: event.value || event.detail?.value 
                });
            },
            'onDeselect': (event: SeoSelectEvent): void => {
                logEvent('onDeselect', event);
                console.log('Event Demo - Deselected:', { 
                    label: event.label || event.detail?.label, 
                    value: event.value || event.detail?.value 
                });
            },
            'onReset': (event: SeoSelectEvent): void => {
                logEvent('onReset', event);
                console.log('Event Demo - Reset:', event.detail || {
                    label: event.label,
                    value: event.value,
                    values: event.values,
                    labels: event.labels
                });
            },
            'onChange': (event: SeoSelectEvent): void => {
                logEvent('onChange', event);
                console.log('Event Demo - Form Change:', event.target?.value);
            }
        });

        // Clear log button
        const clearBtn: HTMLButtonElement = document.createElement('button');
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
        clearBtn.addEventListener('click', (): void => {
            eventLog.innerHTML = '';
            eventCount = 0;
            showNotification('Event log cleared');
        });
        
        if (eventLog.parentNode) {
            eventLog.parentNode.appendChild(clearBtn);
        }
    }
}

// Theme Setup
function setupThemes(): void {
    const darkMulti: Element | null = document.querySelector('seo-select[name="dark-multi"]');
    if (isSeoSelectElement(darkMulti)) {
        darkMulti.selectedValues = DEFAULT_DARK_MULTI_SKILLS;
    }
}

// Multiple Selection Setup (Updated for new event system)
function setupMultipleSelection(): void {
    const multiSelect: Element | null = document.querySelector('seo-select[name="skills"]');
    if (isSeoSelectElement(multiSelect)) {
        multiSelect.selectedValues = DEFAULT_SELECTED_SKILLS;

        addMultipleEventListeners(multiSelect, {
            'onSelect': (event: SeoSelectEvent): void => {
                const eventData = {
                    label: event.label || event.detail?.label,
                    value: event.value || event.detail?.value
                };
                console.log('Skills - Additional selection:', eventData);
                console.log('Skills - All current selections:', multiSelect.selectedValues);
                showNotification(`Added skill: ${eventData.label}`);
            },
            'onDeselect': (event: SeoSelectEvent): void => {
                const eventData = {
                    label: event.label || event.detail?.label,
                    value: event.value || event.detail?.value
                };
                console.log('Skills - Deselected:', eventData);
                showNotification(`Removed skill: ${eventData.label}`);
            },
            'onReset': (event: SeoSelectEvent): void => {
                console.log('Skills - Reset:', event.detail || event);
                showNotification('Skills reset to default');
            }
        });
    }

    const multiSearchSelect: Element | null = document.querySelector('seo-select-search[name="multilang-skills"]');
    if (isSeoSelectElement(multiSearchSelect)) {
        addMultipleEventListeners(multiSearchSelect, {
            'onSelect': (event: SeoSelectEvent): void => {
                const eventData = {
                    label: event.label || event.detail?.label,
                    value: event.value || event.detail?.value
                };
                console.log('Multilang Skills - Selected:', eventData);
                console.log('Multilang Skills - All selections:', multiSearchSelect.selectedValues);
                showNotification(`Selected: ${eventData.label}`);
            },
            'onDeselect': (event: SeoSelectEvent): void => {
                const eventData = {
                    label: event.label || event.detail?.label,
                    value: event.value || event.detail?.value
                };
                console.log('Multilang Skills - Deselected:', eventData);
                showNotification(`Removed: ${eventData.label}`);
            },
            'onReset': (event: SeoSelectEvent): void => {
                console.log('Multilang Skills - Reset:', event.detail || event);
                showNotification('Multilingual skills reset');
            }
        });
    }
}

// Advanced Features Setup
function setupAdvancedFeatures(): void {
    const noResetSelect: HTMLElement | null = document.getElementById('no-reset');
    if (isSeoSelectElement(noResetSelect)) {
        noResetSelect.showReset = false;
    }

    const autoWidthSelect: Element | null = document.querySelector('seo-select[name="auto-width-demo"]');
    if (isSeoSelectElement(autoWidthSelect)) {
        setTimeout((): void => {
            if (autoWidthSelect.calculateAutoWidth) {
                autoWidthSelect.calculateAutoWidth();
            }
        }, 1000);
    }
}

// Form Integration Setup
function setupFormIntegration(): void {
    const demoForm: HTMLElement | null = document.getElementById('demo-form');
    const formResult: HTMLElement | null = document.getElementById('form-result');

    if (demoForm && formResult) {
        demoForm.addEventListener('submit', (e: Event): void => {
            e.preventDefault();
            const formData: FormData = new FormData(e.target as HTMLFormElement);

            let result: string = '<h4>Form Submission Data:</h4>';
            let hasData: boolean = false;

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
}

// Demo Functions - Safe namespace approach
namespace DemoActions {
    export function loadMultilingualData(): void {
        const select: HTMLElement | null = document.getElementById('loading-demo');
        const btn: HTMLElement | null = document.activeElement as HTMLElement;

        if (isSeoSelectElement(select) && btn instanceof HTMLButtonElement) {
            btn.classList.add('loading');
            btn.disabled = true;

            setTimeout((): void => {
                const additionalItems: OptionItem[] = Array.from({ length: 45 }, (_, i): OptionItem => ({
                    value: `item-${i + 6}`,
                    label: `다국어 Multi-언어 Item ${i + 6}`
                }));

                select.optionItems = [...MULTILINGUAL_DEMO_DATA, ...additionalItems];

                btn.classList.remove('loading');
                btn.disabled = false;
                btn.textContent = 'Data Loaded!';
                btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

                showNotification('Multilingual data loaded successfully!');
                console.log('Multilingual data loading complete - Search functionality activated');
            }, PAGE_LOAD_TIME);
        }
    }

    export function loadLargeDataset(): void {
        const select: HTMLElement | null = document.getElementById('large-multilang-search');
        const btn: HTMLElement | null = document.activeElement as HTMLElement;

        if (isSeoSelectElement(select) && btn instanceof HTMLButtonElement) {
            btn.classList.add('loading');
            btn.disabled = true;

            setTimeout((): void => {
                select.optionItems = Array.from({ length: 10000 }, (_, i): OptionItem => {
                    const lang: SampleLanguage = SAMPLE_LANGUAGES[i % SAMPLE_LANGUAGES.length];
                    const num: string = i.toString().padStart(4, '0');

                    return {
                        value: `item-${lang.code}-${num}`,
                        label: `[${lang.prefix}] 기술 스택 ${num} (Tech Stack ${num})`
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
    }

    export function toggleDarkMode(): void {
        const dynamicSelect: HTMLElement | null = document.getElementById('dynamic-dark');
        if (isSeoSelectElement(dynamicSelect)) {
            dynamicSelect.dark = !dynamicSelect.dark;

            const btn: HTMLElement | null = document.activeElement as HTMLElement;
            if (btn instanceof HTMLButtonElement) {
                btn.textContent = dynamicSelect.dark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
            }

            showNotification(`${dynamicSelect.dark ? 'Dark' : 'Light'} mode activated!`);
            console.log('Dynamic dark mode:', dynamicSelect.dark ? 'enabled' : 'disabled');
        }
    }

    export function setLanguage(lang: keyof LanguageNames): void {
        const dynamicLangSelect: HTMLElement | null = document.getElementById('dynamic-lang');
        if (isSeoSelectElement(dynamicLangSelect) && dynamicLangSelect.setLanguage) {
            dynamicLangSelect.setLanguage(lang);

            showNotification(`Language changed to ${LANGUAGE_NAMES[lang]}`);
            console.log(`Language changed to: ${lang}`);
        }
    }
}

// Make DemoActions globally available in a controlled way
(window as any).DemoActions = DemoActions;

// Utility Functions
function showNotification(message: string): void {
    const existingNotifications: NodeListOf<Element> = document.querySelectorAll('.notification');
    existingNotifications.forEach((notification: Element): void => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });

    const notification: HTMLDivElement = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Enhanced notification styling
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

    setTimeout((): void => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout((): void => {
        notification.style.transform = 'translateX(100%)';
        setTimeout((): void => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, NOTIFICATION_FADE_DELAY);
    }, NOTIFICATION_DURATION);
}

// Global event listeners for all seo-select components (Updated for new event system)
document.addEventListener('DOMContentLoaded', (): void => {
    const initializeGlobalListeners = (): void => {
        document.querySelectorAll('seo-select, seo-select-search').forEach((select: Element): void => {
            if (!isSeoSelectElement(select)) return;
            
            const componentName: string = select.name || select.id || 'unnamed';
            
            // Skip if already initialized
            if (select.dataset.eventListenersInitialized) {
                return;
            }
            
            addMultipleEventListeners(select, {
                'onSelect': (event: SeoSelectEvent): void => {
                    const eventData = {
                        label: event.label || event.detail?.label,
                        value: event.value || event.detail?.value
                    };
                    console.log(`[${componentName}] Selected:`, eventData);
                },
                'onDeselect': (event: SeoSelectEvent): void => {
                    const eventData = {
                        label: event.label || event.detail?.label,
                        value: event.value || event.detail?.value
                    };
                    console.log(`[${componentName}] Deselected:`, eventData);
                },
                'onReset': (event: SeoSelectEvent): void => {
                    const eventData = event.detail || {
                        label: event.label,
                        value: event.value,
                        values: event.values,
                        labels: event.labels
                    };
                    console.log(`[${componentName}] Reset:`, eventData);
                },
                'onChange': (event: SeoSelectEvent): void => {
                    console.log(`[${componentName}] Change:`, event.target?.value);
                }
            });
            
            // Mark as initialized
            select.dataset.eventListenersInitialized = 'true';
        });
    };
    
    // Initialize existing components
    initializeGlobalListeners();
    
    // Watch for new components
    const observer: MutationObserver = new MutationObserver((mutations: MutationRecord[]): void => {
        let hasNewComponents: boolean = false;
        mutations.forEach((mutation: MutationRecord): void => {
            mutation.addedNodes.forEach((node: Node): void => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as Element;
                    if (element.tagName === 'SEO-SELECT' || element.tagName === 'SEO-SELECT-SEARCH') {
                        hasNewComponents = true;
                    } else if (element.querySelectorAll) {
                        const selectComponents: NodeListOf<Element> = element.querySelectorAll('seo-select, seo-select-search');
                        if (selectComponents.length > 0) {
                            hasNewComponents = true;
                        }
                    }
                }
            });
        });
        
        if (hasNewComponents) {
            setTimeout(initializeGlobalListeners, NEW_COMPONENT_DELAY);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Keyboard shortcuts for navigation
document.addEventListener('keydown', (e: KeyboardEvent): void => {
    if (e.altKey && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const sectionIndex: number = parseInt(e.key) - 1;
        const navButtons: NodeListOf<Element> = document.querySelectorAll('.nav-btn');
        if (navButtons[sectionIndex]) {
            (navButtons[sectionIndex] as HTMLElement).click();
        }
    }
});

// Console welcome message (Enhanced)
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

// Load demo data for header component (Updated for new event system)
const headerDemo: Element | null = document.querySelector('seo-select-search[name="welcome"]');
if (isSeoSelectElement(headerDemo)) {
    addSeoSelectListener(headerDemo, 'onSelect', (event: SeoSelectEvent): void => {
        const eventData = {
            label: event.label || event.detail?.label,
            value: event.value || event.detail?.value
        };
        showNotification(`Welcome! You selected: ${eventData.label}`);
        console.log('Header demo selection:', eventData);
    });
}

// Mobile Responsive Width Management for SEO Select Components
(function(): void {
    function isMobile(): boolean {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }
    
    function saveOriginalWidth(component: Element): void {
        if (!component.hasAttribute(ORIGINAL_WIDTH_KEY)) {
            const originalWidth: string = component.getAttribute('width') || '';
            component.setAttribute(ORIGINAL_WIDTH_KEY, originalWidth);
        }
    }
    
    function restoreOriginalWidth(component: Element): void {
        const originalWidth: string | null = component.getAttribute(ORIGINAL_WIDTH_KEY);
        if (originalWidth !== null) {
            if (originalWidth === '') {
                component.removeAttribute('width');
            } else {
                component.setAttribute('width', originalWidth);
            }
        }
    }
    
    function applyResponsiveWidth(): void {
        const components: NodeListOf<Element> = document.querySelectorAll('seo-select, seo-select-search');
        
        components.forEach((component: Element): void => {
            saveOriginalWidth(component);
            
            if (isMobile()) {
                component.setAttribute('width', '100%');
            } else {
                restoreOriginalWidth(component);
            }
        });
    }
    
    function handleNewComponents(components: Element[]): void {
        components.forEach((component: Element): void => {
            saveOriginalWidth(component);
            
            if (isMobile()) {
                component.setAttribute('width', '100%');
            }
        });
    }
    
    function init(): void {
        applyResponsiveWidth();
        
        let resizeTimeout: number;
        window.addEventListener('resize', function(): void {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(applyResponsiveWidth, RESIZE_DEBOUNCE_TIMEOUT) as any;
        });
        
        window.addEventListener('orientationchange', function(): void {
            setTimeout(applyResponsiveWidth, ORIENTATION_CHANGE_DELAY);
        });
        
        const observer: MutationObserver = new MutationObserver(function(mutations: MutationRecord[]): void {
            const newComponents: Element[] = [];
            
            mutations.forEach(function(mutation: MutationRecord): void {
                mutation.addedNodes.forEach(function(node: Node): void {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;
                        if (element.tagName === 'SEO-SELECT' || element.tagName === 'SEO-SELECT-SEARCH') {
                            newComponents.push(element);
                        } else if (element.querySelectorAll) {
                            const selectComponents: NodeListOf<Element> = element.querySelectorAll('seo-select, seo-select-search');
                            newComponents.push(...Array.from(selectComponents));
                        }
                    }
                });
            });
            
            if (newComponents.length > 0) {
                setTimeout((): void => handleNewComponents(newComponents), NEW_COMPONENT_DELAY);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// Page Loader Functionality
document.addEventListener('DOMContentLoaded', function(): void {
    const hasLoaded: string | null = sessionStorage.getItem('page-loaded');
    const pageLoader: Element | null = document.querySelector('.page-loder');
    
    if (hasLoaded && pageLoader) {
        (pageLoader as HTMLElement).style.display = 'none';
        return;
    }

    if (pageLoader) {
        setTimeout((): void => {
            pageLoader.classList.add('hide');
            
            const handleAnimationEnd = (): void => {
                pageLoader.classList.add('full-hide');
                sessionStorage.setItem('page-loaded', 'true');
                pageLoader.removeEventListener('animationend', handleAnimationEnd);
            };
            
            pageLoader.addEventListener('animationend', handleAnimationEnd);
        }, PAGE_LOAD_TIME);
    }
});

// ==========================================
// Simple TypeScript Error Suppression for Demo Page
// ==========================================

namespace DynamicDemoActions {
    // Sample datasets
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

    // Utility functions
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

    // Main demo functions
    export async function loadTechStack(): Promise<void> {
        const select = getElement('batch-demo');
        if (!select) return;

        const btn = document.activeElement as HTMLButtonElement;
        if (btn) {
            btn.classList.add('loading');
            btn.disabled = true;
        }

        await simulateDelay(800);

        // @ts-ignore - Demo: addOptions method exists at runtime
        if (select.addOptions) {
             // @ts-ignore - Demo: clearAllOptions method exists at runtime
            select.addOptions(TECH_STACK_OPTIONS, true);
        } else {
            select.optionItems = TECH_STACK_OPTIONS;
        }

        if (btn) {
            btn.classList.remove('loading');
            btn.classList.add('success');
            btn.disabled = false;
            btn.textContent = 'Tech Stack Loaded!';
            
            setTimeout(() => {
                btn.classList.remove('success');
                btn.textContent = 'Load Tech Stack';
            }, 2000);
        }

        showNotification('Tech stack options loaded successfully!');
        console.log('Dynamic Demo: Tech stack loaded', TECH_STACK_OPTIONS);
    }

    export async function loadLanguages(): Promise<void> {
        const select = getElement('batch-demo');
        if (!select) return;

        const btn = document.activeElement as HTMLButtonElement;
        if (btn) {
            btn.classList.add('loading');
            btn.disabled = true;
        }

        await simulateDelay(600);

        // @ts-ignore - Demo: addOptions method exists at runtime
        if (select.addOptions) {
             // @ts-ignore - Demo: clearAllOptions method exists at runtime
            select.addOptions(LANGUAGE_OPTIONS, true);
        } else {
            select.optionItems = LANGUAGE_OPTIONS;
        }

        if (btn) {
            btn.classList.remove('loading');
            btn.classList.add('success');
            btn.disabled = false;
            btn.textContent = 'Languages Loaded!';
            
            setTimeout(() => {
                btn.classList.remove('success');
                btn.textContent = 'Load Languages';
            }, 2000);
        }

        showNotification('Programming languages loaded!');
        console.log('Dynamic Demo: Languages loaded', LANGUAGE_OPTIONS);
    }

    export async function loadFrameworks(): Promise<void> {
        const select = getElement('batch-demo');
        if (!select) return;

        const btn = document.activeElement as HTMLButtonElement;
        if (btn) {
            btn.classList.add('loading');
            btn.disabled = true;
        }

        await simulateDelay(700);

        // @ts-ignore - Demo: addOptions method exists at runtime
        if (select.addOptions) {
             // @ts-ignore - Demo: clearAllOptions method exists at runtime
            select.addOptions(FRAMEWORK_OPTIONS, true);
        } else {
            select.optionItems = FRAMEWORK_OPTIONS;
        }

        if (btn) {
            btn.classList.remove('loading');
            btn.classList.add('success');
            btn.disabled = false;
            btn.textContent = 'Frameworks Loaded!';
            
            setTimeout(() => {
                btn.classList.remove('success');
                btn.textContent = 'Load Frameworks';
            }, 2000);
        }

        showNotification('Framework options loaded!');
        console.log('Dynamic Demo: Frameworks loaded', FRAMEWORK_OPTIONS);
    }

    export function clearAllOptions(selectId: string): void {
        const select = getElement(selectId);
        if (!select) return;

        // @ts-ignore - Demo: clearAllOptions method exists at runtime
        if (select.clearAllOptions) {
             // @ts-ignore - Demo: clearAllOptions method exists at runtime
            select.clearAllOptions();
        } else {
            select.optionItems = [];
        }

        showNotification('All options cleared');
        console.log(`Dynamic Demo: Cleared all options for ${selectId}`);
    }

    export function addCustomOption(): void {
        const select = getElement('individual-demo');
        const valueInput = document.getElementById('new-option-value') as HTMLInputElement;
        const labelInput = document.getElementById('new-option-label') as HTMLInputElement;

        if (!select || !valueInput || !labelInput) return;

        const value = valueInput.value.trim();
        const label = labelInput.value.trim();

        if (!value || !label) {
            showNotification('Please enter both value and label');
            return;
        }

        const newOption = { value, label };

        // @ts-ignore - Demo: addOption method exists at runtime
        if (select.addOption) {
             // @ts-ignore - Demo: clearAllOptions method exists at runtime
            select.addOption(newOption);
        } else {
            const currentOptions = select.optionItems || [];
            select.optionItems = [...currentOptions, newOption];
        }

        // Clear inputs
        valueInput.value = '';
        labelInput.value = '';

        showNotification(`Added option: ${label}`);
        console.log('Dynamic Demo: Added custom option', newOption);
    }

    export function removeOption(): void {
        const select = getElement('individual-demo');
        const valueInput = document.getElementById('remove-option-value') as HTMLInputElement;

        if (!select || !valueInput) return;

        const value = valueInput.value.trim();
        if (!value) {
            showNotification('Please enter a value to remove');
            return;
        }

        // @ts-ignore - Demo: clearOption method exists at runtime
        if (select.clearOption) {
             // @ts-ignore - Demo: clearAllOptions method exists at runtime
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

            // @ts-ignore - Demo: addOptions method exists at runtime
            if (select.addOptions) {
                 // @ts-ignore - Demo: clearAllOptions method exists at runtime
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

            // @ts-ignore - Demo: addOptions method exists at runtime
            if (select.addOptions) {
                 // @ts-ignore - Demo: clearAllOptions method exists at runtime
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

            // @ts-ignore - Demo: addOptions method exists at runtime
            if (select.addOptions) {
                 // @ts-ignore - Demo: clearAllOptions method exists at runtime
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

        // @ts-ignore - Demo: addOptions method exists at runtime
        if (select.addOptions) {
             // @ts-ignore - Demo: clearAllOptions method exists at runtime
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

        // @ts-ignore - Demo: addOptions method exists at runtime
        if (select.addOptions) {
             // @ts-ignore - Demo: clearAllOptions method exists at runtime
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

            // @ts-ignore - Demo: addOptions method exists at runtime
            if (select.addOptions) {
                 // @ts-ignore - Demo: clearAllOptions method exists at runtime
                select.addOptions(options, false);
            } else {
                select.optionItems = options;
            }

            // Small delay to see updates
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
             // @ts-ignore - Demo: clearAllOptions method exists at runtime
            if (select.clearAllOptions) {
                // @ts-ignore - Demo: clearAllOptions method exists at runtime
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

// Make DynamicDemoActions globally available
(window as any).DynamicDemoActions = DynamicDemoActions;