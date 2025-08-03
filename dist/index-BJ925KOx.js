import { html as h } from "lit";
import { S as C, C as r, t as L, c as f, E as c, a as u, I as $, d as O, e as S, f as b } from "./index-DFU6-0W1.js";
const E = {
  あ: "ア",
  い: "イ",
  う: "ウ",
  え: "エ",
  お: "オ",
  か: "カ",
  き: "キ",
  く: "ク",
  け: "ケ",
  こ: "コ",
  が: "ガ",
  ぎ: "ギ",
  ぐ: "グ",
  げ: "ゲ",
  ご: "ゴ",
  さ: "サ",
  し: "シ",
  す: "ス",
  せ: "セ",
  そ: "ソ",
  ざ: "ザ",
  じ: "ジ",
  ず: "ズ",
  ぜ: "ゼ",
  ぞ: "ゾ",
  た: "タ",
  ち: "チ",
  つ: "ツ",
  て: "テ",
  と: "ト",
  だ: "ダ",
  ぢ: "ヂ",
  づ: "ヅ",
  で: "デ",
  ど: "ド",
  な: "ナ",
  に: "ニ",
  ぬ: "ヌ",
  ね: "ネ",
  の: "ノ",
  は: "ハ",
  ひ: "ヒ",
  ふ: "フ",
  へ: "ヘ",
  ほ: "ホ",
  ば: "バ",
  び: "ビ",
  ぶ: "ブ",
  べ: "ベ",
  ぼ: "ボ",
  ぱ: "パ",
  ぴ: "ピ",
  ぷ: "プ",
  ぺ: "ペ",
  ぽ: "ポ",
  ま: "マ",
  み: "ミ",
  む: "ム",
  め: "メ",
  も: "モ",
  や: "ヤ",
  ゆ: "ユ",
  よ: "ヨ",
  ら: "ラ",
  り: "リ",
  る: "ル",
  れ: "レ",
  ろ: "ロ",
  わ: "ワ",
  ゐ: "ヰ",
  ゑ: "ヱ",
  を: "ヲ",
  ん: "ン",
  ー: "ー",
  っ: "ッ",
  ゃ: "ャ",
  ゅ: "ュ",
  ょ: "ョ",
  ぁ: "ァ",
  ぃ: "ィ",
  ぅ: "ゥ",
  ぇ: "ェ",
  ぉ: "ォ"
}, _ = {};
Object.entries(E).forEach(([a, t]) => {
  _[t] = a;
});
const v = {
  a: "あ",
  i: "い",
  u: "う",
  e: "え",
  o: "お",
  ka: "か",
  ki: "き",
  ku: "く",
  ke: "け",
  ko: "こ",
  ga: "が",
  gi: "ぎ",
  gu: "ぐ",
  ge: "げ",
  go: "ご",
  sa: "さ",
  shi: "し",
  su: "す",
  se: "せ",
  so: "そ",
  za: "ざ",
  ji: "じ",
  zu: "ず",
  ze: "ぜ",
  zo: "ぞ",
  ta: "た",
  chi: "ち",
  tsu: "つ",
  te: "て",
  to: "と",
  da: "だ",
  di: "ぢ",
  du: "づ",
  de: "で",
  do: "ど",
  na: "な",
  ni: "に",
  nu: "ぬ",
  ne: "ね",
  no: "の",
  ha: "は",
  hi: "ひ",
  fu: "ふ",
  he: "へ",
  ho: "ほ",
  ba: "ば",
  bi: "び",
  bu: "ぶ",
  be: "べ",
  bo: "ぼ",
  pa: "ぱ",
  pi: "ぴ",
  pu: "ぷ",
  pe: "ぺ",
  po: "ぽ",
  ma: "ま",
  mi: "み",
  mu: "む",
  me: "め",
  mo: "も",
  ya: "や",
  yu: "ゆ",
  yo: "よ",
  ra: "ら",
  ri: "り",
  ru: "る",
  re: "れ",
  ro: "ろ",
  wa: "わ",
  wo: "を",
  n: "ん"
}, I = {
  爱: "愛",
  国: "國",
  学: "學",
  会: "會",
  说: "說",
  时: "時",
  实: "實",
  现: "現",
  发: "發",
  来: "來",
  这: "這",
  那: "那",
  里: "裡",
  为: "為",
  什: "什",
  么: "麼",
  样: "樣",
  电: "電",
  话: "話",
  网: "網",
  页: "頁",
  应: "應",
  该: "該",
  让: "讓",
  过: "過",
  关: "關",
  机: "機",
  构: "構",
  经: "經",
  营: "營",
  业: "業",
  务: "務",
  员: "員",
  户: "戶",
  门: "門",
  东: "東",
  西: "西",
  南: "南",
  北: "北",
  中: "中",
  华: "華",
  民: "民",
  共: "共",
  和: "和",
  人: "人"
}, g = {};
Object.entries(I).forEach(([a, t]) => {
  g[t] = a;
});
const D = {
  你: "ni",
  好: "hao",
  我: "wo",
  是: "shi",
  的: "de",
  在: "zai",
  有: "you",
  不: "bu",
  人: "ren",
  了: "le",
  中: "zhong",
  国: "guo",
  一: "yi",
  个: "ge",
  上: "shang",
  也: "ye",
  很: "hen",
  到: "dao",
  说: "shuo",
  要: "yao",
  去: "qu",
  就: "jiu",
  得: "de",
  可: "ke",
  以: "yi",
  还: "hai",
  时: "shi",
  候: "hou",
  会: "hui",
  这: "zhe",
  那: "na",
  什: "shen",
  么: "me",
  没: "mei",
  看: "kan",
  来: "lai",
  对: "dui",
  里: "li",
  后: "hou",
  自: "zi",
  己: "ji",
  年: "nian",
  大: "da",
  小: "xiao",
  多: "duo"
}, y = (a) => {
  const s = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ"
  ], i = s.map((o) => o.charCodeAt(0));
  let n = "";
  for (const o of a) {
    const l = o.charCodeAt(0);
    if (l >= 44032 && l <= 55203) {
      const d = l - 44032, p = Math.floor(d / 588);
      n += s[p];
    } else i.includes(l), n += o;
  }
  return n;
}, m = (a) => a.split("").map((t) => _[t] ? _[t] : t).join(""), R = (a) => a.split("").map((t) => g[t] ? g[t] : t).join(""), N = (a) => {
  let t = "", e = 0;
  for (; e < a.length; ) {
    let s = !1;
    for (let i = 3; i >= 1; i--)
      if (e + i <= a.length) {
        const n = a.substring(e, e + i);
        if (v[n]) {
          t += v[n], e += i, s = !0;
          break;
        }
      }
    s || (t += a[e], e++);
  }
  return t;
}, w = (a) => a.split("").map((t) => D[t] || t).join(""), x = (a) => {
  const t = (a.match(/[\u3131-\u3163\uac00-\ud7a3]/g) || []).length, e = (a.match(/[\u3040-\u309f\u30a0-\u30ff]/g) || []).length, s = (a.match(/[\u4e00-\u9fff]/g) || []).length, i = (a.match(/[a-zA-Z]/g) || []).length, n = t + e + s + i;
  return n === 0 ? "en" : t / n > 0.5 ? "ko" : e / n > 0.5 ? "ja" : s / n > 0.5 ? "zh" : i / n > 0.5 ? "en" : "mixed";
}, A = (a) => {
  const t = a.toLowerCase().replace(/\s+/g, "");
  let e = "";
  for (const s of t) {
    const i = s.charCodeAt(0);
    if (/[0-9]/.test(s)) {
      e += s;
      continue;
    }
    if (/[a-zA-Z]/.test(s)) {
      e += s.toUpperCase();
      continue;
    }
    if (i >= 12593 && i <= 12643 || i >= 44032 && i <= 55203) {
      e += y(s);
      continue;
    }
    if (i >= 12352 && i <= 12447 || i >= 12448 && i <= 12543) {
      e += m(s);
      continue;
    }
    if (i >= 19968 && i <= 40959) {
      e += R(s);
      continue;
    }
    e += s;
  }
  return e;
}, V = (a) => {
  const t = A(a), e = x(a), s = [], i = t.split("").join(".*");
  if (s.push(new RegExp(i, "i")), (e === "ja" || e === "mixed") && /[a-zA-Z]/.test(a)) {
    const n = N(a.toLowerCase()), o = n.split("").map((l) => E[l] || l).join("");
    n !== a.toLowerCase() && (s.push(new RegExp(n.split("").join(".*"), "i")), s.push(new RegExp(o.split("").join(".*"), "i")));
  }
  return s;
}, T = (a, t) => {
  const e = V(a), s = A(t), i = x(t);
  for (const n of e)
    if (n.test(s))
      return !0;
  if (i === "zh" || i === "mixed") {
    const n = w(t);
    for (const o of e)
      if (o.test(n))
        return !0;
  }
  if (i === "ja" || i === "mixed") {
    const n = m(t);
    for (const o of e)
      if (o.test(n))
        return !0;
  }
  return !1;
};
class z extends C {
  constructor() {
    super(), this._handleSearchInput = (t) => {
      const e = t.target, s = this._searchText;
      this._searchText = e.value, s !== this._searchText && this.dispatchEvent(new CustomEvent("search-text-change", {
        detail: { searchText: this._searchText, previousSearchText: s },
        bubbles: !0,
        composed: !0
      }));
    }, this.removeTag = (t, e) => {
      t.stopPropagation(), this._selectedValues = this._selectedValues.filter((i) => i !== e), this.updateFormValue();
      const s = this._optionsCache.get(e) || this._options.find((i) => i.value === e);
      if (this.open) {
        this._virtual?.destroy(), this._virtual = null;
        const i = this.getAllOptionData();
        if (i.length > 0) {
          const n = this.querySelector(`.${r.SCROLL}`);
          n && (this._virtual = this._createVirtualSelect(i, n), this._searchText && this._applyFilteredOptions(), requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
          }));
        }
      }
      L(this, s?.textContent || "", e), this._debouncedUpdate();
    }, this.resetToDefault = (t) => {
      if (t.stopPropagation(), this.multiple) {
        if (this._selectedValues = [], this.updateFormValue(), this.open) {
          this._virtual?.destroy(), this._virtual = null;
          const e = this.querySelector(`.${r.SCROLL}`);
          if (e) {
            const s = this.getAllOptionData();
            this._virtual = this._createVirtualSelect(s, e), this._searchText && this._applyFilteredOptions(), requestAnimationFrame(() => {
              this._virtual?.setActiveIndex(0);
            });
          }
        } else
          this._pendingActiveIndex = 0;
        f(this, { values: [], labels: [] });
      } else if (this._options.length > 0) {
        const e = this._options[0];
        this.value = e.value, this._labelText = e.textContent || "", this.open && this._virtual ? requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(0), this._virtual && (this._virtual.setActiveAndFocusedIndex(0), this._virtual.applyHighlight());
        }) : (this._pendingActiveIndex = 0, this._virtual && (this._virtual.destroy(), this._virtual = null)), f(this, { value: e.value, label: e.textContent || "" });
      }
      this._debouncedUpdate();
    }, this._searchText = "", this._noMatchVisible = !1, this.theme = "float", this.dark = !1, this.searchTexts = {};
  }
  static get properties() {
    return {
      ...super.properties,
      _searchText: { type: String },
      _noMatchVisible: { type: Boolean },
      theme: { type: String },
      dark: { type: Boolean },
      searchTexts: { type: Object }
    };
  }
  /**
   * @deprecated 표준 addEventListener를 사용하세요
   */
  addSeoSelectEventListener(t, e, s) {
    process.env.NODE_ENV !== "production" && console.warn(`addSeoSelectEventListener is deprecated. Use standard addEventListener instead:
Before: searchSelect.addSeoSelectEventListener('${t}', handler);
After:  searchSelect.addEventListener('${t}', handler);`), this.addEventListener(t, e, s);
  }
  /**
   * @deprecated 표준 removeEventListener를 사용하세요
   */
  removeSeoSelectEventListener(t, e, s) {
    process.env.NODE_ENV !== "production" && console.warn(`removeSeoSelectEventListener is deprecated. Use standard removeEventListener instead:
Before: searchSelect.removeSeoSelectEventListener('${t}', handler);
After:  searchSelect.removeEventListener('${t}', handler);`), this.removeEventListener(t, e, s);
  }
  // 타입 안전한 이벤트 리스너 헬퍼 메서드들 (필수)
  /**
   * 선택 이벤트 리스너 추가 (타입 안전)
   * @example
   * searchSelect.onSelect((event) => {
   *   console.log('Selected:', event.label, event.value);
   * });
   */
  onSelect(t) {
    this.addEventListener(c.SELECT, t);
  }
  /**
   * 선택 해제 이벤트 리스너 추가 (타입 안전)
   * @example
   * searchSelect.onDeselect((event) => {
   *   console.log('Deselected:', event.label, event.value);
   * });
   */
  onDeselect(t) {
    this.addEventListener(c.DESELECT, t);
  }
  /**
   * 리셋 이벤트 리스너 추가 (타입 안전)
   * @example
   * searchSelect.onReset((event) => {
   *   if (event.values && event.labels) {
   *     console.log('Reset multiple:', event.values, event.labels);
   *   } else {
   *     console.log('Reset single:', event.value, event.label);
   *   }
   * });
   */
  onReset(t) {
    this.addEventListener(c.RESET, t);
  }
  /**
   * 변경 이벤트 리스너 추가 (타입 안전)
   * @example
   * searchSelect.onChange((event) => {
   *   console.log('Value changed');
   * });
   */
  onChange(t) {
    this.addEventListener(c.CHANGE, t);
  }
  /**
   * 검색 텍스트 변경 이벤트 리스너 추가 (검색 컴포넌트 전용)
   * @example
   * searchSelect.onSearchChange((searchText) => {
   *   console.log('Search text changed:', searchText);
   * });
   */
  onSearchChange(t) {
    this.addEventListener("search-text-change", (e) => {
      t(e.detail.searchText);
    });
  }
  /**
   * 검색 결과 필터링 이벤트 리스너 추가 (검색 컴포넌트 전용)
   * @example
   * searchSelect.onSearchFilter((filteredOptions) => {
   *   console.log('Filtered options:', filteredOptions);
   * });
   */
  onSearchFilter(t) {
    this.addEventListener("search-filter", (e) => {
      t(e.detail.filteredOptions);
    });
  }
  // 검색 관련 다국어 텍스트를 가져오고 커스텀 텍스트로 오버라이드하는 헬퍼 메서드
  getSearchLocalizedText() {
    return {
      ...u[this.language] || u.en,
      ...this.searchTexts
    };
  }
  updated(t) {
    super.updated?.(t), (t.has("optionItems") || t.has("_searchText") || t.has("language") || t.has("searchTexts")) && this._applyFilteredOptions();
  }
  getSearchIcon() {
    return $.SEARCH();
  }
  // 검색 기능이 있는 드롭다운 렌더링
  renderSearchDropdown() {
    const t = this.getSearchLocalizedText(), e = this.getAllOptionData().length > 0, s = this.multiple && !this._isLoading && !e, i = this.getEffectiveWidth();
    return h`
      <div class="${r.LISTBOX} ${this.open ? "" : r.HIDDEN}" style="width: ${i};">
        <div class="${r.SEARCH_INPUT}">
          <span class="${r.SEARCH_ICON}" aria-hidden="true">${this.getSearchIcon()}</span>
          <input
            type="text"
            placeholder="${t.searchPlaceholder}"
            .value=${this._searchText}
            @input=${this._handleSearchInput}
          />
        </div>
        <div class="${r.SCROLL}" role="listbox">
          ${this._isLoading ? this.renderLoadingSpinner() : s ? this.renderNoData() : ""}
        </div>
      </div>
    `;
  }
  // 부모 클래스의 getThemeClass 메서드를 오버라이드하여 다크 모드 지원
  getThemeClass() {
    const t = `theme-${this.theme}`, e = this.dark ? "dark" : "";
    return `${t} ${e}`.trim();
  }
  render() {
    return this.multiple ? this.renderMultiSelectSearch() : this.renderSingleSelectSearch();
  }
  renderMultiSelectSearch() {
    const t = this.getLocalizedText(), e = this.showReset && this._selectedValues.length > 0, s = this.getEffectiveWidth();
    return h`
      <div class="${r.SELECT} ${r.MULTI_SELECT} ${this.getThemeClass()} ${this.open ? r.OPEN : ""}" style="width: ${s};">
        <div class="${r.SELECTED_CONTAINER} ${e ? r.WITH_RESET : ""}" @click=${this.toggleDropdown}>
          <div class="${r.SELECTED_TAGS}">
            ${this._selectedValues.map((i) => {
      const o = this._options.find((l) => l.value === i)?.textContent || i;
      return h`
                <span class="${r.TAG}">
                  ${o}
                  <button
                    type="button"
                    class="${r.TAG_REMOVE}"
                    @click=${(l) => this.removeTag(l, i)}
                    title="${t.removeTag}"
                  >${this.getCloseIcon()}</button>
                </span>
              `;
    })}
            ${this._selectedValues.length === 0 ? h`<span class="${r.PLACEHOLDER}">${t.placeholder}</span>` : ""}
          </div>
          ${e ? h`<button
                type="button"
                class="${r.MULTI_RESET_BUTTON}"
                @click=${this.resetToDefault}
                title="${t.clearAll}"
              >${this.getCloseIcon()}</button>` : ""}
          <span class="${r.ARROW}">${this.open ? this.getChevronUpIcon() : this.getChevronDownIcon()}</span>
        </div>
        ${this.renderSearchDropdown()}
      </div>
    `;
  }
  renderSingleSelectSearch() {
    const t = this.getLocalizedText(), e = this._options && this._options.length > 0 ? this._options[0].value : null, s = this.showReset && this._value !== null && e !== null && this._value !== e, i = this.getEffectiveWidth();
    return h`
      <div class="${r.SELECT} ${this.getThemeClass()} ${this.open ? r.OPEN : ""}" style="width: ${i};">
        <button type="button" class="${r.SELECTED} ${s ? r.WITH_RESET : ""}" @click=${this.toggleDropdown}>
          ${this._labelText}
          ${s ? h`<button
                type="button"
                class="${r.RESET_BUTTON}"
                @click=${this.resetToDefault}
                title="${t.resetToDefault}"
              >${this.getCloseIcon()}</button>` : ""}
          <span class="${r.ARROW}">${this.open ? this.getChevronUpIcon() : this.getChevronDownIcon()}</span>
        </button>
        ${this.renderSearchDropdown()}
      </div>
    `;
  }
  _createVirtualSelect(t, e) {
    const s = super._createVirtualSelect(t, e);
    return s && (s.isitSearch = !0), s;
  }
  // 가상 스크롤 초기화 - 부모 클래스 메서드 오버라이드하여 검색 처리 추가
  initializeVirtualSelect() {
    const t = this.querySelector(`.${r.SCROLL}`), e = this.getAllOptionData();
    if (!(this.multiple && e.length === 0) && !this._virtual && t && !this._isLoading && e.length > 0)
      if (this._virtual = this._createVirtualSelect(e, t), this._searchText && this._applyFilteredOptions(), this.multiple)
        requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(0);
        });
      else {
        const s = e.findIndex((i) => i.value === this._value);
        requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(s >= 0 ? s : 0);
        });
      }
  }
  // null을 undefined로 변환하는 헬퍼 함수
  getCurrentValue() {
    return this.value ?? void 0;
  }
  // 향상된 다국어 검색 필터 적용
  _applyFilteredOptions() {
    if (!this._virtual) return;
    const t = this.getSearchLocalizedText(), e = this._searchText.trim();
    if (!e) {
      const n = this.getAllOptionData();
      this._virtual.setData(n, this.multiple ? void 0 : this.getCurrentValue()), this._noMatchVisible = !1, this.dispatchEvent(new CustomEvent("search-filter", {
        detail: { filteredOptions: n, searchText: e },
        bubbles: !0,
        composed: !0
      }));
      return;
    }
    const i = this.getAllOptionData().filter((n) => {
      const o = (n.label ?? "").toString();
      return T(e, o);
    });
    if (i.length === 0) {
      const n = [{ value: "no_match", label: t.noMatchText, disabled: !0 }];
      this._virtual.setData(
        n,
        this.multiple ? void 0 : this.getCurrentValue()
      ), this.dispatchEvent(new CustomEvent("search-filter", {
        detail: { filteredOptions: [], searchText: e, hasResults: !1 },
        bubbles: !0,
        composed: !0
      }));
      return;
    }
    this._virtual.setData(i, this.multiple ? void 0 : this.getCurrentValue()), this.dispatchEvent(new CustomEvent("search-filter", {
      detail: { filteredOptions: i, searchText: e, hasResults: !0 },
      bubbles: !0,
      composed: !0
    }));
  }
  // 드롭다운 열기 메서드 오버라이드 - 표준 이벤트 사용
  openDropdown() {
    O(this), this.open = !0, this._debouncedUpdate(), this.hasNoOptions() ? (this._isLoading = !0, this._debouncedUpdate(), this.loadOptionsAsync().then(() => {
      this.initializeVirtualSelect();
    }).catch(() => {
      this._isLoading = !1, this._debouncedUpdate();
    })) : this.initializeVirtualSelect();
  }
  // 옵션 선택 메서드 오버라이드 - 표준 이벤트 사용
  selectOption(t, e) {
    if (this.multiple) {
      this._selectedValues = [...this._selectedValues, t], this.updateFormValue(), this._debouncedUpdate(), this._virtual?.destroy(), this._virtual = null;
      const s = this.querySelector(`.${r.SCROLL}`);
      if (s) {
        const i = this.getAllOptionData();
        i.length > 0 && (this._virtual = this._createVirtualSelect(i, s), this._searchText && this._applyFilteredOptions(), requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(0);
        }));
      }
      S(this, e, t);
    } else
      this._labelText = e, this._setValue(t), this.closeDropdown(), S(this, e, t);
  }
  // 값 설정 메서드 오버라이드 - 표준 이벤트 사용
  _setValue(t, e = !0) {
    if (this._value === t) return;
    this._value = t;
    const s = this._optionsCache.get(t) || this._options.find((n) => n.value === t);
    this._labelText = s?.textContent ?? this._labelText ?? "", this._internals.setFormValue(this._value || "");
    const i = this.getLocalizedText();
    this.required && !this._value ? this._internals.setValidity({ valueMissing: !0 }, i.required) : this._internals.setValidity({}), this._debouncedUpdate(), e && b(this);
  }
  closeDropdown() {
    super.closeDropdown(), this._searchText = "", this._noMatchVisible = !1;
  }
  // 자동 너비 계산 오버라이드 - 검색 입력창 고려
  calculateAutoWidth() {
    if (this.width || this._options.length === 0) {
      this._calculatedWidth = null;
      return;
    }
    const t = this._options.map((p) => p.textContent || ""), e = this.getLocalizedText(), s = this.getSearchLocalizedText();
    this.multiple && t.push(e.placeholder), t.push(s.searchPlaceholder);
    const i = window.getComputedStyle(this), n = `${i.fontSize} ${i.fontFamily}`, o = this.getMaxOptionWidth(t, n), l = this.multiple ? 140 : 100, d = o + l;
    this._calculatedWidth = `${Math.max(d, 200)}px`;
  }
  // 부모 클래스의 언어 변경 메서드를 오버라이드하여 검색 관련 UI도 업데이트
  setLanguage(t) {
    super.setLanguage(t), this.requestUpdate();
  }
  // 검색 관련 커스텀 텍스트 설정 메서드
  setSearchTexts(t) {
    this.searchTexts = { ...this.searchTexts, ...t }, this.requestUpdate();
  }
  // 검색 텍스트 초기화 메서드
  clearSearchText() {
    this._searchText = "", this._applyFilteredOptions(), this.requestUpdate();
  }
  // 현재 검색 텍스트 반환
  getSearchText() {
    return this._searchText;
  }
  // 검색 텍스트 설정
  setSearchText(t) {
    this._searchText = t, this._applyFilteredOptions(), this.requestUpdate();
  }
  // 검색 관련 다국어 텍스트를 반환하는 정적 메서드
  static getSearchLocalizedTexts() {
    return u;
  }
  // 검색 관련 기본 텍스트 구조를 반환하는 정적 메서드
  static getDefaultSearchTexts() {
    return u;
  }
  // 디버깅을 위한 검색 테스트 메서드 (개발용)
  testMultilingualSearch(t, e) {
    return T(t, e);
  }
  // 성능 모니터링을 위한 검색 관련 메트릭 (부모 클래스 확장)
  getPerformanceMetrics() {
    return {
      ...super.getPerformanceMetrics(),
      searchText: this._searchText,
      hasSearchResults: this._searchText ? this.getAllOptionData().length > 0 : !0
    };
  }
}
customElements.get("seo-select-search") || customElements.define("seo-select-search", z);
export {
  z as S,
  T as i
};
//# sourceMappingURL=index-BJ925KOx.js.map
