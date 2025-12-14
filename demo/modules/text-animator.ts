/**
 * 텍스트 애니메이터 클래스
 * 텍스트 순환 애니메이션과 연기 효과를 제공
 */

export class SimpleTextAnimator {
  private texts: NodeListOf<HTMLElement>;
  private currentIndex: number = 0;
  private isAnimating: boolean = false;
  private isPaused: boolean = false;
  private intervalId: number | null = null;
  private speed: number = 3000;
  private isHighSpeed: boolean = false;

  constructor(selector: string = '.text-item') {
    this.texts = document.querySelectorAll(selector);

    if (this.texts.length === 0) {
      console.warn(`텍스트 요소를 찾을 수 없습니다: ${selector}`);
      return;
    }

    this.start();
  }

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

  public next(): void {
    if (this.isAnimating || this.texts.length === 0) return;

    this.isAnimating = true;
    const currentText = this.texts[this.currentIndex];
    const nextIndex = (this.currentIndex + 1) % this.texts.length;
    const nextText = this.texts[nextIndex];

    currentText.classList.add('smoke-out');
    currentText.classList.remove('active');

    setTimeout(() => {
      this.texts.forEach(text => {
        text.classList.remove('active', 'smoke-out');
      });

      nextText.classList.add('active');
      this.currentIndex = nextIndex;

      setTimeout(() => {
        this.isAnimating = false;
      }, 100);
    }, 400);
  }

  public pause(): void {
    this.isPaused = true;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public resume(): void {
    if (this.isPaused) {
      this.isPaused = false;
      this.start();
    }
  }

  public toggleSpeed(): void {
    this.isHighSpeed = !this.isHighSpeed;
    this.speed = this.isHighSpeed ? 1000 : 3000;

    if (!this.isPaused) {
      this.start();
    }
  }

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

  public goToIndex(index: number): void {
    if (index < 0 || index >= this.texts.length) {
      console.warn('유효하지 않은 인덱스입니다.');
      return;
    }

    if (this.isAnimating) return;

    this.texts.forEach(text => {
      text.classList.remove('active', 'smoke-out');
    });

    this.texts[index].classList.add('active');
    this.currentIndex = index;
  }

  public handleVisibilityChange(): void {
    if (document.hidden) {
      this.pause();
    } else {
      this.resume();
    }
  }

  public destroy(): void {
    this.pause();

    this.texts.forEach(text => {
      text.classList.remove('active', 'smoke-out');
    });
  }

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

  public getCurrentText(): string {
    return this.texts[this.currentIndex]?.textContent || '';
  }

  public getAllTexts(): string[] {
    return Array.from(this.texts).map(text => text.textContent || '');
  }
}

// 전역 애니메이터 인스턴스
let globalAnimator: SimpleTextAnimator | null = null;

/**
 * 애니메이터 초기화 함수
 */
export function initializeTextAnimator(
  selector: string = '.text-item',
  autoSetupEvents: boolean = true
): SimpleTextAnimator {
  const animator = new SimpleTextAnimator(selector);

  if (autoSetupEvents) {
    document.addEventListener('visibilitychange', () => {
      animator.handleVisibilityChange();
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      animator.pause();
    }

    window.addEventListener('beforeunload', () => {
      animator.destroy();
    });
  }

  return animator;
}

/**
 * 전역 애니메이터 생성
 */
export function createGlobalAnimator(selector?: string): SimpleTextAnimator {
  if (globalAnimator) {
    globalAnimator.destroy();
  }

  globalAnimator = initializeTextAnimator(selector);
  return globalAnimator;
}

/**
 * 전역 애니메이터 반환
 */
export function getGlobalAnimator(): SimpleTextAnimator | null {
  return globalAnimator;
}

/**
 * 전역 애니메이터 설정
 */
export function setGlobalAnimator(animator: SimpleTextAnimator | null): void {
  globalAnimator = animator;
}
