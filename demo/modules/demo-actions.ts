/**
 * Demo 액션 함수들
 */

import type { LanguageNames } from './types';
import { CONFIG, DEMO_DATA, SAMPLE_LANGUAGES, LANGUAGE_NAMES } from './constants';
import { isSeoSelectElement } from './utils';
import { showNotification } from './notification';

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

// DemoActions 네임스페이스로 내보내기
export const DemoActions = {
  loadMultilingualData,
  loadLargeDataset,
  toggleDarkMode,
  setLanguage,
};
