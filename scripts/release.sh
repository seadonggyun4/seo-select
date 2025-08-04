#!/bin/bash

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Usage: ./scripts/release.sh <version>"
  echo "Example: ./scripts/release.sh v2.0.11"
  exit 1
fi

echo "🚀 Starting release process for $VERSION..."

# 0. 환경 검증
echo "🔍 Checking environment..."
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is required but not installed."
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Git is required but not installed."
    exit 1
fi

# Git 상태 확인
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Working directory is not clean. Please commit or stash changes."
    exit 1
fi

# 1. 빌드 (타입 체크 포함)
echo "🔍 Type checking..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ Type check failed!"
    exit 1
fi

echo "📦 Building for CDN distribution..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# 2. 빌드 결과 검증
echo "✅ Verifying build output..."
if [ ! -f "dist/index.js" ]; then
    echo "❌ ES module build not found!"
    exit 1
fi

echo "📁 Build verification complete:"
echo "  - ES Module: $(du -h dist/index.js | cut -f1)"

# 3. 압축 파일 생성 (CDN용)
echo "📁 Creating distribution archives..."
ZIP_NAME="seo-select-dist-$VERSION.zip"
TAR_NAME="seo-select-dist-$VERSION.tar.gz"

# ZIP 파일 생성
zip -r $ZIP_NAME dist/ -x "*.map"
echo "  - Created: $ZIP_NAME ($(du -h $ZIP_NAME | cut -f1))"

# TAR.GZ 파일 생성
tar -czf $TAR_NAME dist/ --exclude="*.map"
echo "  - Created: $TAR_NAME ($(du -h $TAR_NAME | cut -f1))"

# 4. Git 태그 및 커밋
echo "📝 Creating git tag..."
CLEAN_VERSION=${VERSION#v}  # v 제거
git add dist/
git commit -m "build: update dist for $VERSION" || echo "No changes to commit"
git tag -a $VERSION -m "Release $VERSION"

# 5. npm 배포 (소스코드 + dist)
echo "📤 Publishing to npm..."
npm version $CLEAN_VERSION --no-git-tag-version  # 이미 태그 생성했으므로
npm publish --dry-run  # 먼저 드라이런으로 확인
if [ $? -eq 0 ]; then
    echo "🎯 Dry run successful, proceeding with actual publish..."
    npm publish
    if [ $? -ne 0 ]; then
        echo "❌ npm publish failed!"
        exit 1
    fi
else
    echo "❌ npm publish dry run failed!"
    exit 1
fi

# 6. GitHub 푸시
echo "📤 Pushing to GitHub..."
git push origin main
git push origin $VERSION

# 7. 파일 크기 및 성능 정보 수집
ES_SIZE=$(du -h dist/index.js | cut -f1)
GZIP_ES_SIZE=$(gzip -c dist/index.js | wc -c | awk '{printf "%.1fK", $1/1024}')

# 8. GitHub Release 생성
echo "🎉 Creating GitHub Release..."
gh release create $VERSION \
  $ZIP_NAME \
  $TAR_NAME \
  dist/index.js \
  --title "🚀 $VERSION - Enhanced CDN & npm Distribution" \
  --notes "
## 🎉 What's New in $VERSION

### 📦 Distribution Options
- **npm**: Source code distribution for bundler integration
- **CDN**: Pre-built bundles for direct browser usage
- **Downloads**: Offline distribution packages

### 📊 Bundle Size
- **ES Module**: $ES_SIZE (gzipped: $GZIP_ES_SIZE)

### 🚀 Quick Start

#### 📦 npm (Recommended for bundlers)
\`\`\`bash
npm install seo-select@$CLEAN_VERSION
\`\`\`

\`\`\`javascript
import { SeoSelect } from 'seo-select';
// Your bundler will handle the rest
\`\`\`

#### 🌐 CDN (ES Modules)
\`\`\`html
<script type=\"module\">
  import { SeoSelect } from 'https://cdn.jsdelivr.net/gh/seadonggyun4/seo-select@$VERSION/dist/index.js';
  // Ready to use!
</script>
\`\`\`

#### 📥 Direct Download
- **Full Package**: \`$ZIP_NAME\`
- **Compressed**: \`$TAR_NAME\`

### 🔗 CDN Links
- **jsDelivr ES (GitHub)**: https://cdn.jsdelivr.net/gh/seadonggyun4/seo-select@$VERSION/dist/index.js
- **GitHub Raw ES**: https://github.com/seadonggyun4/seo-select/releases/download/$VERSION/index.js

---
[📖 Full Documentation](https://github.com/seadonggyun4/seo-select#readme) | [🐛 Report Issues](https://github.com/seadonggyun4/seo-select/issues)
"

if [ $? -ne 0 ]; then
    echo "❌ GitHub release creation failed!"
    exit 1
fi

# 9. 정리
echo "🧹 Cleaning up temporary files..."
rm $ZIP_NAME $TAR_NAME

# 10. 배포 완료 안내
echo ""
echo "✅ Release $VERSION completed successfully!"
echo ""
echo "🎯 Distribution Summary:"
echo "  📦 npm: https://www.npmjs.com/package/seo-select"  
echo "  🌐 CDN (ES): https://cdn.jsdelivr.net/gh/seadonggyun4/seo-select@$VERSION/dist/index.js"
echo "  📋 GitHub: https://github.com/seadonggyun4/seo-select/releases/tag/$VERSION"
echo ""
echo "🎉 Happy coding! 🚀"