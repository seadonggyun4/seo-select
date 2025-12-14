/**
 * 동적 Demo 액션 함수들
 */

import type { OptionItem } from './types';
import {
  TECH_STACK_OPTIONS,
  LANGUAGE_OPTIONS,
  FRAMEWORK_OPTIONS,
  USER_DATA,
  COUNTRY_DATA
} from './constants';
import { getSeoSelectElement, simulateDelay } from './utils';
import { showNotification } from './notification';

// 상태 업데이트 헬퍼
function updateAsyncStatus(message: string, type: 'loading' | 'success' | 'error' = 'loading'): void {
  const status = document.getElementById('async-status');
  if (status) {
    status.textContent = message;
    status.className = `async-status ${type}`;
  }
}

// 퍼포먼스 메트릭 추가 헬퍼
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

// 버튼 로딩 상태 관리 헬퍼
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

// Demo 함수들
export async function loadTechStack(): Promise<void> {
  const select = getSeoSelectElement('batch-demo');
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
  const select = getSeoSelectElement('batch-demo');
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
  const select = getSeoSelectElement('batch-demo');
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
  const select = getSeoSelectElement(selectId);
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
  const select = getSeoSelectElement('individual-demo');
  const valueInput = document.getElementById('new-option-value') as HTMLInputElement | null;
  const labelInput = document.getElementById('new-option-label') as HTMLInputElement | null;

  if (!select || !valueInput || !labelInput) return;

  const value = valueInput.value.trim();
  const label = labelInput.value.trim();

  if (!value || !label) {
    showNotification('Please enter both value and label');
    return;
  }

  const newOption: OptionItem = { value, label };

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
  const select = getSeoSelectElement('individual-demo');
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
  const select = getSeoSelectElement('async-demo');
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
  const select = getSeoSelectElement('async-demo');
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
  const select = getSeoSelectElement('async-demo');
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
  const select = getSeoSelectElement('performance-demo');
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
  const select = getSeoSelectElement('performance-demo');
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
  const select = getSeoSelectElement('performance-demo');
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
  const select = getSeoSelectElement('performance-demo');
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

// DynamicDemoActions 네임스페이스로 내보내기
export const DynamicDemoActions = {
  loadTechStack,
  loadLanguages,
  loadFrameworks,
  clearAllOptions,
  addCustomOption,
  removeOption,
  loadUserData,
  loadCountryData,
  simulateApiError,
  loadIncrementalData,
  performanceTest1K,
  performanceTest10K,
  performanceTestUpdates,
  clearPerformanceDemo,
};
