import { isBrowser, safeRequestAnimationFrame } from '../utils/environment.js';

interface OptionData {
  value: string;
  label: string;
  [key: string]: any;
}

interface InteractiveVirtualSelectOptions {
  rowHeight?: number;
  overscan?: number;
  renderOption?: ((element: HTMLElement, option: OptionData) => void) | null;
  onClick?: ((option: OptionData, index: number, event: Event) => void) | null;
  onEscape?: (() => void) | null;
  isMultiple?: boolean;
}

export class InteractiveVirtualSelect {
  static activeInstance: InteractiveVirtualSelect | null = null;

  private container: HTMLElement;
  private data: OptionData[];
  private rowHeight: number;
  private overscan: number;
  private renderOption: ((element: HTMLElement, option: OptionData) => void) | null;
  private onClick: ((option: OptionData, index: number, event: Event) => void) | null;
  private onEscape: (() => void) | null;
  private isMultiple: boolean;

  private total: number;
  private focusedIndex: number;
  private activeIndex: number;
  private _prevStart: number;
  private _prevEnd: number;
  private pool: HTMLElement[];

  private wrapper!: HTMLElement;
  private topPad!: HTMLElement;
  private botPad!: HTMLElement;
  private visibleCount!: number;
  private poolSize!: number;

  private _ticking: boolean = false;
  private _prevStartIdx: number = -1;
  private _onScroll!: () => void;

  constructor(container: HTMLElement, data: OptionData[], options: InteractiveVirtualSelectOptions = {}) {
    // SSR 환경에서는 초기화하지 않음
    if (!isBrowser()) {
      this.container = container;
      this.data = data;
      this.rowHeight = options.rowHeight || 36;
      this.overscan = options.overscan || 20;
      this.renderOption = options.renderOption || null;
      this.onClick = options.onClick || null;
      this.onEscape = options.onEscape || null;
      this.isMultiple = options.isMultiple || false;
      this.total = data.length;
      this.focusedIndex = -1;
      this.activeIndex = -1;
      this._prevStart = -1;
      this._prevEnd = -1;
      this.pool = [];
      return;
    }

    this.container = container;
    this.data = data;
    this.rowHeight = options.rowHeight || 36;
    this.overscan = options.overscan || 20;
    this.renderOption = options.renderOption || null;
    this.onClick = options.onClick || null;
    this.onEscape = options.onEscape || null;
    this.isMultiple = options.isMultiple || false;

    this.total = data.length;
    this.focusedIndex = -1;
    this.activeIndex = -1;
    this._prevStart = -1;
    this._prevEnd = -1;
    this.pool = [];

    this._ensureWrapper();
    this._buildDOM();

    safeRequestAnimationFrame(() => {
      this._initializeContainer();
      this._buildPool();
      this._bindScroll();

      if (InteractiveVirtualSelect.activeInstance && InteractiveVirtualSelect.activeInstance !== this) {
        InteractiveVirtualSelect.activeInstance.deactivate();
      }

      InteractiveVirtualSelect.activeInstance = this;
      this.render();
    });
  }

  deactivate(): void {
    this.pool.forEach(this._resetClass);
  }

  renderToIndex(index: number): void {
    const clamped = Math.max(0, Math.min(index, this.total - 1));
    const halfVisible = Math.floor(this.visibleCount / 2);
    const startIdx = Math.max(0, clamped - halfVisible);
    const scrollTop = startIdx * this.rowHeight;

    if (Math.abs(this.container.scrollTop - scrollTop) > 1) {
      this.container.scrollTop = scrollTop;
    }

    this.render();
  }

  private _ensureWrapper(): void {
    this.wrapper = this.container.querySelector('.option-wrapper') as HTMLElement || document.createElement('div');
    this.wrapper.className = 'option-wrapper';
    this.wrapper.setAttribute('role', 'listbox');
    this.wrapper.setAttribute('aria-multiselectable', this.isMultiple.toString());
    
    if (!this.wrapper.parentElement) {
      this.container.appendChild(this.wrapper);
    }
    this.wrapper.innerHTML = '';
  }

