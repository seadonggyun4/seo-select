/**
 * Demo 페이지 상수 정의
 */

import type { LanguageNames, SampleLanguage, OptionItem } from './types';

export const CONFIG = {
  PAGE_LOAD_TIME: 2000,
  MOBILE_BREAKPOINT: 768,
  NOTIFICATION_DURATION: 3000,
  NOTIFICATION_FADE_DELAY: 300,
  RESIZE_DEBOUNCE_TIMEOUT: 100,
  ORIENTATION_CHANGE_DELAY: 300,
  NEW_COMPONENT_DELAY: 50,
} as const;

export const ORIGINAL_WIDTH_KEY = 'data-original-width';

export const LANGUAGE_NAMES: LanguageNames = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
};

export const SAMPLE_LANGUAGES: SampleLanguage[] = [
  { prefix: '한국어', code: 'ko' },
  { prefix: '日本語', code: 'ja' },
  { prefix: '中文', code: 'zh' },
  { prefix: 'English', code: 'en' },
  { prefix: '混合語', code: 'mixed' },
];

export const DEMO_DATA = {
  MULTILINGUAL: [
    { value: 'item1', label: '한국어 아이템 1' },
    { value: 'item2', label: '日本語アイテム 2' },
    { value: 'item3', label: '中文项目 3' },
    { value: 'item4', label: 'English Item 4' },
    { value: 'item5', label: '混合 Mixed アイテム 5' },
  ],
  BRANDS: [
    { value: 'kia', label: 'Kia Motors' },
    { value: 'hyundai', label: 'Hyundai Motor' },
    { value: 'bmw', label: 'BMW' },
    { value: 'benz', label: 'Mercedes-Benz' },
  ],
  SKILLS: {
    DEFAULT_SELECTED: ['js', 'ts', 'react'],
    DARK_MULTI_SELECTED: ['js', 'react'],
  },
} as const;

// Dynamic Demo Actions에서 사용하는 데이터
export const TECH_STACK_OPTIONS: OptionItem[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'nuxt', label: 'Nuxt.js' },
  { value: 'gatsby', label: 'Gatsby' },
  { value: 'remix', label: 'Remix' }
];

export const LANGUAGE_OPTIONS: OptionItem[] = [
  { value: 'js', label: 'JavaScript' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'kotlin', label: 'Kotlin' }
];

export const FRAMEWORK_OPTIONS: OptionItem[] = [
  { value: 'express', label: 'Express.js' },
  { value: 'fastify', label: 'Fastify' },
  { value: 'nestjs', label: 'NestJS' },
  { value: 'django', label: 'Django' },
  { value: 'flask', label: 'Flask' },
  { value: 'spring', label: 'Spring Boot' },
  { value: 'dotnet', label: '.NET Core' }
];

export const USER_DATA: OptionItem[] = [
  { value: 'user1', label: 'Alice Johnson (Frontend Developer)' },
  { value: 'user2', label: 'Bob Smith (Backend Engineer)' },
  { value: 'user3', label: 'Carol Davis (Full Stack Developer)' },
  { value: 'user4', label: 'David Wilson (DevOps Engineer)' },
  { value: 'user5', label: 'Emma Brown (UI/UX Designer)' },
  { value: 'user6', label: 'Frank Miller (Data Scientist)' }
];

export const COUNTRY_DATA: OptionItem[] = [
  { value: 'kr', label: '🇰🇷 South Korea (대한민국)' },
  { value: 'jp', label: '🇯🇵 Japan (日本)' },
  { value: 'us', label: '🇺🇸 United States' },
  { value: 'cn', label: '🇨🇳 China (中国)' },
  { value: 'de', label: '🇩🇪 Germany (Deutschland)' },
  { value: 'fr', label: '🇫🇷 France (France)' },
  { value: 'gb', label: '🇬🇧 United Kingdom' },
  { value: 'ca', label: '🇨🇦 Canada' }
];
