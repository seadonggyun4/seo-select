// Main JavaScript for SEO Select Demo
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
    showNotification('Demo initialized successfully!');
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
        arraySelect.optionItems = [
            { value: 'kia', label: 'Kia Motors' },
            { value: 'hyundai', label: 'Hyundai Motor' },
            { value: 'bmw', label: 'BMW' },
            { value: 'benz', label: 'Mercedes-Benz' }
        ];
        arraySelect.value = 'hyundai';
    }
}

// Event Handling Setup
function setupEventHandling() {
    const eventDemo = document.getElementById('event-demo');
    const eventLog = document.getElementById('event-log');

    if (eventDemo && eventLog) {
        let eventCount = 0;

        function logEvent(message) {
            eventCount++;
            const time = new Date().toLocaleTimeString();
            const logEntry = document.createElement('div');
            logEntry.innerHTML = `[${time}] #${eventCount} ${message}`;
            logEntry.style.borderBottom = '1px solid #2d3748';
            logEntry.style.padding = '3px 0';
            eventLog.appendChild(logEntry);
            eventLog.scrollTop = eventLog.scrollHeight;
        }

        eventDemo.addEventListener('onSelect', (e) => {
            const { value, label } = e.detail;
            logEvent(`<span style="color: #68d391;">Selected:</span> ${label} (value: ${value})`);
        });

        eventDemo.addEventListener('onReset', (e) => {
            logEvent(`<span style="color: #fbb6ce;">Reset:</span> ${JSON.stringify(e.detail)}`);
        });

        eventDemo.addEventListener('change', (e) => {
            logEvent(`<span style="color: #90cdf4;">Form change:</span> ${e.target.value}`);
        });

        eventDemo.addEventListener('onDeselect', (e) => {
            logEvent(`<span style="color: #fed7aa;">Deselected:</span> ${JSON.stringify(e.detail)}`);
        });
    }
}

// Theme Setup
function setupThemes() {
    // Set initial values for multiple selection dark mode
    const darkMulti = document.querySelector('seo-select[name="dark-multi"]');
    if (darkMulti) {
        darkMulti.selectedValues = ['js', 'react'];
    }
}

// Multiple Selection Setup
function setupMultipleSelection() {
    // Basic multiple selection
    const multiSelect = document.querySelector('seo-select[name="skills"]');
    if (multiSelect) {
        multiSelect.selectedValues = ['js', 'ts', 'react'];

        multiSelect.addEventListener('onSelect', (e) => {
            console.log('Skills - Additional selection:', e.detail);
            console.log('Skills - All current selections:', multiSelect.selectedValues);
        });

        multiSelect.addEventListener('onDeselect', (e) => {
            console.log('Skills - Deselected:', e.detail);
        });
    }

    // Multilingual skills selection
    const multiSearchSelect = document.querySelector('seo-select-search[name="multilang-skills"]');
    if (multiSearchSelect) {
        multiSearchSelect.addEventListener('onSelect', (e) => {
            console.log('Multilang Skills - Selected:', e.detail);
            console.log('Multilang Skills - All selections:', multiSearchSelect.selectedValues);
            showNotification(`Selected: ${e.detail.label}`);
        });

        multiSearchSelect.addEventListener('onDeselect', (e) => {
            console.log('Multilang Skills - Deselected:', e.detail);
            showNotification(`Removed: ${e.detail.label}`);
        });
    }
}

// Advanced Features Setup
function setupAdvancedFeatures() {
    // Reset functionality
    const noResetSelect = document.getElementById('no-reset');
    if (noResetSelect) {
        noResetSelect.showReset = false;
    }

    // Auto width demo
    const autoWidthSelect = document.querySelector('seo-select[name="auto-width-demo"]');
    if (autoWidthSelect) {
        // Test dynamic width changes
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
                result += '<div style="color: #666; font-style: italic;">No data submitted.</div>';
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
            select.optionItems = [
                { value: 'item1', label: '한국어 아이템 1' },
                { value: 'item2', label: '日本語アイテム 2' },
                { value: 'item3', label: '中文项目 3' },
                { value: 'item4', label: 'English Item 4' },
                { value: 'item5', label: '混合 Mixed アイテム 5' },
                ...Array.from({ length: 45 }, (_, i) => ({
                    value: `item-${i + 6}`,
                    label: `다국어 Multi-언어 Item ${i + 6}`
                }))
            ];

            btn.classList.remove('loading');
            btn.disabled = false;
            btn.textContent = 'Data Loaded!';
            btn.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';

            showNotification('Multilingual data loaded successfully!');
            console.log('Multilingual data loading complete - Search functionality activated');
        }, 2000);
    }
}

