import { EVENT_NAMES } from '../constants/constants.js';

type SelectDetail = { label: string; value: string };

export class SeoSelectEvent extends CustomEvent<SelectDetail> {
  constructor(eventType: string, label: string, value: string) {
    super(eventType, { detail: { label, value }, bubbles: true, composed: true });
  }
}

export class SeoDeselectEvent extends CustomEvent<SelectDetail> {
  constructor(eventType: string, label: string, value: string) {
    super(eventType, { detail: { label, value }, bubbles: true, composed: true });
  }
}

export class SeoResetEvent extends CustomEvent<unknown> {
  constructor(detail?: unknown) {
    super(EVENT_NAMES.RESET, { detail, bubbles: true, composed: true });
  }
}

export class SeoChangeEvent extends CustomEvent<undefined> {
  constructor() {
    super(EVENT_NAMES.CHANGE, { detail: undefined, bubbles: true, composed: true });
  }
}

export class SeoOpenEvent extends CustomEvent<{ selectInstance?: any }> {
  constructor(selectInstance?: any) {
    super(EVENT_NAMES.SELECT_OPEN, { detail: { selectInstance }, bubbles: true, composed: true });
  }
}
