// ==========================================
// Constants Declaration
// ==========================================
const PAGE_LOAD_TIME = 2000;
const MOBILE_BREAKPOINT = 768;
const ORIGINAL_WIDTH_KEY = 'data-original-width';

// Language names mapping
const LANGUAGE_NAMES = {
    'ko': '한국어',
    'en': 'English',
    'ja': '日本語',
    'zh': '中文'
};

// Sample multilingual languages for large dataset
const SAMPLE_LANGUAGES = [
    { prefix: '한국어', code: 'ko' },
    { prefix: '日本語', code: 'ja' },
    { prefix: '中文', code: 'zh' },
    { prefix: 'English', code: 'en' },
    { prefix: '混合語', code: 'mixed' }
];

// Default multilingual demo data
const MULTILINGUAL_DEMO_DATA = [
    { value: 'item1', label: '한국어 아이템 1' },
    { value: 'item2', label: '日本語アイテム 2' },
    { value: 'item3', label: '中文项目 3' },
    { value: 'item4', label: 'English Item 4' },
    { value: 'item5', label: '混合 Mixed アイテム 5' }
];

// Brand options for basic usage
const BRAND_OPTIONS = [
    { value: 'kia', label: 'Kia Motors' },
    { value: 'hyundai', label: 'Hyundai Motor' },
    { value: 'bmw', label: 'BMW' },
    { value: 'benz', label: 'Mercedes-Benz' }
];

// Skills options for multiple selection demos
const DEFAULT_SELECTED_SKILLS = ['js', 'ts', 'react'];
const DEFAULT_DARK_MULTI_SKILLS = ['js', 'react'];

// Notification display duration
const NOTIFICATION_DURATION = 3000;
const NOTIFICATION_FADE_DELAY = 300;

// Resize debounce timeout
const RESIZE_DEBOUNCE_TIMEOUT = 100;
const ORIENTATION_CHANGE_DELAY = 300;
const NEW_COMPONENT_DELAY = 50;

// ==========================================
// Event Helper Functions (for new event system)
// ==========================================

/**
 * 타입 안전한 이벤트 리스너 추가 헬퍼
 */
function addSeoSelectListener(element, eventType, handler) {
    if (element && typeof element.addSeoSelectEventListener === 'function') {
        // 새로운 이벤트 시스템 사용
        element.addSeoSelectEventListener(eventType, handler);
    } else {
        // 폴백: 기존 방식
        element.addEventListener(eventType, handler);
    }
}

/**
 * 다중 이벤트 리스너 추가 헬퍼
 */
function addMultipleEventListeners(element, eventHandlers) {
    Object.entries(eventHandlers).forEach(([eventType, handler]) => {
        addSeoSelectListener(element, eventType, handler);
    });
}

/**
 * 이벤트 로깅 헬퍼 (새로운 이벤트 속성 지원)
 */
function logSeoSelectEvent(eventLog, eventType, event) {
    const time = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    
    let message = '';
    let color = '#6b7280';
    
    // 새로운 이벤트 시스템에서는 detail 대신 직접 속성 접근
    const eventData = event.detail || event;
    const label = event.label || eventData.label || '';
    const value = event.value || eventData.value || '';
    const values = event.values || eventData.values || [];
    const labels = event.labels || eventData.labels || [];
    
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
// Main JavaScript for SEO Select Documentation
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initializeDemo();
});