  private _buildDOM(): void {
    this.topPad = document.createElement('div');
    this.topPad.className = 'virtual-placeholder top';
    this.topPad.setAttribute('aria-hidden', 'true');
    this.topPad.appendChild(document.createElement('div'));

    this.botPad = document.createElement('div');
    this.botPad.className = 'virtual-placeholder bottom';
    this.botPad.setAttribute('aria-hidden', 'true');
    this.botPad.appendChild(document.createElement('div'));

    this.wrapper.append(this.topPad, this.botPad);
  }

  private _initializeContainer(extraHeight: number = 0): void {
    if (this.total === 0) {
      this.container.style.height = 'auto';
      this.container.style.minHeight = '0';
      this.visibleCount = 0;
      this.poolSize = 0;
      return;
    }

    const maxHeight = 360;
    const computedHeight = this.total * this.rowHeight;
    const finalHeight = this.total > 10 ? maxHeight : computedHeight;

    this.container.style.height = `${finalHeight + 5 + extraHeight}px`;
    this.container.style.minHeight = '';
    this.visibleCount = Math.max(1, Math.ceil((finalHeight + extraHeight) / this.rowHeight));
    
    const idealPoolSize = this.visibleCount + this.overscan * 2;
    this.poolSize = Math.min(idealPoolSize, this.total);
    
    this.container.style.setProperty('--row-height', `${this.rowHeight}px`);
    this.wrapper.style.height = `${this.total * this.rowHeight}px`;
  }

  private _buildPool(): void {
    this.pool.forEach(el => el.remove());
    this.pool = [];
    const insertAfter = this.topPad.nextSibling;

    for (let i = 0; i < this.poolSize; i++) {
      const el = this._createOptionElement();
      this.pool.push(el);
      this.wrapper.insertBefore(el, insertAfter);
    }
  }

  private _rebuildPoolIfNeeded(): void {
    const idealPoolSize = this.visibleCount + this.overscan * 2;
    const newPoolSize = Math.min(idealPoolSize, this.total);
    
    if (newPoolSize !== this.poolSize) {
      console.log(`Pool size changed: ${this.poolSize} -> ${newPoolSize}`);
      this.poolSize = newPoolSize;
      this._buildPool();
    }
  }

  private _bindScroll(): void {
    this._ticking = false;
    this._prevStartIdx = -1;

    this._onScroll = () => {
      if (!this._isVisible()) return;

      const scrollTop = this.container.scrollTop;
      const startIdx = Math.floor(scrollTop / this.rowHeight);

      if (startIdx === this._prevStartIdx) return;
      this._prevStartIdx = startIdx;

      if (!this._ticking) {
        this._ticking = true;
        safeRequestAnimationFrame(() => {
          this.render();
          this._ticking = false;
        });
      }
    };

    this.container.addEventListener('scroll', this._onScroll, { passive: true });
  }

  private _isVisible(): boolean {
    return this.container.offsetParent !== null && this.container.offsetHeight > 0;
  }

  render(): void {
    const scrollTop = this.container.scrollTop;
    const startIdx = Math.max(0, Math.floor(scrollTop / this.rowHeight) - this.overscan);
    const endIdx = Math.min(this.total, startIdx + this.poolSize);
    const sameRange = this._prevStart === startIdx && this._prevEnd === endIdx;

    if (!sameRange) {
      this._prevStart = startIdx;
      this._prevEnd = endIdx;
      this._setPlaceholders(startIdx, endIdx);
      this._renderPool(startIdx);

      safeRequestAnimationFrame(() => {
        const delta = Math.abs(this.container.scrollTop - scrollTop);
        if (delta > 1) {
          this.container.scrollTop = scrollTop;
        }
        this._applyHighlight();
      });
    }
    this._applyHighlight();
  }

  setActiveIndex(index: number): void {
    if (index < 0 || index >= this.total) return;

    this.focusedIndex = index;

    if (!this.isMultiple) {
      this.activeIndex = index;
    }

    this.renderToIndex(index);

    this._applyHighlight();
  }

