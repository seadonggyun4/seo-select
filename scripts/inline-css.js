import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CSS를 JS에 인라인으로 삽입하는 스크립트
function inlineCss() {
  const distDir = path.join(__dirname, '../dist');
  const jsFile = path.join(distDir, 'index.js');
  const cssFile = path.join(distDir, 'styles.css');

  // 파일 존재 여부 확인
  if (!fs.existsSync(jsFile)) {
    console.error('❌ index.js not found!');
    process.exit(1);
  }

  let jsContent = fs.readFileSync(jsFile, 'utf8');
  let cssContent = '';

  // CSS 파일이 있다면 읽기
  if (fs.existsSync(cssFile)) {
    cssContent = fs.readFileSync(cssFile, 'utf8')
      .replace(/\\/g, '\\\\')     // 백슬래시 이스케이프
      .replace(/`/g, '\\`')       // 백틱 이스케이프
      .replace(/\$/g, '\\$');
    console.log(`📄 CSS file found (${cssContent.length} chars), inlining styles...`);
  }

  // CSS import 구문 제거 (더 포괄적인 패턴)
  const originalLength = jsContent.length;
  jsContent = jsContent
    .replace(/import\s+['"][^'"]*\.s?css['"];?\s*/g, '')
    .replace(/import\s+['"][^'"]*\/styles\/[^'"]*\.s?css['"];?\s*/g, '')
    .replace(/import\s+['"][\.\/]*styles[^'"]*\.s?css['"];?\s*/g, '');
  
  const removedImports = originalLength - jsContent.length;
  if (removedImports > 0) {
    console.log(`✅ Removed ${removedImports} characters of CSS import statements`);
  }

  // CSS를 JS 상단에 인라인으로 추가
  if (cssContent.trim()) {
    const cssInjectCode = `// Auto-injected CSS styles for CDN usage
(function() {
  if (typeof document !== 'undefined') {
    const existingStyle = document.querySelector('style[data-seo-select]');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.setAttribute('data-seo-select', 'true');
      style.textContent = \`${cssContent}\`;
      document.head.appendChild(style);
    }
  }
})();

`;
    jsContent = cssInjectCode + jsContent;
    console.log('✅ CSS injection code added to JavaScript');
  }

  // 수정된 JS 파일 저장
  fs.writeFileSync(jsFile, jsContent, 'utf8');
  console.log('✅ CSS successfully inlined into index.js');

  // CSS 파일 제거
  if (fs.existsSync(cssFile)) {
    fs.unlinkSync(cssFile);
    console.log('✅ styles.css removed');
  }

  // dist 디렉토리의 모든 CSS 파일 제거
  const files = fs.readdirSync(distDir);
  const removedCssFiles = [];
  
  files.forEach(file => {
    if (file.endsWith('.css')) {
      const filePath = path.join(distDir, file);
      fs.unlinkSync(filePath);
      removedCssFiles.push(file);
    }
  });

  if (removedCssFiles.length > 0) {
    console.log(`✅ Removed additional CSS files: ${removedCssFiles.join(', ')}`);
  }

  // 최종 결과 확인
  const finalJsContent = fs.readFileSync(jsFile, 'utf8');
  const hasStyleInjection = finalJsContent.includes('createElement(\'style\')');
  const hasCssImports = /import\s+['"][^'"]*\.s?css['"]/.test(finalJsContent);

  console.log('\n📊 Final verification:');
  console.log(`   ✅ Style injection code: ${hasStyleInjection ? 'Present' : 'Missing'}`);
  console.log(`   ${hasCssImports ? '❌' : '✅'} CSS imports: ${hasCssImports ? 'Still present' : 'Removed'}`);
  console.log(`   📁 File size: ${Math.round(finalJsContent.length / 1024)} KB`);

  console.log('\n🎉 CSS inlining completed successfully!');
  console.log('🚀 Ready for CDN deployment!');
}

// 스크립트 실행
try {
  inlineCss();
} catch (error) {
  console.error('❌ Error during CSS inlining:', error.message);
  process.exit(1);
}