import './styles/index.css';/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, j = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, rt = Symbol(), J = /* @__PURE__ */ new WeakMap();
let gt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== rt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (j && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = J.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && J.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ft = (o) => new gt(typeof o == "string" ? o : o + "", void 0, rt), vt = (o, t) => {
  if (j) o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = H.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, o.appendChild(s);
  }
}, Y = j ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return ft(e);
})(o) : o;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: mt, defineProperty: Et, getOwnPropertyDescriptor: $t, getOwnPropertyNames: Ct, getOwnPropertySymbols: At, getPrototypeOf: xt } = Object, R = globalThis, Q = R.trustedTypes, Tt = Q ? Q.emptyScript : "", St = R.reactiveElementPolyfillSupport, w = (o, t) => o, F = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? Tt : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, t) {
  let e = o;
  switch (t) {
    case Boolean:
      e = o !== null;
      break;
    case Number:
      e = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(o);
      } catch {
        e = null;
      }
  }
  return e;
} }, ct = (o, t) => !mt(o, t), tt = { attribute: !0, type: String, converter: F, reflect: !1, useDefault: !1, hasChanged: ct };
Symbol.metadata ??= Symbol("metadata"), R.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let T = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = tt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && Et(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: n } = $t(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: i, set(a) {
      const r = i?.call(this);
      n?.call(this, a), this.requestUpdate(t, r, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? tt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(w("elementProperties"))) return;
    const t = xt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(w("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(w("properties"))) {
      const e = this.properties, s = [...Ct(e), ...At(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(Y(i));
    } else t !== void 0 && e.push(Y(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return vt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : F).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const n = s.getPropertyOptions(i), a = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : F;
      this._$Em = i;
      const r = a.fromAttribute(e, n.type);
      this[i] = r ?? this._$Ej?.get(i) ?? r, this._$Em = null;
    }
  }
  requestUpdate(t, e, s) {
    if (t !== void 0) {
      const i = this.constructor, n = this[t];
      if (s ??= i.getPropertyOptions(t), !((s.hasChanged ?? ct)(n, e) || s.useDefault && s.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(i._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: n }, a) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), n !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [i, n] of this._$Ep) this[i] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, n] of s) {
        const { wrapped: a } = n, r = this[i];
        a !== !0 || this._$AL.has(i) || r === void 0 || this.C(i, void 0, n, r);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[w("elementProperties")] = /* @__PURE__ */ new Map(), T[w("finalized")] = /* @__PURE__ */ new Map(), St?.({ ReactiveElement: T }), (R.reactiveElementVersions ??= []).push("2.1.1");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis, U = G.trustedTypes, et = U ? U.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, dt = "$lit$", E = `lit$${Math.random().toFixed(9).slice(2)}$`, ut = "?" + E, yt = `<${ut}>`, A = document, L = () => A.createComment(""), I = (o) => o === null || typeof o != "object" && typeof o != "function", K = Array.isArray, bt = (o) => K(o) || typeof o?.[Symbol.iterator] == "function", V = `[ 	
\f\r]`, b = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, st = /-->/g, it = />/g, $ = RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), nt = /'/g, ot = /"/g, pt = /^(?:script|style|textarea|title)$/i, wt = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), g = wt(1), S = Symbol.for("lit-noChange"), u = Symbol.for("lit-nothing"), at = /* @__PURE__ */ new WeakMap(), C = A.createTreeWalker(A, 129);
function _t(o, t) {
  if (!K(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return et !== void 0 ? et.createHTML(t) : t;
}
const Ot = (o, t) => {
  const e = o.length - 1, s = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = b;
  for (let r = 0; r < e; r++) {
    const l = o[r];
    let d, p, c = -1, f = 0;
    for (; f < l.length && (a.lastIndex = f, p = a.exec(l), p !== null); ) f = a.lastIndex, a === b ? p[1] === "!--" ? a = st : p[1] !== void 0 ? a = it : p[2] !== void 0 ? (pt.test(p[2]) && (i = RegExp("</" + p[2], "g")), a = $) : p[3] !== void 0 && (a = $) : a === $ ? p[0] === ">" ? (a = i ?? b, c = -1) : p[1] === void 0 ? c = -2 : (c = a.lastIndex - p[2].length, d = p[1], a = p[3] === void 0 ? $ : p[3] === '"' ? ot : nt) : a === ot || a === nt ? a = $ : a === st || a === it ? a = b : (a = $, i = void 0);
    const m = a === $ && o[r + 1].startsWith("/>") ? " " : "";
    n += a === b ? l + yt : c >= 0 ? (s.push(d), l.slice(0, c) + dt + l.slice(c) + E + m) : l + E + (c === -2 ? r : m);
  }
  return [_t(o, n + (o[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class D {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let n = 0, a = 0;
    const r = t.length - 1, l = this.parts, [d, p] = Ot(t, e);
    if (this.el = D.createElement(d, s), C.currentNode = this.el.content, e === 2 || e === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (i = C.nextNode()) !== null && l.length < r; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const c of i.getAttributeNames()) if (c.endsWith(dt)) {
          const f = p[a++], m = i.getAttribute(c).split(E), P = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: n, name: P[2], strings: m, ctor: P[1] === "." ? It : P[1] === "?" ? Dt : P[1] === "@" ? Nt : k }), i.removeAttribute(c);
        } else c.startsWith(E) && (l.push({ type: 6, index: n }), i.removeAttribute(c));
        if (pt.test(i.tagName)) {
          const c = i.textContent.split(E), f = c.length - 1;
          if (f > 0) {
            i.textContent = U ? U.emptyScript : "";
            for (let m = 0; m < f; m++) i.append(c[m], L()), C.nextNode(), l.push({ type: 2, index: ++n });
            i.append(c[f], L());
          }
        }
      } else if (i.nodeType === 8) if (i.data === ut) l.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = i.data.indexOf(E, c + 1)) !== -1; ) l.push({ type: 7, index: n }), c += E.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = A.createElement("template");
    return s.innerHTML = t, s;
  }
}
function y(o, t, e = o, s) {
  if (t === S) return t;
  let i = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const n = I(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== n && (i?._$AO?.(!1), n === void 0 ? i = void 0 : (i = new n(o), i._$AT(o, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = i : e._$Cl = i), i !== void 0 && (t = y(o, i._$AS(o, t.values), i, s)), t;
}
class Lt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = (t?.creationScope ?? A).importNode(e, !0);
    C.currentNode = i;
    let n = C.nextNode(), a = 0, r = 0, l = s[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let d;
        l.type === 2 ? d = new N(n, n.nextSibling, this, t) : l.type === 1 ? d = new l.ctor(n, l.name, l.strings, this, t) : l.type === 6 && (d = new Pt(n, this, t)), this._$AV.push(d), l = s[++r];
      }
      a !== l?.index && (n = C.nextNode(), a++);
    }
    return C.currentNode = A, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class N {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = y(this, t, e), I(t) ? t === u || t == null || t === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : bt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== u && I(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = D.createElement(_t(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const n = new Lt(i, this), a = n.u(this.options);
      n.p(e), this.T(a), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = at.get(t.strings);
    return e === void 0 && at.set(t.strings, e = new D(t)), e;
  }
  k(t) {
    K(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const n of t) i === e.length ? e.push(s = new N(this.O(L()), this.O(L()), this, this.options)) : s = e[i], s._$AI(n), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = t.nextSibling;
      t.remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class k {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, n) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = u;
  }
  _$AI(t, e = this, s, i) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) t = y(this, t, e, 0), a = !I(t) || t !== this._$AH && t !== S, a && (this._$AH = t);
    else {
      const r = t;
      let l, d;
      for (t = n[0], l = 0; l < n.length - 1; l++) d = y(this, r[s + l], e, l), d === S && (d = this._$AH[l]), a ||= !I(d) || d !== this._$AH[l], d === u ? t = u : t !== u && (t += (d ?? "") + n[l + 1]), this._$AH[l] = d;
    }
    a && !i && this.j(t);
  }
  j(t) {
    t === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class It extends k {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === u ? void 0 : t;
  }
}
class Dt extends k {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== u);
  }
}
class Nt extends k {
  constructor(t, e, s, i, n) {
    super(t, e, s, i, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = y(this, t, e, 0) ?? u) === S) return;
    const s = this._$AH, i = t === u && s !== u || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== u && (s === u || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Pt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    y(this, t);
  }
}
const Mt = G.litHtmlPolyfillSupport;
Mt?.(D, N), (G.litHtmlVersions ??= []).push("3.3.1");
const Ht = (o, t, e) => {
  const s = e?.renderBefore ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = e?.renderBefore ?? null;
    s._$litPart$ = i = new N(t.insertBefore(L(), n), n, void 0, e ?? {});
  }
  return i._$AI(o), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const X = globalThis;
class O extends T {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ht(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return S;
  }
}
O._$litElement$ = !0, O.finalized = !0, X.litElementHydrateSupport?.({ LitElement: O });
const Ut = X.litElementPolyfillSupport;
Ut?.({ LitElement: O });
(X.litElementVersions ??= []).push("4.2.1");
const v = class v {
  constructor(t, e, s = {}) {
    this._ticking = !1, this._prevStartIdx = -1, this.handleKeydown = (i) => {
      switch (i.key) {
        case "Tab": {
          if (i.preventDefault(), i.shiftKey) {
            if (this.data[0]?.value === "no_match") return;
            this.setFocusedIndex(this.focusedIndex - 1);
          } else {
            const n = this.focusedIndex + 1;
            if (this.data[n]?.value === "no_match") return;
            if (n >= this.total) {
              const a = this.container.scrollHeight - this.container.clientHeight;
              this.container.scrollTop = a;
            } else
              this.setFocusedIndex(n);
          }
          break;
        }
        case "ArrowDown": {
          i.preventDefault();
          const n = this.focusedIndex + 1;
          if (this.data[n]?.value === "no_match") return;
          if (n >= this.total) {
            const a = this.container.scrollHeight - this.container.clientHeight;
            this.container.scrollTop = a;
          } else
            this.setFocusedIndex(n);
          break;
        }
        case "ArrowUp":
          if (i.preventDefault(), this.data[0]?.value === "no_match") return;
          this.setFocusedIndex(this.focusedIndex - 1);
          break;
        case "Enter": {
          i.preventDefault();
          const n = this.getFocusedOption();
          n && (this.onClick?.(n, this.focusedIndex, i), this.isMultiple || (this.activeIndex = this.focusedIndex), this._applyHighlight());
          break;
        }
        case "Escape":
          i.preventDefault(), this.onEscape?.();
          break;
      }
    }, this.container = t, this.data = e, this.rowHeight = s.rowHeight || 36, this.overscan = s.overscan || 20, this.renderOption = s.renderOption || null, this.onClick = s.onClick || null, this.onEscape = s.onEscape || null, this.isMultiple = s.isMultiple || !1, this.total = e.length, this.focusedIndex = -1, this.activeIndex = -1, this._prevStart = -1, this._prevEnd = -1, this.pool = [], this._ensureWrapper(), this._buildDOM(), requestAnimationFrame(() => {
      this._initializeContainer(), this._buildPool(), this._bindScroll(), v.activeInstance && v.activeInstance !== this && v.activeInstance.deactivate(), v.activeInstance = this, this.render();
    });
  }
  // 활성화 해제: 모든 하이라이트 클래스 제거
  deactivate() {
    this.pool.forEach(this._resetClass);
  }
  // 주어진 인덱스로 스크롤 이동 및 렌더링
  renderToIndex(t) {
    const e = Math.max(0, Math.min(t, this.total - 1)), s = Math.floor(this.visibleCount / 2), n = Math.max(0, e - s) * this.rowHeight;
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
    const s = this.total * this.rowHeight, i = this.total > 10 ? 360 : s;
    this.container.style.height = `${i + 5 + t}px`, this.visibleCount = Math.max(1, Math.ceil((i + t) / this.rowHeight)), this.poolSize = this.visibleCount + this.overscan * 2, this.container.style.setProperty("--row-height", `${this.rowHeight}px`), this.wrapper.style.height = `${this.total * this.rowHeight}px`;
  }
  // option 요소 풀 구성
  _buildPool() {
    this.pool.forEach((e) => e.remove()), this.pool = [];
    const t = this.topPad.nextSibling;
    for (let e = 0; e < this.poolSize; e++) {
      const s = this._createOptionElement();
      this.pool.push(s), this.wrapper.insertBefore(s, t);
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
    const t = this.container.scrollTop, e = Math.max(0, Math.floor(t / this.rowHeight) - this.overscan), s = Math.min(this.total, e + this.poolSize);
    this._prevStart === e && this._prevEnd === s || (this._prevStart = e, this._prevEnd = s, this._setPlaceholders(e, s), this._renderPool(e), requestAnimationFrame(() => {
      Math.abs(this.container.scrollTop - t) > 1 && (this.container.scrollTop = t), this._applyHighlight();
    })), this._applyHighlight();
  }
  // index로 활성화 설정
  setActiveIndex(t) {
    t < 0 || t >= this.total || (this.focusedIndex = t, this.isMultiple || (this.activeIndex = t), this.renderToIndex(t), this._applyHighlight());
  }
  // padding 영역 설정
  _setPlaceholders(t, e) {
    const s = t * this.rowHeight, i = (this.total - e) * this.rowHeight;
    this.container.style.setProperty("--top-placeholder", `${s}px`), this.container.style.setProperty("--bottom-placeholder", `${i}px`), this.topPad.firstElementChild.style.height = `${s}px`, this.botPad.firstElementChild.style.height = `${i}px`, this.wrapper.style.height = `${this.total * this.rowHeight}px`;
  }
  // 옵션 풀 재사용하여 렌더링
  _renderPool(t) {
    for (let e = 0; e < this.pool.length; e++) {
      const s = this.pool[e], i = t + e;
      if (i >= this.total) {
        s.style.display = "none", s.removeAttribute("data-index");
        continue;
      }
      const n = this.data[i];
      s.style.display = "", s.dataset.index = String(i), s._value !== n.value && (s.textContent = n.label, s._value = n.value), this._handleDisabledOption(s, n), this._resetClass(s), this.renderOption && this.renderOption(s, n), this.isMultiple && s.classList.remove("active");
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
    const s = e?.value === "no_match";
    t.classList.toggle("disabled", s), t.toggleAttribute("aria-disabled", s), s && (this.container.style.height = "80px");
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
    const s = parseInt(e.dataset.index || "-1", 10), i = this.data[s];
    i?.value !== "no_match" && (this.onClick?.(i, s, t), this.isMultiple || (this.activeIndex = s), this.focusedIndex = s, this._applyHighlight());
  }
  // 포커스 인덱스 설정
  setFocusedIndex(t) {
    this.focusedIndex = Math.max(0, Math.min(t, this.total - 1)), this.render(), this._scrollIntoView(this.focusedIndex);
  }
  // 포커스된 아이템이 보이도록 스크롤
  _scrollIntoView(t) {
    const e = this.total > 10 ? 9 : this.total - 1, s = (t - e) * this.rowHeight, i = Math.max(0, s);
    this.container.scrollTop = i;
  }
  // 현재 포커스된 옵션 반환
  getFocusedOption() {
    return this.focusedIndex >= 0 && this.focusedIndex < this.data.length ? this.data[this.focusedIndex] : null;
  }
  // 데이터 갱신 및 렌더링
  setData(t, e) {
    this.data = t, this.total = t.length, this._prevStart = -1, this._prevEnd = -1;
    const s = e != null && e !== void 0 ? this.data.findIndex((i) => i.value === e) : -1;
    this.isMultiple || (this.activeIndex = s >= 0 ? s : 0), this.focusedIndex = s >= 0 ? s : 0, this.container.scrollTop = 0, this._initializeContainer(), this._setPlaceholders(0, Math.min(this.total, this.pool.length)), this._renderPool(0), this._applyHighlight();
  }
  // 파괴 및 이벤트 제거
  destroy() {
    this.container.removeEventListener("scroll", this._onScroll), this.pool.forEach((t) => t.remove()), this.wrapper.style.height = "0", this.topPad?.remove(), this.botPad?.remove(), this.pool = [], v.activeInstance === this && (v.activeInstance = null);
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
v.activeInstance = null;
let B = v;
const W = {
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
}, Xt = {
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
}, Rt = ["en", "ko", "ja", "zh"], x = {
  language: "en",
  theme: "float",
  height: "100%",
  showReset: !0,
  multiple: !1,
  dark: !1,
  required: !1
}, _ = {
  SELECT_OPEN: "onOpen",
  SELECT: "onSelect",
  DESELECT: "onDeselect",
  RESET: "onReset",
  CHANGE: "onChange"
}, h = {
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
}, M = {
  LOADING_MIN: 500,
  LOADING_MAX: 1500,
  SELECT_DELAY: 0
}, z = {
  CLOSE: () => g`
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  CHEVRON_DOWN: () => g`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  CHEVRON_UP: () => g`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 10L8 6L4 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  SEARCH: () => g`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M14 14L11.1 11.1" stroke="currentColor" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
};
class kt extends Event {
  constructor(t, e, s) {
    super(t, { bubbles: !0, composed: !0 }), this.label = e, this.value = s;
  }
}
class Vt extends Event {
  constructor(t, e) {
    super(_.DESELECT, { bubbles: !0, composed: !0 }), this.label = t, this.value = e;
  }
}
class Wt extends Event {
  constructor(t) {
    super(_.RESET, { bubbles: !0, composed: !0 }), this.label = t.label, this.value = t.value, this.labels = t.labels, this.values = t.values;
  }
}
class zt extends Event {
  constructor() {
    super(_.CHANGE, { bubbles: !0, composed: !0 });
  }
}
class Ft extends Event {
  constructor(t) {
    super(_.SELECT_OPEN, { bubbles: !0, composed: !0 }), this.selectInstance = t;
  }
}
function lt(o, t, e) {
  const s = new kt(_.SELECT, t, e);
  o.dispatchEvent(s);
}
function Bt(o, t, e) {
  const s = new Vt(t, e);
  o.dispatchEvent(s);
}
function ht(o, t) {
  const e = new Wt(t);
  o.dispatchEvent(e);
}
function qt(o) {
  const t = new zt();
  o.dispatchEvent(t);
}
function jt(o) {
  const t = new Ft(o);
  window.dispatchEvent(t);
}
_.SELECT, _.DESELECT, _.RESET, _.CHANGE, _.SELECT_OPEN;
const Z = class Z extends O {
  constructor() {
    super(), this._optionsCache = /* @__PURE__ */ new Map(), this._localizedTextCache = null, this._lastLanguage = "", this._lastTextsHash = "", this._widthCalculationCache = /* @__PURE__ */ new Map(), this._isUpdating = !1, this._updateDebounceTimer = null, this.removeTag = (t, e) => {
      t.stopPropagation(), this._selectedValues = this._selectedValues.filter((i) => i !== e), this.updateFormValue();
      const s = this._optionsCache.get(e) || this._options.find((i) => i.value === e);
      if (this.open) {
        this._virtual?.destroy(), this._virtual = null;
        const i = this.getAllOptionData();
        if (i.length > 0) {
          const n = this.querySelector(`.${h.SCROLL}`);
          n && (this._virtual = this._createVirtualSelect(i, n), requestAnimationFrame(() => {
            this._virtual?.setActiveIndex(0);
          }));
        }
      }
      Bt(this, s?.textContent || "", e), this._debouncedUpdate();
    }, this.resetToDefault = (t) => {
      if (t.stopPropagation(), this.multiple) {
        if (this._selectedValues = [], this.updateFormValue(), this.open) {
          this._virtual?.destroy(), this._virtual = null;
          const e = this.querySelector(`.${h.SCROLL}`);
          if (e) {
            const s = this.getAllOptionData();
            this._virtual = this._createVirtualSelect(s, e), requestAnimationFrame(() => {
              this._virtual?.setActiveIndex(0);
            });
          }
        } else
          this._pendingActiveIndex = 0;
        ht(this, { values: [], labels: [] });
      } else if (this._options.length > 0) {
        const e = this._options[0];
        this.value = e.value, this._labelText = e.textContent || "", this.open && this._virtual ? requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(0), this._virtual && (this._virtual.setActiveAndFocusedIndex(0), this._virtual.applyHighlight());
        }) : (this._pendingActiveIndex = 0, this._virtual && (this._virtual.destroy(), this._virtual = null)), ht(this, { value: e.value, label: e.textContent || "" });
      }
      this._debouncedUpdate();
    }, this.toggleDropdown = () => {
      this.open ? this.closeDropdown() : this.openDropdown();
    }, this.handleOutsideClick = async (t) => {
      const e = t.target;
      this.querySelector(`.${h.SELECT}`)?.contains(e) || this.contains(e) || await this.closeDropdown();
    }, this.onOtherSelectOpened = (t) => {
      t.detail !== this && this.open && this.closeDropdown();
    }, this._internals = this.attachInternals(), this._value = null, this._initialValue = null, this._initialLabel = null, this._virtual = null, this._options = [], this.width = null, this.required = x.required, this.optionItems = [], this.open = !1, this._labelText = "", this.showReset = x.showReset, this.multiple = x.multiple, this._selectedValues = [], this._isLoading = !1, this.theme = x.theme, this.dark = x.dark, this.language = x.language, this.texts = {}, this.autoWidth = !1, this._calculatedWidth = null, this._handleKeydownBound = (t) => this._virtual?.handleKeydown(t), this.tabIndex = 0, this._pendingActiveIndex = null;
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
  addSeoSelectEventListener(t, e, s) {
    process.env.NODE_ENV !== "production" && console.warn(`addSeoSelectEventListener is deprecated. Use standard addEventListener instead:
Before: select.addSeoSelectEventListener('${t}', handler);
After:  select.addEventListener('${t}', handler);`), this.addEventListener(t, e, s);
  }
  /**
   * @deprecated 표준 removeEventListener를 사용하세요
   */
  removeSeoSelectEventListener(t, e, s) {
    process.env.NODE_ENV !== "production" && console.warn(`removeSeoSelectEventListener is deprecated. Use standard removeEventListener instead:
Before: select.removeSeoSelectEventListener('${t}', handler);
After:  select.removeEventListener('${t}', handler);`), this.removeEventListener(t, e, s);
  }
  // 최적화된 getLocalizedText - 캐싱 적용
  getLocalizedText() {
    const t = JSON.stringify(this.texts);
    if (this._localizedTextCache && this._lastLanguage === this.language && this._lastTextsHash === t)
      return this._localizedTextCache;
    const e = W[this.language] || W.en;
    return this._localizedTextCache = {
      ...e,
      ...this.texts
    }, this._lastLanguage = this.language, this._lastTextsHash = t, this._localizedTextCache;
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    this.style.width = this.width !== "100%" ? "" : "100%", super.connectedCallback(), this.initializeOptionsFromPropsOrSlot(), window.addEventListener(_.SELECT_OPEN, this.onOtherSelectOpened), window.addEventListener("click", this.handleOutsideClick, !0), this.addEventListener("keydown", this._handleKeydownBound);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(_.SELECT_OPEN, this.onOtherSelectOpened), window.removeEventListener("click", this.handleOutsideClick), this.removeEventListener("keydown", this._handleKeydownBound), this._virtual?.destroy(), this._virtual = null, this._optionsCache.clear(), this._widthCalculationCache.clear(), this._localizedTextCache = null, this._updateDebounceTimer && clearTimeout(this._updateDebounceTimer), this.multiple ? this._selectedValues = [] : this.value = "";
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
    const e = t.has("optionItems") || t.has("language") || t.has("texts"), s = t.has("width") || t.has("optionItems") || t.has("_options");
    e && this.initializeOptionsFromPropsOrSlot(), s && this.calculateAutoWidth();
  }
  // 최적화된 자동 너비 계산 - 캐싱 및 배치 처리
  calculateAutoWidth() {
    if (this.width || this._options.length === 0) {
      this._calculatedWidth = null;
      return;
    }
    const t = this._options.map((s) => s.textContent || ""), e = t.join("|") + `|${this.multiple}`;
    if (this._widthCalculationCache.has(e)) {
      const s = this._widthCalculationCache.get(e);
      this._calculatedWidth = `${s}px`;
      return;
    }
    requestAnimationFrame(() => {
      const s = this.getLocalizedText(), i = [...t];
      this.multiple && i.push(s.placeholder);
      const n = window.getComputedStyle(this), a = `${n.fontSize} ${n.fontFamily}`, r = this.getMaxOptionWidth(i, a), l = this.multiple ? 120 : 80, d = Math.max(r + l, 150);
      this._widthCalculationCache.set(e, d), this._calculatedWidth = `${d}px`, this.isConnected && this._debouncedUpdate();
    });
  }
  getEffectiveWidth() {
    return this.width ? this.width : !this.width && this._calculatedWidth ? this._calculatedWidth : "auto";
  }
  getCloseIcon() {
    return z.CLOSE();
  }
  getChevronDownIcon() {
    return z.CHEVRON_DOWN();
  }
  getChevronUpIcon() {
    return z.CHEVRON_UP();
  }
  renderLoadingSpinner() {
    const t = this.getLocalizedText();
    return g`
      <div class="${h.LOADING_CONTAINER}">
        <div class="${h.LOADING_DOTS}">
          <div class="${h.DOT}"></div>
          <div class="${h.DOT}"></div>
          <div class="${h.DOT}"></div>
        </div>  
        <span class="${h.LOADING_TEXT}">${t.loadingText}</span>
      </div>
    `;
  }
  renderNoData() {
    const t = this.getLocalizedText();
    return g`
      <div class="${h.NO_DATA_CONTAINER}">
        <span class="${h.NO_DATA_TEXT}">${t.noDataText}</span>
      </div>
    `;
  }
  renderDropdown() {
    const t = this.getAllOptionData().length > 0, e = this.multiple && !this._isLoading && !t, s = this.getEffectiveWidth();
    return g`
      <div class="${h.LISTBOX} ${h.SCROLL} ${this.open ? "" : h.HIDDEN}" role="listbox" style="width: ${s};">
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
    const t = this.getLocalizedText(), e = this.showReset && this._selectedValues.length > 0, s = this.getEffectiveWidth();
    return g`
      <div class="${h.SELECT} ${h.MULTI_SELECT} ${this.getThemeClass()} ${this.open ? h.OPEN : ""}" style="width: ${s};">
        <div class="${h.SELECTED_CONTAINER} ${e ? h.WITH_RESET : ""}" @click=${this.toggleDropdown}>
          <div class="${h.SELECTED_TAGS}">
            ${this._selectedValues.map((i) => {
      const a = (this._optionsCache.get(i) || this._options.find((r) => r.value === i))?.textContent || i;
      return g`
                <span class="${h.TAG}">
                  ${a}
                  <button
                    type="button"
                    class="${h.TAG_REMOVE}"
                    @click=${(r) => this.removeTag(r, i)}
                    title="${t.removeTag}"
                  >${this.getCloseIcon()}</button>
                </span>
              `;
    })}
            ${this._selectedValues.length === 0 ? g`<span class="${h.PLACEHOLDER}">${t.placeholder}</span>` : ""}
          </div>
          ${e ? g`<button
                type="button"
                class="${h.MULTI_RESET_BUTTON}"
                @click=${this.resetToDefault}
                title="${t.clearAll}"
              >${this.getCloseIcon()}</button>` : ""}
          <span class="${h.ARROW}">${this.open ? this.getChevronUpIcon() : this.getChevronDownIcon()}</span>
        </div>
        ${this.renderDropdown()}
      </div>
    `;
  }
  renderSingleSelect() {
    const t = this.getLocalizedText(), e = this._options && this._options.length > 0 ? this._options[0].value : null, s = this.showReset && this._value !== null && e !== null && this._value !== e, i = this.getEffectiveWidth();
    return g`
      <div class="${h.SELECT} ${this.getThemeClass()} ${this.open ? h.OPEN : ""}" style="width: ${i};">
        <button type="button" class="${h.SELECTED} ${s ? h.WITH_RESET : ""}" @click=${this.toggleDropdown}>
          ${this._labelText}
          ${s ? g`<button
                type="button"
                class="${h.RESET_BUTTON}"
                @click=${this.resetToDefault}
                title="${t.resetToDefault}"
              >${this.getCloseIcon()}</button>` : ""}
          <span class="${h.ARROW}">${this.open ? this.getChevronUpIcon() : this.getChevronDownIcon()}</span>
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
          this._options = this.optionItems.map((s) => {
            const i = document.createElement("option");
            return i.value = s.value, i.textContent = s.label, i.hidden = !0, this._optionsCache.set(s.value, i), e.appendChild(i), i;
          }), this.appendChild(e);
        } else
          this._options = [];
        if (this._options.length > 0 && (this._isLoading = !1), this.multiple) {
          const e = this._options.filter((s) => s.selected);
          this._selectedValues = e.map((s) => s.value);
        } else {
          const e = this._options.find((s) => s.selected);
          e ? this._setValue(e.value, !1) : this._options.length > 0 && this._setValue(this._options[0].value, !1);
        }
        this._options.length > 0 && (this._initialValue = this._options[0].value, this._initialLabel = this._options[0].textContent || ""), this.calculateAutoWidth();
      } finally {
        this._isUpdating = !1, this._debouncedUpdate();
      }
    }
  }
  openDropdown() {
    jt(this), this.open = !0, this._debouncedUpdate(), this.hasNoOptions() ? (this._isLoading = !0, this._debouncedUpdate(), this.loadOptionsAsync().then(() => {
      this.initializeVirtualSelect();
    }).catch(() => {
      this._isLoading = !1, this._debouncedUpdate();
    })) : this.initializeVirtualSelect();
  }
  closeDropdown() {
    this.open = !1, this._debouncedUpdate();
  }
  initializeVirtualSelect() {
    const t = this.querySelector(`.${h.SCROLL}`), e = this.getAllOptionData();
    if (!(this.multiple && e.length === 0) && !this._virtual && t && !this._isLoading && e.length > 0)
      if (this._virtual = this._createVirtualSelect(e, t), this.multiple)
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
  async loadOptionsAsync() {
    return new Promise((t) => {
      const e = Math.min(
        Math.random() * (M.LOADING_MAX - M.LOADING_MIN) + M.LOADING_MIN,
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
      const s = this.querySelector(`.${h.SCROLL}`);
      if (s) {
        const i = this.getAllOptionData();
        i.length > 0 && (this._virtual = this._createVirtualSelect(i, s), requestAnimationFrame(() => {
          this._virtual?.setActiveIndex(0);
        }));
      }
      lt(this, e, t);
    } else
      this._labelText = e, this._setValue(t), this.closeDropdown(), lt(this, e, t);
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
    const s = `${t.join("|")}|${e}`;
    if (this._widthCalculationCache.has(s))
      return this._widthCalculationCache.get(s);
    const n = document.createElement("canvas").getContext("2d");
    n.font = e;
    const a = Math.max(...t.map((r) => {
      const l = n.measureText(r).width;
      return l > 100 ? l : 100;
    }));
    return this._widthCalculationCache.set(s, a), a;
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
    return new B(e, t, {
      isMultiple: this.multiple,
      renderOption: (s, i) => {
        if (s.textContent = i.label, this.multiple) {
          const n = this._selectedValues.includes(i.value);
          s.classList.toggle(h.SELECTED, n), n && (s.innerHTML = `<span class="${h.CHECK_MARK}">✓</span> ${i.label}`);
        }
      },
      onClick: (s) => setTimeout(() => this.selectOption(s.value, s.label), M.SELECT_DELAY),
      onEscape: () => this.closeDropdown()
    });
  }
  _setValue(t, e = !0) {
    if (this._value === t) return;
    this._value = t;
    const s = this._optionsCache.get(t) || this._options.find((n) => n.value === t);
    this._labelText = s?.textContent ?? this._labelText ?? "", this._internals.setFormValue(this._value || "");
    const i = this.getLocalizedText();
    this.required && !this._value ? this._internals.setValidity({ valueMissing: !0 }, i.required) : this._internals.setValidity({}), this._debouncedUpdate(), e && qt(this);
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
        this._options.forEach((s) => s.remove()), this._options = [], this._optionsCache.clear(), this._widthCalculationCache.clear();
        const e = document.createDocumentFragment();
        this._options = t.map((s) => {
          const i = document.createElement("option");
          return i.value = s.value, i.textContent = s.label, i.hidden = !0, this._optionsCache.set(s.value, i), e.appendChild(i), i;
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
    const e = this._options.findIndex((i) => i.value === t);
    if (e === -1) return;
    this._options[e].remove(), this._options.splice(e, 1), this._optionsCache.delete(t), this.multiple ? (this._selectedValues = this._selectedValues.filter((i) => i !== t), this.updateFormValue()) : this._value === t && (this._options.length > 0 ? this._setValue(this._options[0].value, !0) : this._setValue("", !0)), this._widthCalculationCache.clear(), this.calculateAutoWidth(), this._debouncedUpdate();
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
    this.addEventListener(_.SELECT, t);
  }
  /**
   * 선택 해제 이벤트 리스너 추가 (타입 안전)
   */
  onDeselect(t) {
    this.addEventListener(_.DESELECT, t);
  }
  /**
   * 리셋 이벤트 리스너 추가 (타입 안전)
   */
  onReset(t) {
    this.addEventListener(_.RESET, t);
  }
  /**
   * 변경 이벤트 리스너 추가 (타입 안전)
   */
  onChange(t) {
    this.addEventListener(_.CHANGE, t);
  }
  static getSupportedLanguages() {
    return Rt;
  }
  static getDefaultTexts() {
    return W;
  }
};
Z.formAssociated = !0;
let q = Z;
customElements.get("seo-select") || customElements.define("seo-select", q);
export {
  h as C,
  x as D,
  _ as E,
  z as I,
  W as L,
  q as S,
  ht as a,
  Xt as b,
  jt as c,
  lt as d,
  qt as e,
  Rt as f,
  Bt as t,
  g as x
};
//# sourceMappingURL=index-ChBqhzDu.js.map
