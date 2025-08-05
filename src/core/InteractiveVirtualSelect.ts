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

    requestAnimationFrame(() => {
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

  // 활성화 해제: 모든 하이라이트 클래스 제거
  deactivate(): void {
    this.pool.forEach(this._resetClass);
  }

  // 주어진 인덱스로 스크롤 이동 및 렌더링
  renderToIndex(index: number): void {
    const clamped = Math.max(0, Math.min(index, this.total - 1));
    const halfVisible = Math.floor(this.visibleCount / 2);
    const startIdx = Math.max(0, clamped - halfVisible);
    const scrollTop = startIdx * this.rowHeight;

    // 너무 자주 조정되지 않도록 오차 허용
    if (Math.abs(this.container.scrollTop - scrollTop) > 1) {
      this.container.scrollTop = scrollTop;
    }

    this.render();
  }

  // wrapper 엘리먼트를 보장
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

  // 가상 리스트용 padding 영역 생성
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

  // 컨테이너 및 풀 크기 초기화
  private _initializeContainer(extraHeight: number = 0): void {
    const maxHeight = 360;
    const computedHeight = this.total * this.rowHeight;
    const finalHeight = this.total > 10 ? maxHeight : computedHeight;

    this.container.style.height = `${finalHeight + 5 + extraHeight}px`;
    this.visibleCount = Math.max(1, Math.ceil((finalHeight + extraHeight) / this.rowHeight));
    
    // total이 작을 때는 실제 필요한 만큼만 pool 생성
    const idealPoolSize = this.visibleCount + this.overscan * 2;
    this.poolSize = Math.min(idealPoolSize, this.total);
    
    this.container.style.setProperty('--row-height', `${this.rowHeight}px`);
    this.wrapper.style.height = `${this.total * this.rowHeight}px`;
  }

  // option 요소 풀 구성
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

  // 풀 크기 재조정 - 새로운 메서드 추가
  private _rebuildPoolIfNeeded(): void {
    const idealPoolSize = this.visibleCount + this.overscan * 2;
    const newPoolSize = Math.min(idealPoolSize, this.total);
    
    if (newPoolSize !== this.poolSize) {
      console.log(`Pool size changed: ${this.poolSize} -> ${newPoolSize}`);
      this.poolSize = newPoolSize;
      this._buildPool();
    }
  }

  // 스크롤 이벤트 바인딩
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
        requestAnimationFrame(() => {
          this.render();
          this._ticking = false;
        });
      }
    };

    this.container.addEventListener('scroll', this._onScroll, { passive: true });
  }

  // 현재 표시 상태 여부 확인
  private _isVisible(): boolean {
    return this.container.offsetParent !== null && this.container.offsetHeight > 0;
  }

  // 가상 리스트 렌더링
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

      requestAnimationFrame(() => {
        const delta = Math.abs(this.container.scrollTop - scrollTop);
        if (delta > 1) {
          this.container.scrollTop = scrollTop;
        }
        this._applyHighlight();
      });
    }
    this._applyHighlight();
  }

  // index로 활성화 설정
  setActiveIndex(index: number): void {
    if (index < 0 || index >= this.total) return;

    // focusedIndex는 모든 모드에서 설정
    this.focusedIndex = index;

    // 단일 선택 모드일 때만 activeIndex 설정
    if (!this.isMultiple) {
      this.activeIndex = index;
    }

    this.renderToIndex(index);

    // 즉시 하이라이트 적용
    this._applyHighlight();
  }

  // padding 영역 설정
  private _setPlaceholders(startIdx: number, endIdx: number): void {
    const topPad = startIdx * this.rowHeight;
    const botPad = (this.total - endIdx) * this.rowHeight;
    this.container.style.setProperty('--top-placeholder', `${topPad}px`);
    this.container.style.setProperty('--bottom-placeholder', `${botPad}px`);
    (this.topPad.firstElementChild as HTMLElement).style.height = `${topPad}px`;
    (this.botPad.firstElementChild as HTMLElement).style.height = `${botPad}px`;
    this.wrapper.style.height = `${this.total * this.rowHeight}px`;
  }

  // 옵션 풀 재사용하여 렌더링
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

      // renderOption 콜백 호출 (있다면)
      if (this.renderOption) {
        this.renderOption(el, option);
      }

      // multi 모드일 때는 active 클래스 강제 제거
      if (this.isMultiple) {
        el.classList.remove('active');
      }
    }
  }

  // 강조 클래스 적용 - multi 모드일 때는 active 클래스 제외
  private _applyHighlight(): void {
    for (const el of this.pool) {
      const idx = parseInt(el.dataset.index || '-1', 10);
      if (!Number.isFinite(idx)) continue;

      // multi 모드가 아닐 때만 active 클래스 적용
      if (!this.isMultiple) {
        el.classList.toggle('active', idx === this.activeIndex);
        el.setAttribute('aria-selected', (idx === this.activeIndex).toString());
      } else {
        el.removeAttribute('aria-selected');
      }

      el.classList.toggle('focused', idx === this.focusedIndex);
      
      // ARIA 상태 업데이트
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

  // 비활성 옵션 처리
  private _handleDisabledOption(el: HTMLElement, opt: OptionData): void {
    const isDisabled = opt?.value === 'no_match';
    el.classList.toggle('disabled', isDisabled);
    el.setAttribute('aria-disabled', isDisabled.toString());
    if (isDisabled) {
      this.container.style.height = '80px';
    }
  }

  // 강조 클래스 초기화
  private _resetClass(el: HTMLElement): void {
    el.classList.remove('active', 'focused');
    el.removeAttribute('aria-selected');
    el.removeAttribute('aria-current');
  }

  // 옵션 엘리먼트 생성 - div 요소를 사용하고 ARIA 속성 추가
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

  // 클릭 이벤트 처리
  private _handleClick(e: Event, el: HTMLElement): void {
    const index = parseInt(el.dataset.index || '-1', 10);
    const option = this.data[index];
    if (option?.value === 'no_match') return;
    this.onClick?.(option, index, e);

    // 다중 선택 모드가 아닐 때만 activeIndex 설정
    if (!this.isMultiple) {
      this.activeIndex = index;
    }

    this.focusedIndex = index;
    this._applyHighlight();
  }

  // 키보드 입력 처리
  handleKeydown = (e: KeyboardEvent): void => {
    switch (e.key) {
      case 'Tab': {
        e.preventDefault();

        if (e.shiftKey) {
          // Shift + Tab => 뒤로 이동
          if (this.data[0]?.value === 'no_match') return;
          this.setFocusedIndex(this.focusedIndex - 1);
        } else {
          // Tab 단독 => 앞으로 이동
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

  // 포커스 인덱스 설정
  setFocusedIndex(index: number): void {
    this.focusedIndex = Math.max(0, Math.min(index, this.total - 1));
    this.render();
    this._scrollIntoView(this.focusedIndex);
  }

  // 포커스된 아이템이 보이도록 스크롤
  private _scrollIntoView(index: number): void {
    const offset = this.total > 10 ? 9 : this.total - 1;
    const top = (index - offset) * this.rowHeight;
    const minScroll = Math.max(0, top);
    this.container.scrollTop = minScroll;
  }

  // 현재 포커스된 옵션 반환
  getFocusedOption(): OptionData | null {
    return this.focusedIndex >= 0 && this.focusedIndex < this.data.length
      ? this.data[this.focusedIndex]
      : null;
  }

  // 데이터 갱신 및 렌더링 - 개선된 버전
  setData(newData: OptionData[], activeValue?: string): void {
    this.data = newData;
    this.total = newData.length;
    this._prevStart = -1;
    this._prevEnd = -1;

    // ARIA 속성 업데이트
    this.wrapper.setAttribute('aria-multiselectable', this.isMultiple.toString());

    const matchedIndex = activeValue != null && activeValue !== undefined
      ? this.data.findIndex(opt => opt.value === activeValue)
      : -1;

    // 다중 선택 모드가 아닐 때만 activeIndex 설정
    if (!this.isMultiple) {
      this.activeIndex = matchedIndex >= 0 ? matchedIndex : 0;
    }

    this.focusedIndex = matchedIndex >= 0 ? matchedIndex : 0;
    this.container.scrollTop = 0;

    // 컨테이너 및 풀 크기 재계산
    this._initializeContainer();
    
    // 풀 크기가 변경되었다면 풀을 다시 빌드
    this._rebuildPoolIfNeeded();
    
    this._setPlaceholders(0, Math.min(this.total, this.pool.length));
    this._renderPool(0);
    this._applyHighlight();
    
    // 풀의 모든 요소에 새로운 aria-setsize 설정
    this.pool.forEach(el => {
      el.setAttribute('aria-setsize', String(this.total));
    });
  }

  // 데이터 완전 클리어 - 개선된 버전
  clearData(): void {
    this.data = [];
    this.total = 0;
    this.focusedIndex = -1;
    this.activeIndex = -1;
    this._prevStart = -1;
    this._prevEnd = -1;

    // 풀의 모든 요소 숨기기
    this.pool.forEach(el => {
      el.style.display = 'none';
      el.removeAttribute('data-index');
      el.removeAttribute('aria-posinset');
      this._resetClass(el);
    });

    // 컨테이너 높이 최소화
    this.container.style.height = '0px';
    this.wrapper.style.height = '0px';
    
    // placeholder 초기화
    this.container.style.setProperty('--top-placeholder', '0px');
    this.container.style.setProperty('--bottom-placeholder', '0px');
    (this.topPad.firstElementChild as HTMLElement).style.height = '0px';
    (this.botPad.firstElementChild as HTMLElement).style.height = '0px';

    // ARIA 속성 정리
    this.wrapper.removeAttribute('aria-activedescendant');

    // 풀 크기 재계산 - 빈 데이터에 맞춰 조정
    this.poolSize = 0;
    // 풀을 완전히 비우지는 않고, 필요시 재사용할 수 있도록 유지
    // 하지만 다음 setData 호출 시 _rebuildPoolIfNeeded()에서 적절히 조정됨
  }

  // 파괴 및 이벤트 제거
  destroy(): void {
    this.container.removeEventListener('scroll', this._onScroll);
    this.pool.forEach(el => el.remove());
    this.wrapper.style.height = '0';
    this.topPad?.remove();
    this.botPad?.remove();
    this.pool = [];
    if (InteractiveVirtualSelect.activeInstance === this) {
      InteractiveVirtualSelect.activeInstance = null;
    }
  }

  // 외부에서 하이라이트를 적용할 수 있는 public 메서드
  public applyHighlight(): void {
    this._applyHighlight();
  }

  // 외부에서 activeIndex와 focusedIndex를 함께 설정하는 헬퍼 메서드
  public setActiveAndFocusedIndex(index: number): void {
    if (index < 0 || index >= this.total) return;
    
    this.focusedIndex = index;
    if (!this.isMultiple) {
      this.activeIndex = index;
    }
    this._applyHighlight();
  }
}