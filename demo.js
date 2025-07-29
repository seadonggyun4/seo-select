        // Main JavaScript for SEO Select Documentation
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
                    logEntry.style.borderBottom = '1px solid #374151';
                    logEntry.style.padding = '3px 0';
                    eventLog.appendChild(logEntry);
                    eventLog.scrollTop = eventLog.scrollHeight;
                }

                eventDemo.addEventListener('onSelect', (e) => {
                    const { value, label } = e.detail;
                    logEvent(`<span style="color: #10b981;">Selected:</span> ${label} (value: ${value})`);
                });

                eventDemo.addEventListener('onReset', (e) => {
                    logEvent(`<span style="color: #f59e0b;">Reset:</span> ${JSON.stringify(e.detail)}`);
                });

                eventDemo.addEventListener('change', (e) => {
                    logEvent(`<span style="color: #3b82f6;">Form change:</span> ${e.target.value}`);
                });

                eventDemo.addEventListener('onDeselect', (e) => {
                    logEvent(`<span style="color: #ef4444;">Deselected:</span> ${JSON.stringify(e.detail)}`);
                });
            }
        }

        // Theme Setup
        function setupThemes() {
            const darkMulti = document.querySelector('seo-select[name="dark-multi"]');
            if (darkMulti) {
                darkMulti.selectedValues = ['js', 'react'];
            }
        }

        // Multiple Selection Setup
        function setupMultipleSelection() {
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
                    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

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

        // Global event listeners for all seo-select components
        document.addEventListener('DOMContentLoaded', () => {
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

        // Console welcome message
        console.log(`
🎯 SEO Select Components Documentation  
=========================================
Advanced multilingual select components with enterprise features

🔍 Key Features:
• Semantic HTML with SEO optimization
• Multilingual search (Korean 초성, Japanese romaji, Chinese pinyin)
• Theme system with dark mode support
• Multiple selection with tag management
• Virtual scrolling for large datasets (10,000+ items)
• Full keyboard navigation and accessibility
• Form integration with validation
• Internationalization (i18n) support
• Custom text configuration
• Event-driven architecture

💡 Navigation Tips:
• Use Alt+1-5 for quick section switching
• All interactions are logged in console
• Try multilingual search: ㅎㄱ, にほんご, zhongwen
• Check event logs for detailed debugging

📚 This documentation demonstrates production-ready components suitable for enterprise applications.
        `);

        // Load demo data for header component
        const headerDemo = document.querySelector('seo-select-search[name="welcome"]');
        if (headerDemo) {
            headerDemo.addEventListener('onSelect', (e) => {
                showNotification(`Welcome! You selected: ${e.detail.label}`);
                console.log('Header demo selection:', e.detail);
            });
        }