function loadLargeDataset() {
    const select = document.getElementById('large-multilang-search');
    const btn = event.target;

    if (select) {
        btn.classList.add('loading');
        btn.disabled = true;

        setTimeout(() => {
            const languages = [
                { prefix: '한국어', code: 'ko' },
                { prefix: '日本語', code: 'ja' },
                { prefix: '中文', code: 'zh' },
                { prefix: 'English', code: 'en' },
                { prefix: '混合語', code: 'mixed' }
            ];

            select.optionItems = Array.from({ length: 10000 }, (_, i) => {
                const lang = languages[i % languages.length];
                const num = i.toString().padStart(4, '0');

                return {
                    value: `item-${lang.code}-${num}`,
                    label: `[${lang.prefix}] 技術スタック ${num} (기술 스택 ${num})`
                };
            });

            btn.classList.remove('loading');
            btn.disabled = false;
            btn.textContent = '10,000 Items Loaded!';
            btn.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';

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

        const langNames = {
            'ko': '한국어',
            'en': 'English',
            'ja': '日本語',
            'zh': '中文'
        };

        showNotification(`Language changed to ${langNames[lang]}`);
        console.log(`Language changed to: ${lang}`);
    }
}

// Utility Functions
function showNotification(message) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        document.body.removeChild(notification);
    });

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const btn = event.currentTarget;
        const originalIcon = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            btn.innerHTML = originalIcon;
        }, 1000);
        showNotification('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showNotification('Failed to copy to clipboard');
    });
}

// Global event listeners for all seo-select components
document.addEventListener('DOMContentLoaded', () => {
    // Add global event listeners for all select components
    document.querySelectorAll('seo-select, seo-select-search').forEach(select => {
        select.addEventListener('onSelect', (e) => {
            console.log(`[${select.name || 'unnamed'}] Selected:`, e.detail);
        });

        select.addEventListener('onDeselect', (e) => {
            console.log(`[${select.name || 'unnamed'}] Deselected:`, e.detail);
        });

        select.addEventListener('onReset', (e) => {
            console.log(`[${select.name || 'unnamed'}] Reset:`, e.detail);
        });

        select.addEventListener('change', (e) => {
            console.log(`[${select.name || 'unnamed'}] Change:`, e.target.value);
        });
    });
});

// Auto-cycle language demo every 5 seconds
let languageCycleIndex = 0;
const languages = ['ko', 'en', 'ja', 'zh'];

setInterval(() => {
    const dynamicLangSelect = document.getElementById('dynamic-lang');
    if (dynamicLangSelect && dynamicLangSelect.setLanguage) {
        languageCycleIndex = (languageCycleIndex + 1) % languages.length;
        const newLang = languages[languageCycleIndex];
        dynamicLangSelect.setLanguage(newLang);
    }
}, 5000);

// Keyboard shortcuts for navigation
document.addEventListener('keydown', (e) => {
    // Alt + number keys to switch sections
    if (e.altKey && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const sectionIndex = parseInt(e.key) - 1;
        const navButtons = document.querySelectorAll('.nav-btn');
        if (navButtons[sectionIndex]) {
            navButtons[sectionIndex].click();
        }
    }
});

// Console welcome message
console.log(`
🎯 SEO Select Components Demo
============================
Welcome to the comprehensive demo of seo-select and seo-select-search components!

🔍 Features being demonstrated:
• Basic select usage (slot and array methods)
• Multilingual search functionality
• Theme system (basic/float, light/dark)
• Multiple selection with tags
• Virtual scrolling for large datasets
• Keyboard navigation and accessibility
• Form integration and validation
• Auto width adjustment
• Language localization
• Custom text configuration
• Event handling system

💡 Tips:
• Use Alt+1-5 to quickly navigate between sections
• Check the browser console for detailed event logs
• Try multilingual search with Korean (ㅎㄱ), Japanese (にほんご), Chinese (zhongwen)
• All interactions are logged for debugging purposes

📚 Documentation: Check the use cases in each section for detailed examples!
`);

// Performance monitoring
if (window.performance) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`Demo loaded in ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
        }, 0);
    });
}