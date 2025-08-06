export interface VirtualSelectOption {
  value: string;
  label: string;
}

export interface OptionItem extends VirtualSelectOption {
  disabled?: boolean;
}

export interface BatchUpdateOption {
  action: 'add' | 'remove' | 'update';
  option?: VirtualSelectOption;
  value?: string;
  index?: number;
}