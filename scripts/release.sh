#!/bin/bash

VERSION_INPUT=$1

if [ -z "$VERSION_INPUT" ]; then
  echo "Usage: ./scripts/release.sh <patch|minor|major|v1.2.3>"
  echo "Examples:"
  echo "  ./scripts/release.sh patch    # Auto increment patch version"
  echo "  ./scripts/release.sh minor    # Auto increment minor version"
  echo "  ./scripts/release.sh major    # Auto increment major version"
  echo "  ./scripts/release.sh v2.0.11  # Specify exact version"
  exit 1
fi

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

if ! command -v jq &> /dev/null; then
    echo "❌ jq is required but not installed. Please install it first."
    echo "   - Ubuntu/Debian: sudo apt-get install jq"
    echo "   - macOS: brew install jq"
    exit 1
fi

# Git 상태 확인
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Working directory is not clean. Please commit or stash changes."
    exit 1
fi

# package.json 존재 확인
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

# 1. 버전 계산
CURRENT_VERSION=$(jq -r '.version' package.json)
echo "📝 Current version: $CURRENT_VERSION"

if [[ $VERSION_INPUT =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    # 직접 버전 지정 (v1.2.3 형태)
    VERSION=$VERSION_INPUT
    CLEAN_VERSION=${VERSION#v}  # v 제거
elif [ "$VERSION_INPUT" = "patch" ] || [ "$VERSION_INPUT" = "minor" ] || [ "$VERSION_INPUT" = "major" ]; then
    # semver 방식으로 버전 업
    IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
    MAJOR=${VERSION_PARTS[0]}
    MINOR=${VERSION_PARTS[1]}
    PATCH=${VERSION_PARTS[2]}
    
    case $VERSION_INPUT in
        "patch")
            PATCH=$((PATCH + 1))
            ;;
        "minor")
            MINOR=$((MINOR + 1))
            PATCH=0
            ;;
        "major")
            MAJOR=$((MAJOR + 1))
            MINOR=0
            PATCH=0
            ;;
    esac
    
    CLEAN_VERSION="$MAJOR.$MINOR.$PATCH"
    VERSION="v$CLEAN_VERSION"
else
    echo "❌ Invalid version input: $VERSION_INPUT"
    echo "    Use: patch, minor, major, or v1.2.3 format"
    exit 1
fi

echo "🚀 Starting release process for $VERSION (from $CURRENT_VERSION)..."

# 태그가 이미 존재하는지 확인
if git tag -l | grep -q "^$VERSION$"; then
    echo "❌ Tag $VERSION already exists!"
    echo "   To force release, delete the tag first:"
    echo "   git tag -d $VERSION"
    echo "   git push origin :refs/tags/$VERSION"
    exit 1
fi

# 2. package.json 버전 업데이트
echo "📝 Updating package.json version to $CLEAN_VERSION..."
echo "  - Current version: $CURRENT_VERSION"
echo "  - New version: $CLEAN_VERSION"

# package.json 버전 업데이트
jq ".version = \"$CLEAN_VERSION\"" package.json > package.json.tmp && mv package.json.tmp package.json

if [ $? -ne 0 ]; then
    echo "❌ Failed to update package.json version!"
    exit 1
fi

echo "✅ package.json version updated successfully"

# 3. 빌드 (타입 체크 포함)
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

# 4. 빌드 결과 검증
echo "✅ Verifying build output..."
if [ ! -f "dist/index.js" ]; then
    echo "❌ ES module build not found!"
    exit 1
fi

echo "📁 Build verification complete:"
echo "  - ES Module: $(du -h dist/index.js | cut -f1)"

# 5. 압축 파일 생성 (CDN용)
echo "📁 Creating distribution archives..."
ZIP_NAME="seo-select-dist-$VERSION.zip"
TAR_NAME="seo-select-dist-$VERSION.tar.gz"

# ZIP 파일 생성
zip -r $ZIP_NAME dist/ -x "*.map"
echo "  - Created: $ZIP_NAME ($(du -h $ZIP_NAME | cut -f1))"

# TAR.GZ 파일 생성
tar -czf $TAR_NAME dist/ --exclude="*.map"
echo "  - Created: $TAR_NAME ($(du -h $TAR_NAME | cut -f1))"

# 6. Git 태그 및 커밋
echo "📝 Creating git commit and tag..."
git add package.json dist/
git commit -m "chore: bump version to $VERSION and update dist"

if [ $? -ne 0 ]; then
    echo "❌ Failed to create commit!"
    exit 1
fi

git tag -a $VERSION -m "Release $VERSION"

if [ $? -ne 0 ]; then
    echo "❌ Failed to create git tag!"
    exit 1
fi

# 7. npm 배포 (소스코드 + dist)
echo "📤 Publishing to npm..."
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

# 8. GitHub 푸시
echo "📤 Pushing to GitHub..."
git push origin main
git push origin $VERSION

# 9. 파일 크기 및 성능 정보 수집
ES_SIZE=$(du -h dist/index.js | cut -f1)
GZIP_ES_SIZE=$(gzip -c dist/index.js | wc -c | awk '{printf "%.1fK", $1/1024}')

# 10. GitHub Release 생성
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

# 11. 정리
echo "🧹 Cleaning up temporary files..."
rm $ZIP_NAME $TAR_NAME

# 12. 배포 완료 안내
echo ""
echo "✅ Release $VERSION completed successfully!"
echo ""
echo "📝 Changes made:"
echo "  - Updated package.json version: $CURRENT_VERSION → $CLEAN_VERSION"
echo "  - Created git commit and tag: $VERSION"
echo "  - Published to npm: seo-select@$CLEAN_VERSION"
echo ""
echo "🎯 Distribution Summary:"
echo "  📦 npm: https://www.npmjs.com/package/seo-select"  
echo "  🌐 CDN (ES): https://cdn.jsdelivr.net/gh/seadonggyun4/seo-select@$VERSION/dist/index.js"
echo "  📋 GitHub: https://github.com/seadonggyun4/seo-select/releases/tag/$VERSION"
echo ""
echo "🎉 Happy coding! 🚀"