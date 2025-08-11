import { EVENT_NAMES } from '../constants/constants';

type SelectDetail = { label: string; value: string };
type ResetSingle = { value: string; label: string };
type ResetMulti  = { values: string[]; labels: string[] };
type ResetDetail = ResetSingle | ResetMulti;

export class SeoSelectEvent extends CustomEvent<SelectDetail> {
  constructor(label: string, value: string) {
    super(EVENT_NAMES.SELECT, { detail: { label, value }, bubbles: true, composed: true });
  }
}
export class SeoDeselectEvent extends CustomEvent<SelectDetail> {
  constructor(label: string, value: string) {
    super(EVENT_NAMES.DESELECT, { detail: { label, value }, bubbles: true, composed: true });
  }
}
export class SeoResetEvent extends CustomEvent<ResetDetail> {
  constructor(detail: ResetDetail) {
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
