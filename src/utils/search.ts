/**
 * 다국어 문자열 검색을 위한 통합 함수
 * - 한글: 초성 검색 지원
 * - 영어: 대소문자 무시
 * - 일본어: 히라가나/가타카나 변환 및 로마지 지원
 * - 중국어: 간체/번체 변환 및 병음 지원
 */

// 일본어 히라가나 ↔ 가타카나 변환 맵
const HIRAGANA_TO_KATAKANA: Record<string, string> = {
  'あ': 'ア', 'い': 'イ', 'う': 'ウ', 'え': 'エ', 'お': 'オ',
  'か': 'カ', 'き': 'キ', 'く': 'ク', 'け': 'ケ', 'こ': 'コ',
  'が': 'ガ', 'ぎ': 'ギ', 'ぐ': 'グ', 'げ': 'ゲ', 'ご': 'ゴ',
  'さ': 'サ', 'し': 'シ', 'す': 'ス', 'せ': 'セ', 'そ': 'ソ',
  'ざ': 'ザ', 'じ': 'ジ', 'ず': 'ズ', 'ぜ': 'ゼ', 'ぞ': 'ゾ',
  'た': 'タ', 'ち': 'チ', 'つ': 'ツ', 'て': 'テ', 'と': 'ト',
  'だ': 'ダ', 'ぢ': 'ヂ', 'づ': 'ヅ', 'で': 'デ', 'ど': 'ド',
  'な': 'ナ', 'に': 'ニ', 'ぬ': 'ヌ', 'ね': 'ネ', 'の': 'ノ',
  'は': 'ハ', 'ひ': 'ヒ', 'ふ': 'フ', 'へ': 'ヘ', 'ほ': 'ホ',
  'ば': 'バ', 'び': 'ビ', 'ぶ': 'ブ', 'べ': 'ベ', 'ぼ': 'ボ',
  'ぱ': 'パ', 'ぴ': 'ピ', 'ぷ': 'プ', 'ぺ': 'ペ', 'ぽ': 'ポ',
  'ま': 'マ', 'み': 'ミ', 'む': 'ム', 'め': 'メ', 'も': 'モ',
  'や': 'ヤ', 'ゆ': 'ユ', 'よ': 'ヨ',
  'ら': 'ラ', 'り': 'リ', 'る': 'ル', 'れ': 'レ', 'ろ': 'ロ',
  'わ': 'ワ', 'ゐ': 'ヰ', 'ゑ': 'ヱ', 'を': 'ヲ', 'ん': 'ン',
  'ー': 'ー', 'っ': 'ッ', 'ゃ': 'ャ', 'ゅ': 'ュ', 'ょ': 'ョ',
  'ぁ': 'ァ', 'ぃ': 'ィ', 'ぅ': 'ゥ', 'ぇ': 'ェ', 'ぉ': 'ォ'
};

const KATAKANA_TO_HIRAGANA: Record<string, string> = {};
Object.entries(HIRAGANA_TO_KATAKANA).forEach(([hiragana, katakana]) => {
  KATAKANA_TO_HIRAGANA[katakana] = hiragana;
});

// 일본어 로마자 변환 맵 (기본적인 것만)
const ROMAJI_TO_HIRAGANA: Record<string, string> = {
  'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
  'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
  'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
  'sa': 'さ', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
  'za': 'ざ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
  'ta': 'た', 'chi': 'ち', 'tsu': 'つ', 'te': 'て', 'to': 'と',
  'da': 'だ', 'di': 'ぢ', 'du': 'づ', 'de': 'で', 'do': 'ど',
  'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
  'ha': 'は', 'hi': 'ひ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
  'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
  'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
  'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
  'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
  'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
  'wa': 'わ', 'wo': 'を', 'n': 'ん'
};

// 중국어 간체/번체 변환 맵 (일부만 포함, 실제로는 더 많은 매핑이 필요)
const SIMPLIFIED_TO_TRADITIONAL: Record<string, string> = {
  '爱': '愛', '国': '國', '学': '學', '会': '會', '说': '說',
  '时': '時', '实': '實', '现': '現', '发': '發', '来': '來',
  '这': '這', '那': '那', '里': '裡', '为': '為', '什': '什',
  '么': '麼', '样': '樣', '电': '電', '话': '話', '网': '網',
  '页': '頁', '应': '應', '该': '該', '让': '讓', '过': '過',
  '关': '關', '机': '機', '构': '構', '经': '經', '营': '營',
  '业': '業', '务': '務', '员': '員', '户': '戶', '门': '門',
  '东': '東', '西': '西', '南': '南', '北': '北', '中': '中',
  '华': '華', '民': '民', '共': '共', '和': '和', '人': '人'
};

