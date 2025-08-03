import { html as h, LitElement as S } from "lit";
import './styles/index.css';const c = class c {
  constructor(t, e, i = {}) {
    this._ticking = !1, this._prevStartIdx = -1, this.handleKeydown = (s) => {
      switch (s.key) {
        case "Tab": {
          if (s.preventDefault(), s.shiftKey) {
            if (this.data[0]?.value === "no_match") return;
            this.setFocusedIndex(this.focusedIndex - 1);
          } else {
            const n = this.focusedIndex + 1;
            if (this.data[n]?.value === "no_match") return;
            if (n >= this.total) {
              const r = this.container.scrollHeight - this.container.clientHeight;
              this.container.scrollTop = r;
            } else
              this.setFocusedIndex(n);
          }
          break;
        }
        case "ArrowDown": {
          s.preventDefault();
          const n = this.focusedIndex + 1;
          if (this.data[n]?.value === "no_match") return;
          if (n >= this.total) {
            const r = this.container.scrollHeight - this.container.clientHeight;
            this.container.scrollTop = r;
          } else
            this.setFocusedIndex(n);
          break;
        }
        case "ArrowUp":
          if (s.preventDefault(), this.data[0]?.value === "no_match") return;
          this.setFocusedIndex(this.focusedIndex - 1);
          break;
        case "Enter": {
          s.preventDefault();
          const n = this.getFocusedOption();
          n && (this.onClick?.(n, this.focusedIndex, s), this.isMultiple || (this.activeIndex = this.focusedIndex), this._applyHighlight());
          break;
        }
        case "Escape":
          s.preventDefault(), this.onEscape?.();
          break;
      }
    }, this.container = t, this.data = e, this.rowHeight = i.rowHeight || 36, this.overscan = i.overscan || 20, this.renderOption = i.renderOption || null, this.onClick = i.onClick || null, this.onEscape = i.onEscape || null, this.isMultiple = i.isMultiple || !1, this.total = e.length, this.focusedIndex = -1, this.activeIndex = -1, this._prevStart = -1, this._prevEnd = -1, this.pool = [], this._ensureWrapper(), this._buildDOM(), requestAnimationFrame(() => {
      this._initializeContainer(), this._buildPool(), this._bindScroll(), c.activeInstance && c.activeInstance !== this && c.activeInstance.deactivate(), c.activeInstance = this, this.render();
    });
  }
  // 활성화 해제: 모든 하이라이트 클래스 제거
  deactivate() {
    this.pool.forEach(this._resetClass);
  }
  // 주어진 인덱스로 스크롤 이동 및 렌더링
  renderToIndex(t) {
    const e = Math.max(0, Math.min(t, this.total - 1)), i = Math.floor(this.visibleCount / 2), n = Math.max(0, e - i) * this.rowHeight;
    Math.abs(this.container.scrollTop - n) > 1 && (this.container.scrollTop = n), this.render();
  }
  // wrapper 엘리먼트를 보장
  _ensureWrapper() {
    this.wrapper = this.container.querySelector(".option-wrapper") || document.createElement("div"), this.wrapper.className = "option-wrapper", this.wrapper.parentElement || this.container.appendChild(this.wrapper), this.wrapper.innerHTML = "";
  }
  // 가상 리스트용 padding 영역 생성
  _buildDOM() {
    this.topPad = document.createElement("div"), this.topPad.className = "virtual-placeholder top", this.topPad.appendChild(document.createElement("div")), this.botPad = document.createElement("div"), this.botPad.className = "virtual-placeholder bottom", this.botPad.appendChild(document.createElement("div")), this.wrapper.append(this.topPad, this.botPad);
  }
  // 컨테이너 및 풀 크기 초기화
  _initializeContainer(t = 0) {
    const i = this.total * this.rowHeight, s = this.total > 10 ? 360 : i;
    this.container.style.height = `${s + 5 + t}px`, this.visibleCount = Math.max(1, Math.ceil((s + t) / this.rowHeight)), this.poolSize = this.visibleCount + this.overscan * 2, this.container.style.setProperty("--row-height", `${this.rowHeight}px`), this.wrapper.style.height = `${this.total * this.rowHeight}px`;
  }
  // option 요소 풀 구성
  _buildPool() {
    this.pool.forEach((e) => e.remove()), this.pool = [];
    const t = this.topPad.nextSibling;
    for (let e = 0; e < this.poolSize; e++) {
      const i = this._createOptionElement();
      this.pool.push(i), this.wrapper.insertBefore(i, t);
    }
  }
  // 스크롤 이벤트 바인딩
  _bindScroll() {
    this._ticking = !1, this._prevStartIdx = -1, this._onScroll = () => {
      if (!this._isVisible()) return;
      const t = this.container.scrollTop, e = Math.floor(t / this.rowHeight);
      e !== this._prevStartIdx && (this._prevStartIdx = e, this._ticking || (this._ticking = !0, requestAnimationFrame(() => {
        this.render(), this._ticking = !1;
      })));
    }, this.container.addEventListener("scroll", this._onScroll, { passive: !0 });
  }
  // 현재 표시 상태 여부 확인
  _isVisible() {
    return this.container.offsetParent !== null && this.container.offsetHeight > 0;
  }
  // 가상 리스트 렌더링
  render() {
    const t = this.container.scrollTop, e = Math.max(0, Math.floor(t / this.rowHeight) - this.overscan), i = Math.min(this.total, e + this.poolSize);
    this._prevStart === e && this._prevEnd === i || (this._prevStart = e, this._prevEnd = i, this._setPlaceholders(e, i), this._renderPool(e), requestAnimationFrame(() => {
      Math.abs(this.container.scrollTop - t) > 1 && (this.container.scrollTop = t), this._applyHighlight();
    })), this._applyHighlight();
  }
  // index로 활성화 설정
  setActiveIndex(t) {
    t < 0 || t >= this.total || (this.focusedIndex = t, this.isMultiple || (this.activeIndex = t), this.renderToIndex(t), this._applyHighlight());
  }
  // padding 영역 설정
  _setPlaceholders(t, e) {
    const i = t * this.rowHeight, s = (this.total - e) * this.rowHeight;
    this.container.style.setProperty("--top-placeholder", `${i}px`), this.container.style.setProperty("--bottom-placeholder", `${s}px`), this.topPad.firstElementChild.style.height = `${i}px`, this.botPad.firstElementChild.style.height = `${s}px`, this.wrapper.style.height = `${this.total * this.rowHeight}px`;
  }
  // 옵션 풀 재사용하여 렌더링
  _renderPool(t) {
    for (let e = 0; e < this.pool.length; e++) {
      const i = this.pool[e], s = t + e;
      if (s >= this.total) {
        i.style.display = "none", i.removeAttribute("data-index");
        continue;
      }
      const n = this.data[s];
      i.style.display = "", i.dataset.index = String(s), i._value !== n.value && (i.textContent = n.label, i._value = n.value), this._handleDisabledOption(i, n), this._resetClass(i), this.renderOption && this.renderOption(i, n), this.isMultiple && i.classList.remove("active");
    }
  }
  // 강조 클래스 적용 - multi 모드일 때는 active 클래스 제외
  _applyHighlight() {
    for (const t of this.pool) {
      const e = parseInt(t.dataset.index || "-1", 10);
      Number.isFinite(e) && (this.isMultiple || t.classList.toggle("active", e === this.activeIndex), t.classList.toggle("focused", e === this.focusedIndex));
    }
  }
  // 비활성 옵션 처리
  _handleDisabledOption(t, e) {
    const i = e?.value === "no_match";
    t.classList.toggle("disabled", i), t.toggleAttribute("aria-disabled", i), i && (this.container.style.height = "80px");
  }
  // 강조 클래스 초기화
  _resetClass(t) {
    t.classList.remove("active", "focused");
  }
  // 옵션 엘리먼트 생성
  _createOptionElement() {
    const t = document.createElement("option");
    return t.className = "option", t.style.height = "var(--row-height)", t.addEventListener("click", (e) => this._handleClick(e, t)), t.addEventListener("mouseenter", () => {
      const e = parseInt(t.dataset.index || "-1", 10);
      Number.isFinite(e) && (this.focusedIndex = e, this._applyHighlight());
    }), t;
  }
  // 클릭 이벤트 처리
  _handleClick(t, e) {
    const i = parseInt(e.dataset.index || "-1", 10), s = this.data[i];
    s?.value !== "no_match" && (this.onClick?.(s, i, t), this.isMultiple || (this.activeIndex = i), this.focusedIndex = i, this._applyHighlight());
  }
  // 포커스 인덱스 설정
  setFocusedIndex(t) {
    this.focusedIndex = Math.max(0, Math.min(t, this.total - 1)), this.render(), this._scrollIntoView(this.focusedIndex);
  }
  // 포커스된 아이템이 보이도록 스크롤
  _scrollIntoView(t) {
    const e = this.total > 10 ? 9 : this.total - 1, i = (t - e) * this.rowHeight, s = Math.max(0, i);
    this.container.scrollTop = s;
  }
  // 현재 포커스된 옵션 반환
  getFocusedOption() {
    return this.focusedIndex >= 0 && this.focusedIndex < this.data.length ? this.data[this.focusedIndex] : null;
  }
  // 데이터 갱신 및 렌더링
  setData(t, e) {
    this.data = t, this.total = t.length, this._prevStart = -1, this._prevEnd = -1;
    const i = e != null && e !== void 0 ? this.data.findIndex((s) => s.value === e) : -1;
    this.isMultiple || (this.activeIndex = i >= 0 ? i : 0), this.focusedIndex = i >= 0 ? i : 0, this.container.scrollTop = 0, this._initializeContainer(), this._setPlaceholders(0, Math.min(this.total, this.pool.length)), this._renderPool(0), this._applyHighlight();
  }
  // 파괴 및 이벤트 제거
  destroy() {
    this.container.removeEventListener("scroll", this._onScroll), this.pool.forEach((t) => t.remove()), this.wrapper.style.height = "0", this.topPad?.remove(), this.botPad?.remove(), this.pool = [], c.activeInstance === this && (c.activeInstance = null);
  }
  // 외부에서 하이라이트를 적용할 수 있는 public 메서드
  applyHighlight() {
    this._applyHighlight();
  }
  // 외부에서 activeIndex와 focusedIndex를 함께 설정하는 헬퍼 메서드
  setActiveAndFocusedIndex(t) {
    t < 0 || t >= this.total || (this.focusedIndex = t, this.isMultiple || (this.activeIndex = t), this._applyHighlight());
  }
};
c.activeInstance = null;
let E = c;
const v = {
  en: {
    placeholder: "Please select",
    loadingText: "Loading options...",
    noDataText: "No data available",
    removeTag: "Remove",
    clearAll: "Clear all",
    resetToDefault: "Reset to default",
    required: "This field is required."
  },
  ko: {
    placeholder: "선택해주세요",
    loadingText: "옵션 로딩 중...",
    noDataText: "데이터 없음",
    removeTag: "제거",
    clearAll: "모두 지우기",
    resetToDefault: "기본값으로 되돌리기",
    required: "필수 항목입니다."
  },
  ja: {
    placeholder: "選択してください",
    loadingText: "オプションを読み込み中...",
    noDataText: "データがありません",
    removeTag: "削除",
    clearAll: "すべてクリア",
    resetToDefault: "デフォルトに戻す",
    required: "この項目は必須です。"
  },
  zh: {
    placeholder: "请选择",
    loadingText: "正在加载选项...",
    noDataText: "无数据",
    removeTag: "移除",
    clearAll: "清除全部",
    resetToDefault: "恢复默认",
    required: "此项为必填项。"
  }
}, M = {
  en: {
    searchPlaceholder: "Search...",
    noMatchText: "No matching data found."
  },
  ko: {
    searchPlaceholder: "검색하세요",
    noMatchText: "데이터가 없습니다."
  },
  ja: {
    searchPlaceholder: "検索してください",
    noMatchText: "一致するデータがありません。"
  },
  zh: {
    searchPlaceholder: "请搜索",
    noMatchText: "未找到匹配数据。"
  }
}, L = ["en", "ko", "ja", "zh"], u = {
  language: "en",
  theme: "float",
  height: "100%",
  showReset: !0,
  multiple: !1,
  dark: !1,
  required: !1
}, l = {
  SELECT_OPEN: "onOpen",
  SELECT: "onSelect",
  DESELECT: "onDeselect",
  RESET: "onReset",
  CHANGE: "onChange"
}, o = {
  SELECT: "seo-select",
  MULTI_SELECT: "multi-select",
  OPEN: "open",
  HIDDEN: "hidden",
  SELECTED_CONTAINER: "selected-container",
  SELECTED_TAGS: "selected-tags",
  TAG: "tag",
  TAG_REMOVE: "tag-remove",
  PLACEHOLDER: "placeholder",
  ARROW: "arrow",
  LISTBOX: "seo-select-listbox",
  SCROLL: "seo-select-scroll",
  LOADING_CONTAINER: "loading-container",
  LOADING_DOTS: "loading-dots",
  LOADING_TEXT: "loading-text",
  NO_DATA_CONTAINER: "no-data-container",
  NO_DATA_TEXT: "no-data-text",
  SEARCH_INPUT: "select-search-input",
  SEARCH_ICON: "search-icon",
  WITH_RESET: "with-reset",
  RESET_BUTTON: "reset-button",
  MULTI_RESET_BUTTON: "multi-reset-button",
  SELECTED: "selected",
  CHECK_MARK: "check-mark",
  DOT: "dot"
}, _ = {
  LOADING_MIN: 500,
  LOADING_MAX: 1500,
  SELECT_DELAY: 0
}, g = {
  CLOSE: () => h`
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  CHEVRON_DOWN: () => h`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  CHEVRON_UP: () => h`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 10L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  SEARCH: () => h`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14 14L11.1 11.1" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
};
class w extends Event {
  constructor(t, e, i) {
    super(t, { bubbles: !0, composed: !0 }), this.label = e, this.value = i;
  }
}
class b extends Event {
  constructor(t, e) {
    super(l.DESELECT, { bubbles: !0, composed: !0 }), this.label = t, this.value = e;
  }
}
class I extends Event {
  constructor(t) {
    super(l.RESET, { bubbles: !0, composed: !0 }), this.label = t.label, this.value = t.value, this.labels = t.labels, this.values = t.values;
  }
}
class O extends Event {
  constructor() {
    super(l.CHANGE, { bubbles: !0, composed: !0 });
  }
}
class D extends Event {
  constructor(t) {
    super(l.SELECT_OPEN, { bubbles: !0, composed: !0 }), this.selectInstance = t;
  }
}
function T(a, t, e) {
  const i = new w(l.SELECT, t, e);
  a.dispatchEvent(i);
}
function A(a, t, e) {
  const i = new b(t, e);
  a.dispatchEvent(i);
}
function x(a, t) {
  const e = new I(t);
  a.dispatchEvent(e);
}
function y(a) {
  const t = new O();
  a.dispatchEvent(t);
}
function $(a) {
  const t = new D(a);
  window.dispatchEvent(t);
}
l.SELECT, l.DESELECT, l.RESET, l.CHANGE, l.SELECT_OPEN;
const m = class m extends S {
  constructor() {
    super(), this._optionsCache = /* @__PURE__ */ new Map(), this._localizedTextCache = null, this._lastLanguage = "", this._lastTextsHash = "", this._widthCalculationCache = /* @__PURE__ */ new Map(), this._isUpdating = !1, this._updateDebounceTimer = null, this.removeTag = (t, e) => {
      t.stopPropagation(), this._selectedValues = this._selectedValues.filter((s) => s !== e), this.updateFormValue();
      const i = this._optionsCache.get(e) || this._options.find((s) => s.value === e);
      if (this.open) {
        this._virtual?.destroy(), this._virtual = null;
        const s = this.getAllOptionData();
        if (s.length > 0) {
          const n = this.querySelector(`.${o.SCROLL}`);
          n && (this._virtual = this._createVirtualSelect(s, n), requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
          }));
        }
      }
      A(this, i?.textContent || "", e), this._debouncedUpdate();
    }, this.resetToDefault = (t) => {
      if (t.stopPropagation(), this.multiple) {
        if (this._selectedValues = [], this.updateFormValue(), this.open) {
          this._virtual?.destroy(), this._virtual = null;
          const e = this.querySelector(`.${o.SCROLL}`);
          if (e) {
            const i = this.getAllOptionData();
            this._virtual = this._createVirtualSelect(i, e), requestAnimationFrame(() => {
              this._virtual?.setActiveIndex(0);
            });
          }
        } else
          this._pendingActiveIndex = 0;
        x(this, { values: [], labels: [] });
      } else if (this._options.length > 0) {
        const e = this._options[0];
        this.value = e.value, this._labelText = e.textContent || "", this.open && this._virtual ? requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(0), this._virtual && (this._virtual.setActiveAndFocusedIndex(0), this._virtual.applyHighlight());
        }) : (this._pendingActiveIndex = 0, this._virtual && (this._virtual.destroy(), this._virtual = null)), x(this, { value: e.value, label: e.textContent || "" });
      }
      this._debouncedUpdate();
    }, this.toggleDropdown = () => {
      this.open ? this.closeDropdown() : this.openDropdown();
    }, this.handleOutsideClick = async (t) => {
      const e = t.target;
      this.querySelector(`.${o.SELECT}`)?.contains(e) || this.contains(e) || await this.closeDropdown();
    }, this.onOtherSelectOpened = (t) => {
      t.detail !== this && this.open && this.closeDropdown();
    }, this._internals = this.attachInternals(), this._value = null, this._initialValue = null, this._initialLabel = null, this._virtual = null, this._options = [], this.width = null, this.required = u.required, this.optionItems = [], this.open = !1, this._labelText = "", this.showReset = u.showReset, this.multiple = u.multiple, this._selectedValues = [], this._isLoading = !1, this.theme = u.theme, this.dark = u.dark, this.language = u.language, this.texts = {}, this.autoWidth = !1, this._calculatedWidth = null, this._handleKeydownBound = (t) => this._virtual?.handleKeydown(t), this.tabIndex = 0, this._pendingActiveIndex = null;
  }
  static get properties() {
    return {
      id: { type: String },
      name: { type: String },
      required: { type: Boolean, reflect: !0 },
      width: { type: String },
      height: { type: String },
      optionItems: { type: Array },
      open: { type: Boolean, state: !0 },
      _labelText: { type: String, state: !0 },
      showReset: { type: Boolean },
      multiple: { type: Boolean },
      _selectedValues: { type: Array, state: !0 },
      _isLoading: { type: Boolean, state: !0 },
      theme: { type: String },
      dark: { type: Boolean },
      language: { type: String },
      texts: { type: Object },
      autoWidth: { type: Boolean }
    };
  }
  /**
   * @deprecated 표준 addEventListener를 사용하세요
   */
  addSeoSelectEventListener(t, e, i) {
    process.env.NODE_ENV !== "production" && console.warn(`addSeoSelectEventListener is deprecated. Use standard addEventListener instead:
Before: select.addSeoSelectEventListener('${t}', handler);
After:  select.addEventListener('${t}', handler);`), this.addEventListener(t, e, i);
  }
  /**
   * @deprecated 표준 removeEventListener를 사용하세요
   */
  removeSeoSelectEventListener(t, e, i) {
    process.env.NODE_ENV !== "production" && console.warn(`removeSeoSelectEventListener is deprecated. Use standard removeEventListener instead:
Before: select.removeSeoSelectEventListener('${t}', handler);
After:  select.removeEventListener('${t}', handler);`), this.removeEventListener(t, e, i);
  }
  // 최적화된 getLocalizedText - 캐싱 적용
  getLocalizedText() {
    const t = JSON.stringify(this.texts);
    if (this._localizedTextCache && this._lastLanguage === this.language && this._lastTextsHash === t)
      return this._localizedTextCache;
    const e = v[this.language] || v.en;
    return this._localizedTextCache = {
      ...e,
      ...this.texts
    }, this._lastLanguage = this.language, this._lastTextsHash = t, this._localizedTextCache;
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    this.style.width = this.width !== "100%" ? "" : "100%", super.connectedCallback(), this.initializeOptionsFromPropsOrSlot(), window.addEventListener(l.SELECT_OPEN, this.onOtherSelectOpened), window.addEventListener("click", this.handleOutsideClick, !0), this.addEventListener("keydown", this._handleKeydownBound);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(l.SELECT_OPEN, this.onOtherSelectOpened), window.removeEventListener("click", this.handleOutsideClick), this.removeEventListener("keydown", this._handleKeydownBound), this._virtual?.destroy(), this._virtual = null, this._optionsCache.clear(), this._widthCalculationCache.clear(), this._localizedTextCache = null, this._updateDebounceTimer && clearTimeout(this._updateDebounceTimer), this.multiple ? this._selectedValues = [] : this.value = "";
  }
  // 디바운스된 업데이트 메서드
  _debouncedUpdate() {
    this._updateDebounceTimer && clearTimeout(this._updateDebounceTimer), this._updateDebounceTimer = setTimeout(() => {
      this.requestUpdate(), this._updateDebounceTimer = null;
    }, 16);
  }
  updated(t) {
    if (this._isUpdating) return;
    this.style.width = this.width !== "100%" ? "" : "100%";
    const e = t.has("optionItems") || t.has("language") || t.has("texts"), i = t.has("width") || t.has("optionItems") || t.has("_options");
    e && this.initializeOptionsFromPropsOrSlot(), i && this.calculateAutoWidth();
  }
  // 최적화된 자동 너비 계산 - 캐싱 및 배치 처리
  calculateAutoWidth() {
    if (this.width || this._options.length === 0) {
      this._calculatedWidth = null;
      return;
    }
    const t = this._options.map((i) => i.textContent || ""), e = t.join("|") + `|${this.multiple}`;
    if (this._widthCalculationCache.has(e)) {
      const i = this._widthCalculationCache.get(e);
      this._calculatedWidth = `${i}px`;
      return;
    }
    requestAnimationFrame(() => {
      const i = this.getLocalizedText(), s = [...t];
      this.multiple && s.push(i.placeholder);
      const n = window.getComputedStyle(this), r = `${n.fontSize} ${n.fontFamily}`, d = this.getMaxOptionWidth(s, r), p = this.multiple ? 120 : 80, C = Math.max(d + p, 150);
      this._widthCalculationCache.set(e, C), this._calculatedWidth = `${C}px`, this.isConnected && this._debouncedUpdate();
    });
  }
  getEffectiveWidth() {
    return this.width ? this.width : !this.width && this._calculatedWidth ? this._calculatedWidth : "auto";
  }
  getCloseIcon() {
    return g.CLOSE();
  }
  getChevronDownIcon() {
    return g.CHEVRON_DOWN();
  }
  getChevronUpIcon() {
    return g.CHEVRON_UP();
  }
  renderLoadingSpinner() {
    const t = this.getLocalizedText();
    return h`
      <div class="${o.LOADING_CONTAINER}">
        <div class="${o.LOADING_DOTS}">
          <div class="${o.DOT}"></div>
          <div class="${o.DOT}"></div>
          <div class="${o.DOT}"></div>
        </div>  
        <span class="${o.LOADING_TEXT}">${t.loadingText}</span>
      </div>
    `;
  }
  renderNoData() {
    const t = this.getLocalizedText();
    return h`
      <div class="${o.NO_DATA_CONTAINER}">
        <span class="${o.NO_DATA_TEXT}">${t.noDataText}</span>
      </div>
    `;
  }
  renderDropdown() {
    const t = this.getAllOptionData().length > 0, e = this.multiple && !this._isLoading && !t, i = this.getEffectiveWidth();
    return h`
      <div class="${o.LISTBOX} ${o.SCROLL} ${this.open ? "" : o.HIDDEN}" role="listbox" style="width: ${i};">
        ${this._isLoading ? this.renderLoadingSpinner() : e ? this.renderNoData() : ""}
      </div>
    `;
  }
  getThemeClass() {
    const t = `theme-${this.theme}`, e = this.dark ? "dark" : "";
    return `${t} ${e}`.trim();
  }
  render() {
    return this.multiple ? this.renderMultiSelect() : this.renderSingleSelect();
  }
  renderMultiSelect() {
    const t = this.getLocalizedText(), e = this.showReset && this._selectedValues.length > 0, i = this.getEffectiveWidth();
    return h`
      <div class="${o.SELECT} ${o.MULTI_SELECT} ${this.getThemeClass()} ${this.open ? o.OPEN : ""}" style="width: ${i};">
        <div class="${o.SELECTED_CONTAINER} ${e ? o.WITH_RESET : ""}" @click=${this.toggleDropdown}>
          <div class="${o.SELECTED_TAGS}">
            ${this._selectedValues.map((s) => {
      const r = (this._optionsCache.get(s) || this._options.find((d) => d.value === s))?.textContent || s;
      return h`
                <span class="${o.TAG}">
                  ${r}
                  <button
                    type="button"
                    class="${o.TAG_REMOVE}"
                    @click=${(d) => this.removeTag(d, s)}
                    title="${t.removeTag}"
                  >${this.getCloseIcon()}</button>
                </span>
              `;
    })}
            ${this._selectedValues.length === 0 ? h`<span class="${o.PLACEHOLDER}">${t.placeholder}</span>` : ""}
          </div>
          ${e ? h`<button
                type="button"
                class="${o.MULTI_RESET_BUTTON}"
                @click=${this.resetToDefault}
                title="${t.clearAll}"
              >${this.getCloseIcon()}</button>` : ""}
          <span class="${o.ARROW}">${this.open ? this.getChevronUpIcon() : this.getChevronDownIcon()}</span>
        </div>
        ${this.renderDropdown()}
      </div>
    `;
  }
  renderSingleSelect() {
    const t = this.getLocalizedText(), e = this._options && this._options.length > 0 ? this._options[0].value : null, i = this.showReset && this._value !== null && e !== null && this._value !== e, s = this.getEffectiveWidth();
    return h`
      <div class="${o.SELECT} ${this.getThemeClass()} ${this.open ? o.OPEN : ""}" style="width: ${s};">
        <button type="button" class="${o.SELECTED} ${i ? o.WITH_RESET : ""}" @click=${this.toggleDropdown}>
          ${this._labelText}
          ${i ? h`<button
                type="button"
                class="${o.RESET_BUTTON}"
                @click=${this.resetToDefault}
                title="${t.resetToDefault}"
              >${this.getCloseIcon()}</button>` : ""}
          <span class="${o.ARROW}">${this.open ? this.getChevronUpIcon() : this.getChevronDownIcon()}</span>
        </button>
        ${this.renderDropdown()}
      </div>
    `;
  }
  hasNoOptions() {
    return this._options.length === 0;
  }
  // 최적화된 옵션 초기화 - 배치 처리 및 캐싱
  initializeOptionsFromPropsOrSlot() {
    if (!this._isUpdating) {
      this._isUpdating = !0;
      try {
        this._optionsCache.clear();
        const t = Array.from(this.querySelectorAll("option"));
        if (t.length > 0)
          this._options = t.map((e) => (e.hidden = !0, this._optionsCache.set(e.value, e), e));
        else if (Array.isArray(this.optionItems) && this.optionItems.length > 0) {
          const e = document.createDocumentFragment();
          this._options = this.optionItems.map((i) => {
            const s = document.createElement("option");
            return s.value = i.value, s.textContent = i.label, s.hidden = !0, this._optionsCache.set(i.value, s), e.appendChild(s), s;
          }), this.appendChild(e);
        } else
          this._options = [];
        if (this._options.length > 0 && (this._isLoading = !1), this.multiple) {
          const e = this._options.filter((i) => i.selected);
          this._selectedValues = e.map((i) => i.value);
        } else {
          const e = this._options.find((i) => i.selected);
          e ? this._setValue(e.value, !1) : this._options.length > 0 && this._setValue(this._options[0].value, !1);
        }
        this._options.length > 0 && (this._initialValue = this._options[0].value, this._initialLabel = this._options[0].textContent || ""), this.calculateAutoWidth();
      } finally {
        this._isUpdating = !1, this._debouncedUpdate();
      }
    }
  }
  openDropdown() {
    $(this), this.open = !0, this._debouncedUpdate(), this.hasNoOptions() ? (this._isLoading = !0, this._debouncedUpdate(), this.loadOptionsAsync().then(() => {
      this.initializeVirtualSelect();
    }).catch(() => {
      this._isLoading = !1, this._debouncedUpdate();
    })) : this.initializeVirtualSelect();
  }
  closeDropdown() {
    this.open = !1, this._debouncedUpdate();
  }
  initializeVirtualSelect() {
    const t = this.querySelector(`.${o.SCROLL}`), e = this.getAllOptionData();
    if (!(this.multiple && e.length === 0) && !this._virtual && t && !this._isLoading && e.length > 0)
      if (this._virtual = this._createVirtualSelect(e, t), this.multiple)
        requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(0);
        });
      else {
        const i = e.findIndex((s) => s.value === this._value);
        requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(i >= 0 ? i : 0);
        });
      }
  }
  async loadOptionsAsync() {
    return new Promise((t) => {
      const e = Math.min(
        Math.random() * (_.LOADING_MAX - _.LOADING_MIN) + _.LOADING_MIN,
        500
        // 최대 500ms로 제한
      );
      setTimeout(() => {
        t();
      }, e);
    });
  }
  selectOption(t, e) {
    if (this.multiple) {
      this._selectedValues = [...this._selectedValues, t], this.updateFormValue(), this._debouncedUpdate(), this._virtual?.destroy(), this._virtual = null;
      const i = this.querySelector(`.${o.SCROLL}`);
      if (i) {
        const s = this.getAllOptionData();
        s.length > 0 && (this._virtual = this._createVirtualSelect(s, i), requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(0);
        }));
      }
      T(this, e, t);
    } else
      this._labelText = e, this._setValue(t), this.closeDropdown(), T(this, e, t);
  }
  updateFormValue() {
    const t = this.getLocalizedText();
    if (this.multiple) {
      const e = this._selectedValues.join(",");
      this._internals.setFormValue(e), this.required && this._selectedValues.length === 0 ? this._internals.setValidity({ valueMissing: !0 }, t.required) : this._internals.setValidity({});
    }
  }
  // 최적화된 텍스트 너비 측정 - 캐싱 적용
  getMaxOptionWidth(t, e) {
    const i = `${t.join("|")}|${e}`;
    if (this._widthCalculationCache.has(i))
      return this._widthCalculationCache.get(i);
    const n = document.createElement("canvas").getContext("2d");
    n.font = e;
    const r = Math.max(...t.map((d) => {
      const p = n.measureText(d).width;
      return p > 100 ? p : 100;
    }));
    return this._widthCalculationCache.set(i, r), r;
  }
  getAllOptionData() {
    return this.multiple ? this._options.filter((t) => !this._selectedValues.includes(t.value)).map((t) => ({
      value: t.value,
      label: t.textContent ?? ""
    })) : this._options.map((t) => ({
      value: t.value,
      label: t.textContent ?? ""
    }));
  }
  _createVirtualSelect(t, e) {
    return new E(e, t, {
      isMultiple: this.multiple,
      renderOption: (i, s) => {
        if (i.textContent = s.label, this.multiple) {
          const n = this._selectedValues.includes(s.value);
          i.classList.toggle(o.SELECTED, n), n && (i.innerHTML = `<span class="${o.CHECK_MARK}">✓</span> ${s.label}`);
        }
      },
      onClick: (i) => setTimeout(() => this.selectOption(i.value, i.label), _.SELECT_DELAY),
      onEscape: () => this.closeDropdown()
    });
  }
  _setValue(t, e = !0) {
    if (this._value === t) return;
    this._value = t;
    const i = this._optionsCache.get(t) || this._options.find((n) => n.value === t);
    this._labelText = i?.textContent ?? this._labelText ?? "", this._internals.setFormValue(this._value || "");
    const s = this.getLocalizedText();
    this.required && !this._value ? this._internals.setValidity({ valueMissing: !0 }, s.required) : this._internals.setValidity({}), this._debouncedUpdate(), e && y(this);
  }
  get options() {
    return this._options;
  }
  get selectedIndex() {
    return this.multiple ? -1 : this._options.findIndex((t) => t.value === this._value);
  }
  get value() {
    return this.multiple ? this._selectedValues.join(",") : this._value;
  }
  set value(t) {
    this.multiple ? (this._selectedValues = t ? t.split(",").filter((e) => e.trim()) : [], this.updateFormValue(), this._debouncedUpdate()) : this._setValue(t, !0);
  }
  get defaultValue() {
    return this._options.length > 0 ? this._options[0].value : null;
  }
  get selectedValues() {
    return this.multiple ? [...this._selectedValues] : [];
  }
  set selectedValues(t) {
    this.multiple && (this._selectedValues = [...t], this.updateFormValue(), this._debouncedUpdate());
  }
  resetToDefaultValue() {
    this.resetToDefault(new Event("reset"));
  }
  setLanguage(t) {
    this.language = t, this._localizedTextCache = null, this._debouncedUpdate();
  }
  setTexts(t) {
    this.texts = { ...this.texts, ...t }, this._localizedTextCache = null, this._debouncedUpdate();
  }
  setAutoWidth(t) {
    this.autoWidth = t, this.calculateAutoWidth(), this._debouncedUpdate();
  }
  // 대량 옵션 업데이트를 위한 배치 처리 메서드
  batchUpdateOptions(t) {
    if (!this._isUpdating) {
      this._isUpdating = !0;
      try {
        this._options.forEach((i) => i.remove()), this._options = [], this._optionsCache.clear(), this._widthCalculationCache.clear();
        const e = document.createDocumentFragment();
        this._options = t.map((i) => {
          const s = document.createElement("option");
          return s.value = i.value, s.textContent = i.label, s.hidden = !0, this._optionsCache.set(i.value, s), e.appendChild(s), s;
        }), this.appendChild(e), this._options.length > 0 && (this._initialValue = this._options[0].value, this._initialLabel = this._options[0].textContent || "", this._isLoading = !1, !this.multiple && !this._value && this._setValue(this._options[0].value, !1)), this.calculateAutoWidth();
      } finally {
        this._isUpdating = !1, this._debouncedUpdate();
      }
    }
  }
  // 옵션 추가를 위한 최적화된 메서드
  addOption(t) {
    const e = document.createElement("option");
    e.value = t.value, e.textContent = t.label, e.hidden = !0, this._options.push(e), this._optionsCache.set(t.value, e), this.appendChild(e), this._widthCalculationCache.clear(), this.calculateAutoWidth(), this._debouncedUpdate();
  }
  // 옵션 제거를 위한 최적화된 메서드
  removeOption(t) {
    const e = this._options.findIndex((s) => s.value === t);
    if (e === -1) return;
    this._options[e].remove(), this._options.splice(e, 1), this._optionsCache.delete(t), this.multiple ? (this._selectedValues = this._selectedValues.filter((s) => s !== t), this.updateFormValue()) : this._value === t && (this._options.length > 0 ? this._setValue(this._options[0].value, !0) : this._setValue("", !0)), this._widthCalculationCache.clear(), this.calculateAutoWidth(), this._debouncedUpdate();
  }
  // 옵션 검색을 위한 최적화된 메서드
  findOption(t) {
    return this._optionsCache.get(t) || null;
  }
  // 모든 옵션 클리어
  clearOptions() {
    this._options.forEach((t) => t.remove()), this._options = [], this._optionsCache.clear(), this._widthCalculationCache.clear(), this.multiple ? (this._selectedValues = [], this.updateFormValue()) : this._setValue("", !0), this._debouncedUpdate();
  }
  // 성능 모니터링을 위한 메서드
  getPerformanceMetrics() {
    return {
      optionCount: this._options.length,
      cacheSize: this._optionsCache.size,
      isUpdating: this._isUpdating,
      hasCalculatedWidth: this._calculatedWidth !== null
    };
  }
  // 캐시 수동 정리 메서드
  clearCaches() {
    this._optionsCache.clear(), this._widthCalculationCache.clear(), this._localizedTextCache = null, this._lastLanguage = "", this._lastTextsHash = "";
  }
  // 타입 안전한 이벤트 리스너 헬퍼 메서드들 (표준 addEventListener 권장)
  onSelect(t) {
    this.addEventListener(l.SELECT, t);
  }
  /**
   * 선택 해제 이벤트 리스너 추가 (타입 안전)
   */
  onDeselect(t) {
    this.addEventListener(l.DESELECT, t);
  }
  /**
   * 리셋 이벤트 리스너 추가 (타입 안전)
   */
  onReset(t) {
    this.addEventListener(l.RESET, t);
  }
  /**
   * 변경 이벤트 리스너 추가 (타입 안전)
   */
  onChange(t) {
    this.addEventListener(l.CHANGE, t);
  }
  static getSupportedLanguages() {
    return L;
  }
  static getDefaultTexts() {
    return v;
  }
};
m.formAssociated = !0;
let f = m;
customElements.get("seo-select") || customElements.define("seo-select", f);
export {
  o as C,
  u as D,
  l as E,
  g as I,
  v as L,
  f as S,
  M as a,
  L as b,
  x as c,
  $ as d,
  T as e,
  y as f,
  A as t
};
//# sourceMappingURL=index-DFU6-0W1.js.map