  private _setPlaceholders(startIdx: number, endIdx: number): void {
    const topPad = startIdx * this.rowHeight;
    const botPad = (this.total - endIdx) * this.rowHeight;
    this.container.style.setProperty('--top-placeholder', `${topPad}px`);
    this.container.style.setProperty('--bottom-placeholder', `${botPad}px`);
    (this.topPad.firstElementChild as HTMLElement).style.height = `${topPad}px`;
    (this.botPad.firstElementChild as HTMLElement).style.height = `${botPad}px`;
    this.wrapper.style.height = `${this.total * this.rowHeight}px`;
  }

  private _renderPool(startIdx: number): void {
    for (let i = 0; i < this.pool.length; i++) {
      const el = this.pool[i];
      const dataIdx = startIdx + i;

      if (dataIdx >= this.total) {
        el.style.display = 'none';
        el.removeAttribute('data-index');
        el.removeAttribute('aria-posinset');
        continue;
      }

      const option = this.data[dataIdx];
      el.style.display = '';
      el.dataset.index = String(dataIdx);
      el.setAttribute('aria-posinset', String(dataIdx + 1));
      
      if ((el as any)._value !== option.value) {
        el.textContent = option.label;
        (el as any)._value = option.value;
      }
      this._handleDisabledOption(el, option);
      this._resetClass(el);

      if (this.renderOption) {
        this.renderOption(el, option);
      }

      if (this.isMultiple) {
        el.classList.remove('active');
      }
    }
  }

  private _applyHighlight(): void {
    for (const el of this.pool) {
      const idx = parseInt(el.dataset.index || '-1', 10);
      if (!Number.isFinite(idx)) continue;

      if (!this.isMultiple) {
        el.classList.toggle('active', idx === this.activeIndex);
        el.setAttribute('aria-selected', (idx === this.activeIndex).toString());
      } else {
        el.removeAttribute('aria-selected');
      }

      el.classList.toggle('focused', idx === this.focusedIndex);
      
      if (idx === this.focusedIndex) {
        el.setAttribute('aria-current', 'true');
        this.wrapper.setAttribute('aria-activedescendant', el.id || `option-${idx}`);
        if (!el.id) {
          el.id = `option-${idx}`;
        }
      } else {
        el.removeAttribute('aria-current');
      }
    }
  }

  private _handleDisabledOption(el: HTMLElement, opt: OptionData): void {
    const isDisabled = opt?.value === 'no_match';
    el.classList.toggle('disabled', isDisabled);
    el.setAttribute('aria-disabled', isDisabled.toString());
    if (isDisabled) {
      this.container.style.height = '80px';
    }
  }

  private _resetClass(el: HTMLElement): void {
    el.classList.remove('active', 'focused');
    el.removeAttribute('aria-selected');
    el.removeAttribute('aria-current');
  }

  private _createOptionElement(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'option';
    el.setAttribute('role', 'option');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('aria-setsize', String(this.total));
    el.style.height = 'var(--row-height)';
    
    el.addEventListener('click', (e) => this._handleClick(e, el));

    el.addEventListener('mouseenter', () => {
      const idx = parseInt(el.dataset.index || '-1', 10);
      if (!Number.isFinite(idx)) return;
      this.focusedIndex = idx;
      this._applyHighlight();
    });
    
    return el;
  }

  private _handleClick(e: Event, el: HTMLElement): void {
    const index = parseInt(el.dataset.index || '-1', 10);
    const option = this.data[index];
    if (option?.value === 'no_match') return;
    this.onClick?.(option, index, e);

    if (!this.isMultiple) {
      this.activeIndex = index;
    }

    this.focusedIndex = index;
    this._applyHighlight();
  }

