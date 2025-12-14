/**
 * 페이지 로더 관리자
 */

export class PageLoaderManager {
  private readonly LOADER_TIMEOUT = 5000;

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
    Promise.all([
      this.waitForMinimumTime(),
      this.waitForComponentsReady()
    ]).then(() => {
      this.hideLoader(pageLoader, false);
    }).catch((error) => {
      console.error('Loading error:', error);
      setTimeout(() => this.hideLoader(pageLoader, false), this.LOADER_TIMEOUT);
    });
  }

  private waitForMinimumTime(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, 1500);
    });
  }

  private async waitForComponentsReady(): Promise<void> {
    await this.waitForWebComponents();
    await this.waitForDOMReady();
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
        const headerDemo = document.querySelector('seo-select-search[name="welcome"]');
        const demoNav = document.querySelector('.demo-nav');
        const content = document.querySelector('.content');

        if (headerDemo && demoNav && content) {
          requestAnimationFrame(() => {
            resolve();
          });
        } else {
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

/**
 * 페이지 로더 안전 장치 초기화
 */
export function initializeLoaderSafety(): void {
  // 최대 10초 후 강제로 로더 숨김
  setTimeout(() => {
    const loader = document.querySelector('.page-loder') as HTMLElement | null;
    if (loader && loader.style.display !== 'none' && !loader.classList.contains('full-hide')) {
      loader.style.display = 'none';
      console.warn('Page loader hidden by safety timeout (10s)');
    }
  }, 10000);

  // 에러 발생 시 로더 숨김
  window.addEventListener('error', (event) => {
    const loader = document.querySelector('.page-loder') as HTMLElement | null;
    if (loader && loader.style.display !== 'none') {
      loader.style.display = 'none';
      console.warn('Page loader hidden due to error:', event.error);
    }
  });

  // 스크립트 로드 에러 시 로더 숨김
  window.addEventListener('unhandledrejection', (event) => {
    const loader = document.querySelector('.page-loder') as HTMLElement | null;
    if (loader && loader.style.display !== 'none') {
      loader.style.display = 'none';
      console.warn('Page loader hidden due to unhandled rejection:', event.reason);
    }
  });
}
