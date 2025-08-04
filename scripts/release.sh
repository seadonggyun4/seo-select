#!/bin/bash

# 버전 타입 파라미터 (patch, minor, major)
VERSION_TYPE=$1

if [ -z "$VERSION_TYPE" ]; then
  echo "Usage: ./scripts/release.sh <version-type>"
  echo "  version-type: patch | minor | major"
  echo ""
  echo "Examples:"
  echo "  ./scripts/release.sh patch   # 2.0.13 → 2.0.14"
  echo "  ./scripts/release.sh minor   # 2.0.13 → 2.1.0"
  echo "  ./scripts/release.sh major   # 2.0.13 → 3.0.0"
  exit 1
fi

# 유효한 버전 타입 검증
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo "❌ Invalid version type: $VERSION_TYPE"
  echo "   Valid options: patch, minor, major"
  exit 1
fi

echo "🚀 Starting release process with $VERSION_TYPE version bump..."

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

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
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

# 1. 현재 버전 확인 및 새 버전 계산
CURRENT_VERSION=$(jq -r '.version' package.json)
echo "📋 Current version: $CURRENT_VERSION"

# 새 버전 계산 함수
calculate_new_version() {
    local current=$1
    local type=$2
    
    # 버전을 major.minor.patch로 분할
    IFS='.' read -ra VERSION_PARTS <<< "$current"
    local major=${VERSION_PARTS[0]}
    local minor=${VERSION_PARTS[1]}
    local patch=${VERSION_PARTS[2]}
    
    case $type in
        "patch")
            patch=$((patch + 1))
            ;;
        "minor")
            minor=$((minor + 1))
            patch=0
            ;;
        "major")
            major=$((major + 1))
            minor=0
            patch=0
            ;;
    esac
    
    echo "$major.$minor.$patch"
}

NEW_VERSION=$(calculate_new_version $CURRENT_VERSION $VERSION_TYPE)
NEW_VERSION_TAG="v$NEW_VERSION"

echo "📝 New version will be: $NEW_VERSION ($NEW_VERSION_TAG)"

# 사용자 확인
echo ""
read -p "🤔 Do you want to proceed with this version bump? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Release cancelled by user."
    exit 1
fi

# 2. package.json 버전 업데이트
echo "📝 Updating package.json version to $NEW_VERSION..."
jq ".version = \"$NEW_VERSION\"" package.json > package.json.tmp && mv package.json.tmp package.json

if [ $? -ne 0 ]; then
    echo "❌ Failed to update package.json version!"
    exit 1
fi

echo "✅ package.json version updated successfully"

# 3. 타입 체크
echo "🔍 Type checking..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ Type check failed!"
    exit 1
fi

# 4. 빌드 (npm 배포용)
echo "📦 Building for NPM distribution..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# 5. 미니파이 빌드 (GitHub Release용) - npm publish 전에 실행
echo "📦 Building minified version for GitHub Release..."
npm run build:min
if [ $? -ne 0 ]; then
    echo "❌ Minified build failed!"
    exit 1
fi

# 6. 빌드 결과 검증
echo "✅ Verifying build output..."
if [ ! -f "dist/index.js" ]; then
    echo "❌ NPM build file not found!"
    exit 1
fi

if [ ! -f "min/index.js" ]; then
    echo "❌ Minified build file not found!"
    exit 1
fi

if [ ! -f "min/index.css" ]; then
    echo "❌ Minified CSS file not found!"
    exit 1
fi

# 파일 크기 정보 수집 (파일이 존재하는 시점에서)
BUILD_SIZE=$(du -h min/index.js | cut -f1)
CSS_SIZE=$(du -h min/index.css | cut -f1)
GZIP_SIZE=$(gzip -c min/index.js | wc -c | awk '{printf "%.1fK", $1/1024}')

echo "📁 Build verification complete:"
echo "  - NPM built file: $(du -h dist/index.js | cut -f1)"
echo "  - Minified JS: $BUILD_SIZE"
echo "  - Minified CSS: $CSS_SIZE"

# 7. 압축 파일 생성 (GitHub Release용) - min 폴더가 존재하는 시점에서
echo "📁 Creating distribution archives..."
ZIP_NAME="seo-select-standalone-$NEW_VERSION_TAG.zip"
TAR_NAME="seo-select-standalone-$NEW_VERSION_TAG.tar.gz"

# ZIP 파일 생성 (min 폴더 내용)
zip -r $ZIP_NAME min/
echo "  - Created: $ZIP_NAME ($(du -h $ZIP_NAME | cut -f1))"

# TAR.GZ 파일 생성 (min 폴더 내용)
tar -czf $TAR_NAME min/
echo "  - Created: $TAR_NAME ($(du -h $TAR_NAME | cut -f1))"

# 8. npm 배포 (빌드된 파일) - prepublishOnly가 clean을 실행하므로 압축 파일 생성 후에 실행
echo "📤 Publishing built files to npm..."
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

# 9. Git 태그 및 커밋
echo "📝 Creating git commit and tag..."
git add package.json
git commit -m "chore: bump version to $NEW_VERSION_TAG"