  handleKeydown = (e: KeyboardEvent): void => {
    switch (e.key) {
      case 'Tab': {
        e.preventDefault();

        if (e.shiftKey) {
          if (this.data[0]?.value === 'no_match') return;
          this.setFocusedIndex(this.focusedIndex - 1);
        } else {
          const nextIndex = this.focusedIndex + 1;
          if (this.data[nextIndex]?.value === 'no_match') return;
          if (nextIndex >= this.total) {
            const maxScrollTop = this.container.scrollHeight - this.container.clientHeight;
            this.container.scrollTop = maxScrollTop;
          } else {
            this.setFocusedIndex(nextIndex);
          }
        }
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        const nextIndex = this.focusedIndex + 1;
        if (this.data[nextIndex]?.value === 'no_match') return;
        if (nextIndex >= this.total) {
          const maxScrollTop = this.container.scrollHeight - this.container.clientHeight;
          this.container.scrollTop = maxScrollTop;
        } else {
          this.setFocusedIndex(nextIndex);
        }
        break;
      }
      case 'ArrowUp':
        e.preventDefault();
        if (this.data[0]?.value === 'no_match') return;
        this.setFocusedIndex(this.focusedIndex - 1);
        break;
      case 'Enter': {
        e.preventDefault();
        const opt = this.getFocusedOption();
        if (opt) {
          this.onClick?.(opt, this.focusedIndex, e);

          if (!this.isMultiple) {
            this.activeIndex = this.focusedIndex;
          }

          this._applyHighlight();
        }
        break;
      }
      case 'Escape':
        e.preventDefault();
        this.onEscape?.();
        break;
    }
  };

  setFocusedIndex(index: number): void {
    this.focusedIndex = Math.max(0, Math.min(index, this.total - 1));
    this.render();
    this._scrollIntoView(this.focusedIndex);
  }

  private _scrollIntoView(index: number): void {
    const offset = this.total > 10 ? 9 : this.total - 1;
    const top = (index - offset) * this.rowHeight;
    const minScroll = Math.max(0, top);
    this.container.scrollTop = minScroll;
  }

  getFocusedOption(): OptionData | null {
    return this.focusedIndex >= 0 && this.focusedIndex < this.data.length
      ? this.data[this.focusedIndex]
      : null;
  }

  setData(newData: OptionData[], activeValue?: string): void {
    const wasEmpty = this.total === 0;
    const hadData = this.total > 0;
    
    this.data = newData;
    this.total = newData.length;
    this._prevStart = -1;
    this._prevEnd = -1;

    this.wrapper.setAttribute('aria-multiselectable', this.isMultiple.toString());

    const matchedIndex = activeValue != null && activeValue !== undefined
      ? this.data.findIndex(opt => opt.value === activeValue)
      : -1;

    if (!this.isMultiple) {
      this.activeIndex = matchedIndex >= 0 ? matchedIndex : (this.total > 0 ? 0 : -1);
    }

    this.focusedIndex = matchedIndex >= 0 ? matchedIndex : (this.total > 0 ? 0 : -1);

    this.container.scrollTop = 0;

    if (this.total > 0) {
      this._initializeContainer();

      this._rebuildPoolIfNeeded();

      const endIdx = Math.min(this.total, this.poolSize);
      this._setPlaceholders(0, endIdx);
      this._renderPool(0);

      safeRequestAnimationFrame(() => {
        this._applyHighlight();

        if (this.focusedIndex >= 0) {
          this._scrollIntoView(this.focusedIndex);
        }
      });
    } else {
      this.clearData();
      return;
    }
    
    this.pool.forEach(el => {
      el.setAttribute('aria-setsize', String(this.total));
    });

    if (wasEmpty && this.total > 0) {
      this.container.style.display = '';
    } else if (hadData && this.total === 0) {
      this.container.style.height = 'auto';
      this.container.style.minHeight = '0';
    }
  }

  clearData(): void {
    this.data = [];
    this.total = 0;
    this.focusedIndex = -1;
    this.activeIndex = -1;
    this._prevStart = -1;
    this._prevEnd = -1;

    this.pool.forEach(el => {
      el.style.display = 'none';
      el.removeAttribute('data-index');
      el.removeAttribute('aria-posinset');
      el.removeAttribute('aria-current');
      el.removeAttribute('aria-selected');
      this._resetClass(el);
    });

    this.container.style.height = 'auto';
    this.container.style.minHeight = '0';
    this.wrapper.style.height = '0px';
    
    this.container.style.setProperty('--top-placeholder', '0px');
    this.container.style.setProperty('--bottom-placeholder', '0px');
    (this.topPad.firstElementChild as HTMLElement).style.height = '0px';
    (this.botPad.firstElementChild as HTMLElement).style.height = '0px';

    this.wrapper.removeAttribute('aria-activedescendant');

    this.container.scrollTop = 0;

    this.poolSize = 0;
    this.visibleCount = 0;

    safeRequestAnimationFrame(() => {
      this.container.offsetHeight;
    });
  }