function initializeDemo() {
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
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.demo-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = btn.dataset.section;

            // Update active nav button
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// Basic Usage Setup
function setupBasicUsage() {
    // Setup array method select
    const arraySelect = document.querySelector('seo-select[name="brand-alt"]');
    if (arraySelect) {
        arraySelect.optionItems = BRAND_OPTIONS;
        arraySelect.value = 'hyundai';
    }
}

// Event Handling Setup (Updated for new event system)
function setupEventHandling() {
    const eventDemo = document.getElementById('event-demo');
    const eventLog = document.getElementById('event-log');

    if (eventDemo && eventLog) {
        let eventCount = 0;

        // Enhanced logging function
        function logEvent(eventType, event) {
            eventCount++;
            const logEntry = document.createElement('div');
            logEntry.style.marginBottom = '4px';
            
            const countBadge = document.createElement('span');
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
            
            const content = document.createElement('span');
            logSeoSelectEvent(content, eventType, event);
            
            logEntry.appendChild(countBadge);
            logEntry.appendChild(content);
            eventLog.appendChild(logEntry);
            eventLog.scrollTop = eventLog.scrollHeight;
        }

        // 새로운 이벤트 시스템 사용
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
                console.log('Event Demo - Form Change:', event.target?.value);
            }
        });

        // Clear log button
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
            eventCount = 0;
            showNotification('Event log cleared');
        });
        
        if (eventLog.parentNode) {
            eventLog.parentNode.appendChild(clearBtn);
        }
    }
}

// Theme Setup
function setupThemes() {
    const darkMulti = document.querySelector('seo-select[name="dark-multi"]');
    if (darkMulti) {
        darkMulti.selectedValues = DEFAULT_DARK_MULTI_SKILLS;
    }
}

