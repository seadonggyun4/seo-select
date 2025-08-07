// scripts/copy-styles.ts (루트 레벨)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 명령행 인자에서 대상 디렉토리 가져오기
const targetDir = process.argv[2] || 'react';

console.log(`🔧 스크립트 실행 정보:`);
console.log(`  - 현재 디렉토리: ${__dirname}`);
console.log(`  - 대상 디렉토리: ${targetDir}`);
console.log(`  - 전체 경로: ${path.join(__dirname, `../${targetDir}`)}`);

// 가능한 CSS 파일 경로들 (루트 기준)
const possiblePaths: string[] = [
  './dist/styles/components/style.css',
  './dist/styles/style.css', 
  './dist/index.css',
  './dist/style.css'
];

// 대상 디렉토리 확인
const targetDirPath = path.join(__dirname, `../${targetDir}`);
if (!fs.existsSync(targetDirPath)) {
  console.error(`❌ 대상 디렉토리가 존재하지 않습니다: ${targetDirPath}`);
  process.exit(1);
}

console.log(`✅ 대상 디렉토리 확인됨: ${targetDirPath}`);

// 대상 디렉토리의 dist 폴더 확인/생성
const targetDistDir = path.join(targetDirPath, 'dist');
if (!fs.existsSync(targetDistDir)) {
  console.log(`📁 dist 디렉토리 생성 중: ${targetDistDir}`);
  fs.mkdirSync(targetDistDir, { recursive: true });
}

// 대상 디렉토리의 dist/styles 생성
const stylesDir = path.join(targetDistDir, 'styles');
console.log(`📁 styles 디렉토리 생성 시도: ${stylesDir}`);

try {
  if (!fs.existsSync(stylesDir)) {
    fs.mkdirSync(stylesDir, { recursive: true });
    console.log(`✅ styles 디렉토리 생성 완료: ${stylesDir}`);
  } else {
    console.log(`✅ styles 디렉토리 이미 존재: ${stylesDir}`);
  }
} catch (error) {
  console.error(`❌ styles 디렉토리 생성 실패: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

let copied = false;

console.log(`🔍 ${targetDir} 프로젝트용 CSS 파일을 찾는 중...`);

// 각 경로를 순서대로 확인하여 첫 번째로 존재하는 CSS 파일 복사
for (const cssPath of possiblePaths) {
  const fullPath = path.resolve(__dirname, '..', cssPath);
  console.log(`  🔍 확인 중: ${fullPath}`);
  
  if (fs.existsSync(fullPath)) {
    const targetPath = path.join(stylesDir, 'style.css');
    console.log(`  ✅ CSS 파일 발견: ${fullPath}`);
    console.log(`  📋 복사 대상: ${targetPath}`);
    
    try {
      fs.copyFileSync(fullPath, targetPath);
      console.log(`✅ CSS 파일 복사 완료: ${cssPath} -> ${targetDir}/dist/styles/style.css`);
      
      // 복사된 파일 크기 확인
      const stats = fs.statSync(targetPath);
      console.log(`  📊 복사된 파일 크기: ${stats.size} bytes`);
      
      copied = true;
      break;
    } catch (error) {
      console.error(`❌ CSS 파일 복사 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    console.log(`  ❌ 파일 없음: ${fullPath}`);
  }
}

if (!copied) {
  console.error('❌ CSS 파일을 찾을 수 없습니다. 다음 경로들을 확인했습니다:');
  possiblePaths.forEach(cssPath => console.log(`  - ${cssPath}`));
  
  // dist 폴더에서 CSS 파일 검색
  const distDir = path.resolve(__dirname, '../dist');
  if (fs.existsSync(distDir)) {
    console.log('\n📁 dist 폴더에서 CSS 파일 검색 중...');
    findCssFiles(distDir);
  } else {
    console.log(`❌ dist 폴더가 존재하지 않습니다: ${distDir}`);
    console.log('💡 먼저 메인 프로젝트를 빌드해주세요: npm run build');
  }
  
  process.exit(1);
} else {
  console.log('🎉 CSS 파일 복사 작업이 완료되었습니다!');
}

// CSS 파일을 재귀적으로 찾는 함수
function findCssFiles(dir: string, level: number = 0): void {
  if (level > 3) return; // 최대 3단계 깊이까지만 검색
  
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        findCssFiles(fullPath, level + 1);
      } else if (file.endsWith('.css')) {
        console.log(`  🔍 발견된 CSS 파일: ${path.relative(path.join(__dirname, '..'), fullPath)}`);
      }
    });
  } catch (error) {
    console.error(`  ❌ 디렉토리 읽기 실패: ${error instanceof Error ? error.message : String(error)}`);
  }
}