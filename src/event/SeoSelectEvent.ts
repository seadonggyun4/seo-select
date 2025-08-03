import { EVENT_NAMES } from '../constants/constants.js';

export class SeoSelectEvent extends Event {
  public readonly label: string;
  public readonly value: string;

  constructor(eventType: string, label: string, value: string) {
    super(eventType, { bubbles: true, composed: true });
    this.label = label;
    this.value = value;
  }
}

export class SeoDeselectEvent extends Event {
  public readonly label: string;
  public readonly value: string;

  constructor(label: string, value: string) {
    super(EVENT_NAMES.DESELECT, { bubbles: true, composed: true });
    this.label = label;
    this.value = value;
  }
}

export class SeoResetEvent extends Event {
  public readonly label?: string;
  public readonly value?: string;
  public readonly labels?: string[];
  public readonly values?: string[];

  constructor(data: { 
    label?: string; 
    value?: string; 
    labels?: string[]; 
    values?: string[] 
  }) {
    super(EVENT_NAMES.RESET, { bubbles: true, composed: true });
    this.label = data.label;
    this.value = data.value;
    this.labels = data.labels;
    this.values = data.values;
  }
}

export class SeoChangeEvent extends Event {
  constructor() {
    super(EVENT_NAMES.CHANGE, { bubbles: true, composed: true });
  }
}

export class SeoOpenEvent extends Event {
  public readonly selectInstance: any;

  constructor(selectInstance: any) {
    super(EVENT_NAMES.SELECT_OPEN, { bubbles: true, composed: true });
    this.selectInstance = selectInstance;
  }
}