// Multiple Selection Setup (Updated for new event system)
function setupMultipleSelection() {
    const multiSelect = document.querySelector('seo-select[name="skills"]');
    if (multiSelect) {
        multiSelect.selectedValues = DEFAULT_SELECTED_SKILLS;

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

    const multiSearchSelect = document.querySelector('seo-select-search[name="multilang-skills"]');
    if (multiSearchSelect) {
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
}

// Advanced Features Setup
function setupAdvancedFeatures() {
    const noResetSelect = document.getElementById('no-reset');
    if (noResetSelect) {
        noResetSelect.showReset = false;
    }

    const autoWidthSelect = document.querySelector('seo-select[name="auto-width-demo"]');
    if (autoWidthSelect) {
        setTimeout(() => {
            if (autoWidthSelect.calculateAutoWidth) {
                autoWidthSelect.calculateAutoWidth();
            }
        }, 1000);
    }
}

// Form Integration Setup
function setupFormIntegration() {
    const demoForm = document.getElementById('demo-form');
    const formResult = document.getElementById('form-result');

    if (demoForm && formResult) {
        demoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

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
}

// Demo Functions for Buttons
function loadMultilingualData() {
    const select = document.getElementById('loading-demo');
    const btn = event.target;

    if (select) {
        btn.classList.add('loading');
        btn.disabled = true;

        setTimeout(() => {
            const additionalItems = Array.from({ length: 45 }, (_, i) => ({
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

function loadLargeDataset() {
    const select = document.getElementById('large-multilang-search');
    const btn = event.target;

    if (select) {
        btn.classList.add('loading');
        btn.disabled = true;

        setTimeout(() => {
            select.optionItems = Array.from({ length: 10000 }, (_, i) => {
                const lang = SAMPLE_LANGUAGES[i % SAMPLE_LANGUAGES.length];
                const num = i.toString().padStart(4, '0');

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

function toggleDarkMode() {
    const dynamicSelect = document.getElementById('dynamic-dark');
    if (dynamicSelect) {
        dynamicSelect.dark = !dynamicSelect.dark;

        const btn = event.target;
        btn.textContent = dynamicSelect.dark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

        showNotification(`${dynamicSelect.dark ? 'Dark' : 'Light'} mode activated!`);
        console.log('Dynamic dark mode:', dynamicSelect.dark ? 'enabled' : 'disabled');
    }
}

function setLanguage(lang) {
    const dynamicLangSelect = document.getElementById('dynamic-lang');
    if (dynamicLangSelect && dynamicLangSelect.setLanguage) {
        dynamicLangSelect.setLanguage(lang);

        showNotification(`Language changed to ${LANGUAGE_NAMES[lang]}`);
        console.log(`Language changed to: ${lang}`);
    }
}

// Utility Functions
function showNotification(message) {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        document.body.removeChild(notification);
    });

    const notification = document.createElement('div');
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

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, NOTIFICATION_FADE_DELAY);
    }, NOTIFICATION_DURATION);
}

// Global event listeners for all seo-select components (Updated for new event system)
document.addEventListener('DOMContentLoaded', () => {
    const initializeGlobalListeners = () => {
        document.querySelectorAll('seo-select, seo-select-search').forEach(select => {
            const componentName = select.name || select.id || 'unnamed';
            
            // Skip if already initialized
            if (select.dataset.eventListenersInitialized) {
                return;
            }
            
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
    const observer = new MutationObserver((mutations) => {
        let hasNewComponents = false;
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === 'SEO-SELECT' || node.tagName === 'SEO-SELECT-SEARCH') {
                        hasNewComponents = true;
                    } else if (node.querySelectorAll) {
                        const selectComponents = node.querySelectorAll('seo-select, seo-select-search');
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
document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const sectionIndex = parseInt(e.key) - 1;
        const navButtons = document.querySelectorAll('.nav-btn');
        if (navButtons[sectionIndex]) {
            navButtons[sectionIndex].click();
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
const headerDemo = document.querySelector('seo-select-search[name="welcome"]');
if (headerDemo) {
    addSeoSelectListener(headerDemo, 'onSelect', (event) => {
        const eventData = {
            label: event.label || event.detail?.label,
            value: event.value || event.detail?.value
        };
        showNotification(`Welcome! You selected: ${eventData.label}`);
        console.log('Header demo selection:', eventData);
    });
}

// Mobile Responsive Width Management for SEO Select Components
(function() {
    function isMobile() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }
    
    function saveOriginalWidth(component) {
        if (!component.hasAttribute(ORIGINAL_WIDTH_KEY)) {
            const originalWidth = component.getAttribute('width') || '';
            component.setAttribute(ORIGINAL_WIDTH_KEY, originalWidth);
        }
    }
    
    function restoreOriginalWidth(component) {
        const originalWidth = component.getAttribute(ORIGINAL_WIDTH_KEY);
        if (originalWidth !== null) {
            if (originalWidth === '') {
                component.removeAttribute('width');
            } else {
                component.setAttribute('width', originalWidth);
            }
        }
    }
    
    function applyResponsiveWidth() {
        const components = document.querySelectorAll('seo-select, seo-select-search');
        
        components.forEach(component => {
            saveOriginalWidth(component);
            
            if (isMobile()) {
                component.setAttribute('width', '100%');
            } else {
                restoreOriginalWidth(component);
            }
        });
    }
    
    function handleNewComponents(components) {
        components.forEach(component => {
            saveOriginalWidth(component);
            
            if (isMobile()) {
                component.setAttribute('width', '100%');
            }
        });
    }
    
    function init() {
        applyResponsiveWidth();
        
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(applyResponsiveWidth, RESIZE_DEBOUNCE_TIMEOUT);
        });
        
        window.addEventListener('orientationchange', function() {
            setTimeout(applyResponsiveWidth, ORIENTATION_CHANGE_DELAY);
        });
        
        const observer = new MutationObserver(function(mutations) {
            const newComponents = [];
            
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'SEO-SELECT' || node.tagName === 'SEO-SELECT-SEARCH') {
                            newComponents.push(node);
                        } else if (node.querySelectorAll) {
                            const selectComponents = node.querySelectorAll('seo-select, seo-select-search');
                            newComponents.push(...selectComponents);
                        }
                    }
                });
            });
            
            if (newComponents.length > 0) {
                setTimeout(() => handleNewComponents(newComponents), NEW_COMPONENT_DELAY);
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
document.addEventListener('DOMContentLoaded', function() {
    const hasLoaded = sessionStorage.getItem('page-loaded');
    const pageLoader = document.querySelector('.page-loder');
    
    if (hasLoaded) {
        pageLoader.style.display = 'none';
        return;
    }

    setTimeout(() => {
        pageLoader.classList.add('hide');
        
        const handleAnimationEnd = () => {
            pageLoader.classList.add('full-hide');
            sessionStorage.setItem('page-loaded', 'true');
            pageLoader.removeEventListener('animationend', handleAnimationEnd);
        };
        
        pageLoader.addEventListener('animationend', handleAnimationEnd);
    }, PAGE_LOAD_TIME);
});