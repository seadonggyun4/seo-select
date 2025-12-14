/**
 * 클립보드 관련 유틸리티
 */

import { showNotification } from './notification';

/**
 * 텍스트를 클립보드에 복사 (Clipboard API → execCommand 폴백)
 */
async function writeTextToClipboard(text: string): Promise<void> {
  const normalized = text.replace(/\u00A0/g, ' ');

  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    await navigator.clipboard.writeText(normalized);
    return;
  }

  // 폴백: 임시 textarea
  const ta = document.createElement('textarea');
  ta.value = normalized;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  ta.style.pointerEvents = 'none';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();

  try {
    const ok = document.execCommand('copy');
    if (!ok) throw new Error('execCommand copy failed');
  } finally {
    document.body.removeChild(ta);
  }
}

/**
 * 버튼 상태 표시 유틸
 */
function flashButton(btn: HTMLElement | null | undefined, label: string, ms = 1300): void {
  if (!btn) return;

  const prev = btn.textContent || '';
  const prevDisabled = (btn as HTMLButtonElement).disabled;
  (btn as HTMLButtonElement).disabled = true;
  btn.textContent = label;

  setTimeout(() => {
    btn.textContent = prev;
    (btn as HTMLButtonElement).disabled = prevDisabled;
  }, ms);
}

/**
 * 텍스트를 클립보드에 복사
 */
export async function copyToClipboard(text: string, btn?: HTMLElement): Promise<void> {
  try {
    await writeTextToClipboard(text);
    flashButton(btn, 'Copied!');
    showNotification('Code copied');
  } catch (e) {
    console.error(e);
    flashButton(btn, 'Failed', 1600);
    showNotification('Copy failed');
  }
}

/**
 * 코드 블록의 내용을 클립보드에 복사
 */
export async function copyCodeBlock(triggerBtn: HTMLElement): Promise<void> {
  const wrapper = triggerBtn.closest('.code-block') as HTMLElement | null;
  const codeEl =
    wrapper?.querySelector('pre > code') ||
    wrapper?.querySelector('pre') ||
    wrapper?.querySelector('code');

  const text = (codeEl?.textContent || '').trim();

  if (!text) {
    flashButton(triggerBtn, 'No code', 1200);
    showNotification('No code to copy.');
    return;
  }

  try {
    await writeTextToClipboard(text);
    flashButton(triggerBtn, 'Copied!');
    showNotification('Code copied');
  } catch (e) {
    console.error(e);
    flashButton(triggerBtn, 'Failed', 1600);
    showNotification('Copy failed');
  }
}
