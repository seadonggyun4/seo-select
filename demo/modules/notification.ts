/**
 * 알림 시스템
 */

import { CONFIG } from './constants';

/**
 * 화면에 알림 메시지 표시
 */
export function showNotification(message: string): void {
  // 기존 알림 제거
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

  // 알림 표시 애니메이션
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // 알림 숨김 애니메이션
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, CONFIG.NOTIFICATION_FADE_DELAY);
  }, CONFIG.NOTIFICATION_DURATION);
}