const TRADITIONAL_TO_SIMPLIFIED: Record<string, string> = {};
Object.entries(SIMPLIFIED_TO_TRADITIONAL).forEach(([simplified, traditional]) => {
  TRADITIONAL_TO_SIMPLIFIED[traditional] = simplified;
});

// 중국어 기본 병음 매핑 (일부만 포함)
const CHINESE_TO_PINYIN: Record<string, string> = {
  '你': 'ni', '好': 'hao', '我': 'wo', '是': 'shi', '的': 'de',
  '在': 'zai', '有': 'you', '不': 'bu', '人': 'ren', '了': 'le',
  '中': 'zhong', '国': 'guo', '一': 'yi', '个': 'ge', '上': 'shang',
  '也': 'ye', '很': 'hen', '到': 'dao', '说': 'shuo', '要': 'yao',
  '去': 'qu', '就': 'jiu', '得': 'de', '可': 'ke', '以': 'yi',
  '还': 'hai', '时': 'shi', '候': 'hou', '会': 'hui', '这': 'zhe',
  '那': 'na', '什': 'shen', '么': 'me', '没': 'mei', '看': 'kan',
  '来': 'lai', '对': 'dui', '里': 'li', '后': 'hou', '自': 'zi',
  '己': 'ji', '年': 'nian', '大': 'da', '小': 'xiao', '多': 'duo'
};

/**
 * 한글 초성 추출 (기존 함수 유지)
 */
const getKoreanChosung = (str: string): string => {
  const HANGUL_START = 0xac00;
  const HANGUL_END = 0xd7a3;
  const CHOSUNG_LIST: readonly string[] = [
    'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 
    'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
  ] as const;
  
  const CHOSUNG_UNICODE: readonly number[] = CHOSUNG_LIST.map(ch => ch.charCodeAt(0));

  let result = '';

  for (const char of str) {
    const code = char.charCodeAt(0);

    // 한글 완성형
    if (code >= HANGUL_START && code <= HANGUL_END) {
      const offset = code - HANGUL_START;
      const chosungIndex = Math.floor(offset / (21 * 28));
      result += CHOSUNG_LIST[chosungIndex];
    }
    // 자모 문자 (ㄱ~ㅎ)
    else if (CHOSUNG_UNICODE.includes(code)) {
      result += char;
    }
    else {
      result += char;
    }
  }

  return result;
};

/**
 * 일본어 정규화 (히라가나/가타카나 통합)
 */
const normalizeJapanese = (str: string): string => {
  return str
    .split('')
    .map(char => {
      // 가타카나를 히라가나로 변환
      if (KATAKANA_TO_HIRAGANA[char]) {
        return KATAKANA_TO_HIRAGANA[char];
      }
      return char;
    })
    .join('');
};

/**
 * 중국어 정규화 (간체/번체 통합)
 */
const normalizeChinese = (str: string): string => {
  return str
    .split('')
    .map(char => {
      // 번체를 간체로 변환
      if (TRADITIONAL_TO_SIMPLIFIED[char]) {
        return TRADITIONAL_TO_SIMPLIFIED[char];
      }
      return char;
    })
    .join('');
};

/**
 * 로마자를 히라가나로 변환 (부분 매칭)
 */
const romajiToHiragana = (romaji: string): string => {
  let result = '';
  let i = 0;
  
  while (i < romaji.length) {
    let found = false;
    
    // 3글자부터 확인 (shi, tsu 등)
    for (let len = 3; len >= 1; len--) {
      if (i + len <= romaji.length) {
        const substr = romaji.substring(i, i + len);
        if (ROMAJI_TO_HIRAGANA[substr]) {
          result += ROMAJI_TO_HIRAGANA[substr];
          i += len;
          found = true;
          break;
        }
      }
    }
    
    if (!found) {
      result += romaji[i];
      i++;
    }
  }
  
  return result;
};

/**
 * 중국어를 병음으로 변환
 */
const chineseToPinyin = (str: string): string => {
  return str
    .split('')
    .map(char => CHINESE_TO_PINYIN[char] || char)
    .join('');
};

/**
 * 언어 감지 함수
 */