  updateDataItem(index: number, newData: OptionData): void {
    if (index < 0 || index >= this.total) return;
    
    this.data[index] = newData;
    
    if (index >= this._prevStart && index < this._prevEnd) {
      const poolIndex = index - this._prevStart;
      if (poolIndex >= 0 && poolIndex < this.pool.length) {
        const el = this.pool[poolIndex];
        
        el.textContent = newData.label;
        (el as any)._value = newData.value;
        
        this._handleDisabledOption(el, newData);
        this._resetClass(el);
        
        if (this.renderOption) {
          this.renderOption(el, newData);
        }
        
        if (this.isMultiple) {
          el.classList.remove('active');
        }

        safeRequestAnimationFrame(() => {
          this._applyHighlight();
        });
      }
    }
  }

  appendDataItem(newData: OptionData): void {
    this.data.push(newData);
    this.total = this.data.length;
    
    this._initializeContainer();
    this._rebuildPoolIfNeeded();
    
    this.wrapper.style.height = `${this.total * this.rowHeight}px`;
    
    this.pool.forEach(el => {
      el.setAttribute('aria-setsize', String(this.total));
    });
    
    const currentEndIdx = Math.min(this.total, this._prevStart + this.poolSize);
    if (currentEndIdx > this._prevEnd) {
      this._setPlaceholders(this._prevStart, currentEndIdx);
      this._renderPool(this._prevStart);
    }

    safeRequestAnimationFrame(() => {
      this._applyHighlight();
    });
  }

  removeDataItem(index: number): void {
    if (index < 0 || index >= this.total) return;
    
    this.data.splice(index, 1);
    this.total = this.data.length;
    
    if (this.focusedIndex >= index && this.focusedIndex > 0) {
      this.focusedIndex--;
    }
    if (this.activeIndex >= index && this.activeIndex > 0) {
      this.activeIndex--;
    }
    
    if (this.total === 0) {
      this.clearData();
      return;
    }
    
    this._initializeContainer();
    this._rebuildPoolIfNeeded();
    
    this.wrapper.style.height = `${this.total * this.rowHeight}px`;
    
    this.pool.forEach(el => {
      el.setAttribute('aria-setsize', String(this.total));
    });
    
    this._prevStart = -1;
    this._prevEnd = -1;
    this.render();
  }

  refreshVisibleItems(): void {
    if (this.total === 0) return;
    
    const scrollTop = this.container.scrollTop;
    const startIdx = Math.max(0, Math.floor(scrollTop / this.rowHeight) - this.overscan);
    const endIdx = Math.min(this.total, startIdx + this.poolSize);
    
    this._setPlaceholders(startIdx, endIdx);
    this._renderPool(startIdx);

    safeRequestAnimationFrame(() => {
      this._applyHighlight();
    });
  }

  destroy(): void {
    // 스크롤 이벤트 제거
    this.container.removeEventListener('scroll', this._onScroll);

    // 풀 요소 제거 및 이벤트 리스너 정리
    this.pool.forEach(el => {
      el.replaceWith(el.cloneNode(false)); // 이벤트 리스너 제거를 위해 노드 교체
      el.remove();
    });

    this.wrapper.style.height = '0';
    this.topPad?.remove();
    this.botPad?.remove();
    this.pool = [];

    // 콜백 참조 해제 (메모리 누수 방지)
    this.renderOption = null;
    this.onClick = null;
    this.onEscape = null;

    // 데이터 참조 해제
    this.data = [];

    // 정적 인스턴스 정리
    if (InteractiveVirtualSelect.activeInstance === this) {
      InteractiveVirtualSelect.activeInstance = null;
    }
  }

  public applyHighlight(): void {
    this._applyHighlight();
  }

  public setActiveAndFocusedIndex(index: number): void {
    if (index < 0 || index >= this.total) return;
    
    this.focusedIndex = index;
    if (!this.isMultiple) {
      this.activeIndex = index;
    }
    this._applyHighlight();
  }
}