if [ $? -ne 0 ]; then
    echo "❌ Failed to create commit!"
    exit 1
fi

git tag -a $NEW_VERSION_TAG -m "Release $NEW_VERSION_TAG"

if [ $? -ne 0 ]; then
    echo "❌ Failed to create git tag!"
    exit 1
fi

# 10. GitHub 푸시
echo "📤 Pushing to GitHub..."
git push origin main
git push origin $NEW_VERSION_TAG

# 11. GitHub Release 생성 (압축 파일만 업로드)
echo "🎉 Creating GitHub Release..."
gh release create $NEW_VERSION_TAG \
  $ZIP_NAME \
  $TAR_NAME \
  --title "🚀 $NEW_VERSION_TAG - Standalone & NPM Distribution" \
  --notes "
## 🎉 What's New in $NEW_VERSION_TAG

### 📦 Distribution Strategy
This release provides both NPM package with pre-built files and standalone GitHub Release assets:

#### 📦 NPM Distribution (Recommended for Bundlers)
- **Pre-built Files**: Optimized for modern bundlers (Vite, Webpack, etc.)
- **Tree-shaking Support**: Import only what you need
- **TypeScript Support**: Full type definitions included
- **Modern Bundle**: Built with Vite for optimal performance

\`\`\`bash
npm install seo-select@$NEW_VERSION
\`\`\`

\`\`\`javascript
// Import basic select component
import 'seo-select';

// Import search-enabled select component
import 'seo-select/components/seo-select-search';

// Import event types (TypeScript)
import type { 
  SeoSelectEvent, 
  SeoDeselectEvent,
  SeoResetEvent 
} from 'seo-select/event';

// Import Style
import 'seo-select/styles'
\`\`\`

#### 🌐 GitHub Release (Standalone - Direct Browser Usage)
- **All Dependencies Included**: Lit framework bundled inside
- **No Build Required**: Ready-to-use in any HTML file
- **Offline Usage**: Perfect for local development or CDN-free environments
- **Single File Solution**: Just download and use

### 📊 Build Information
- **Standalone JS**: $BUILD_SIZE (gzipped: $GZIP_SIZE)
- **Standalone CSS**: $CSS_SIZE
- **Target**: ES2020, Modern Browsers
- **Dependencies**: Lit framework bundled

#### 📥 GitHub Release Assets (Standalone)
- **Full Package**: \`$ZIP_NAME\`
- **Compressed**: \`$TAR_NAME\`

#### 🌐 Direct Browser Usage (Standalone)
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <!-- Download from GitHub Release and host locally -->
  <link rel=\"stylesheet\" href=\"./min/index.css\">
  <script type=\"module\" src=\"./min/index.js\"></script>
</head>
<body>
  <seo-select name=\"test\">
    <option value=\"1\">Option 1</option>
    <option value=\"2\">Option 2</option>
  </seo-select>
</body>
</html>
\`\`\`

### 🔧 When to Use Which Version

#### Use NPM Package When:
- Using modern bundlers (Vite, Webpack, Rollup, etc.)
- Building applications with TypeScript
- Need tree-shaking and dead code elimination
- Want to import specific components only

#### Use GitHub Release When:
- Direct browser usage without bundlers
- Quick prototyping or testing
- Offline development environments
- Legacy projects without build tools

### ⚡ Performance Improvements
- Optimized bundle size with Vite
- Modern JavaScript features with ES2020 target
- Enhanced tree-shaking capabilities (NPM version)
- All dependencies included (Standalone version)

### 🆕 What's New in This Version
- Standalone version now includes all dependencies
- Better compatibility across different environments
- Improved build process for both distributions
- Enhanced documentation for different use cases

---
[📖 Full Documentation](https://github.com/seadonggyun4/seo-select#readme) | [🐛 Report Issues](https://github.com/seadonggyun4/seo-select/issues)
"

if [ $? -ne 0 ]; then
    echo "❌ GitHub release creation failed!"
    exit 1
fi

# 12. 정리
echo "🧹 Cleaning up temporary files..."
rm -f $ZIP_NAME $TAR_NAME

# 13. 배포 완료 안내
echo ""
echo "✅ Release $NEW_VERSION_TAG completed successfully!"
echo ""
echo "📝 Changes made:"
echo "  - Updated package.json version: $CURRENT_VERSION → $NEW_VERSION"
echo "  - Created git commit and tag: $NEW_VERSION_TAG"
echo "  - Published built files to npm: seo-select@$NEW_VERSION"
echo "  - Created GitHub Release with standalone assets"
echo ""
echo "🎯 Distribution Summary:"
echo "  📦 NPM (For Bundlers): https://www.npmjs.com/package/seo-select"  
echo "  📋 GitHub Release (Standalone): https://github.com/seadonggyun4/seo-select/releases/tag/$NEW_VERSION_TAG"
echo "  📁 Standalone Assets: index.js ($BUILD_SIZE), index.css ($CSS_SIZE)"
echo ""
echo "💡 Usage:"
echo "  - For bundlers: npm install seo-select@$NEW_VERSION"
echo "  - For direct browser use: Download standalone files from GitHub Release"
echo ""
echo "🎉 Happy coding! 🚀"