const detectLanguage = (str: string): 'ko' | 'ja' | 'zh' | 'en' | 'mixed' => {
  const koreanCount = (str.match(/[\u3131-\u3163\uac00-\ud7a3]/g) || []).length;
  const japaneseCount = (str.match(/[\u3040-\u309f\u30a0-\u30ff]/g) || []).length;
  const chineseCount = (str.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishCount = (str.match(/[a-zA-Z]/g) || []).length;
  
  const total = koreanCount + japaneseCount + chineseCount + englishCount;
  
  if (total === 0) return 'en';
  
  if (koreanCount / total > 0.5) return 'ko';
  if (japaneseCount / total > 0.5) return 'ja';
  if (chineseCount / total > 0.5) return 'zh';
  if (englishCount / total > 0.5) return 'en';
  
  return 'mixed';
};

/**
 * 다국어 검색을 위한 통합 정규화 함수
 */
export const getChosungAll = (str: string): string => {
  const cleanStr = str.toLowerCase().replace(/\s+/g, '');
  
  let result = '';
  
  for (const char of cleanStr) {
    const code = char.charCodeAt(0);
    
    // 숫자는 그대로 유지
    if (/[0-9]/.test(char)) {
      result += char;
      continue;
    }
    
    // 알파벳은 대문자로 변환
    if (/[a-zA-Z]/.test(char)) {
      result += char.toUpperCase();
      continue;
    }
    
    // 한글 처리
    if (code >= 0x3131 && code <= 0x3163 || code >= 0xac00 && code <= 0xd7a3) {
      result += getKoreanChosung(char);
      continue;
    }
    
    // 일본어 처리 (히라가나/가타카나)
    if ((code >= 0x3040 && code <= 0x309f) || (code >= 0x30a0 && code <= 0x30ff)) {
      result += normalizeJapanese(char);
      continue;
    }
    
    // 중국어 처리 (한자)
    if (code >= 0x4e00 && code <= 0x9fff) {
      result += normalizeChinese(char);
      continue;
    }
    
    // 기타 문자는 그대로 유지
    result += char;
  }
  
  return result;
};

/**
 * 고급 다국어 검색 함수
 * 검색어와 대상 텍스트 모두 여러 언어로 처리
 */
export const createMultilingualSearchPattern = (searchText: string): RegExp[] => {
  const normalizedSearch = getChosungAll(searchText);
  const language = detectLanguage(searchText);
  const patterns: RegExp[] = [];
  
  // 기본 패턴 (초성/정규화된 텍스트)
  const basicPattern = normalizedSearch.split('').join('.*');
  patterns.push(new RegExp(basicPattern, 'i'));
  
  // 일본어인 경우 로마자 검색도 지원
  if (language === 'ja' || language === 'mixed') {
    if (/[a-zA-Z]/.test(searchText)) {
      const hiraganaFromRomaji = romajiToHiragana(searchText.toLowerCase());
      const katakanaFromRomaji = hiraganaFromRomaji
        .split('')
        .map(char => HIRAGANA_TO_KATAKANA[char] || char)
        .join('');
      
      if (hiraganaFromRomaji !== searchText.toLowerCase()) {
        patterns.push(new RegExp(hiraganaFromRomaji.split('').join('.*'), 'i'));
        patterns.push(new RegExp(katakanaFromRomaji.split('').join('.*'), 'i'));
      }
    }
  }
  
  // 중국어인 경우 병음 검색도 지원
  if (language === 'zh' || language === 'mixed') {
    if (/[a-zA-Z]/.test(searchText)) {
      // 병음으로 검색하는 경우, 중국어 텍스트를 병음으로 변환하여 비교해야 함
      // 이는 검색 대상 텍스트에서 처리됨
    }
  }
  
  return patterns;
};

/**
 * 다국어 텍스트 매칭 함수
 */
export const isMultilingualMatch = (searchText: string, targetText: string): boolean => {
  const patterns = createMultilingualSearchPattern(searchText);
  const normalizedTarget = getChosungAll(targetText);
  const language = detectLanguage(targetText);
  
  // 기본 매칭
  for (const pattern of patterns) {
    if (pattern.test(normalizedTarget)) {
      return true;
    }
  }
  
  // 중국어 대상 텍스트에 대한 병음 매칭
  if (language === 'zh' || language === 'mixed') {
    const pinyinTarget = chineseToPinyin(targetText);
    for (const pattern of patterns) {
      if (pattern.test(pinyinTarget)) {
        return true;
      }
    }
  }
  
  // 일본어 대상 텍스트에 대한 추가 매칭
  if (language === 'ja' || language === 'mixed') {
    const hiraganaTarget = normalizeJapanese(targetText);
    for (const pattern of patterns) {
      if (pattern.test(hiraganaTarget)) {
        return true;
      }
    }
  }
  
  return false;
};