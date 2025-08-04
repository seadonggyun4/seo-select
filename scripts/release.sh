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

# 4. 빌드 (배포용 dist 생성)
echo "📦 Building for GitHub Release distribution..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# 5. 빌드 결과 검증
echo "✅ Verifying build output..."
if [ ! -f "dist/index.js" ]; then
    echo "❌ Built file not found!"
    exit 1
fi

echo "📁 Build verification complete:"
echo "  - Built file: $(du -h dist/index.js | cut -f1)"

# 6. 압축 파일 생성 (GitHub Release용)
echo "📁 Creating distribution archives..."
ZIP_NAME="seo-select-dist-$NEW_VERSION_TAG.zip"
TAR_NAME="seo-select-dist-$NEW_VERSION_TAG.tar.gz"

# ZIP 파일 생성
zip -r $ZIP_NAME dist/
echo "  - Created: $ZIP_NAME ($(du -h $ZIP_NAME | cut -f1))"

# TAR.GZ 파일 생성
tar -czf $TAR_NAME dist/
echo "  - Created: $TAR_NAME ($(du -h $TAR_NAME | cut -f1))"

# 7. npm 배포 (소스코드만)
echo "📤 Publishing source code to npm..."
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

# 8. Git 태그 및 커밋
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

# 9. GitHub 푸시
echo "📤 Pushing to GitHub..."
git push origin main
git push origin $NEW_VERSION_TAG

# 10. 파일 크기 정보 수집
BUILD_SIZE=$(du -h dist/index.js | cut -f1)
GZIP_SIZE=$(gzip -c dist/index.js | wc -c | awk '{printf "%.1fK", $1/1024}')

# 11. GitHub Release 생성
echo "🎉 Creating GitHub Release..."
gh release create $NEW_VERSION_TAG \
  $ZIP_NAME \
  $TAR_NAME \
  dist/index.js \
  --title "🚀 $NEW_VERSION_TAG - Source Distribution & Build Assets" \
  --notes "
## 🎉 What's New in $NEW_VERSION_TAG

### 📦 Distribution Strategy
This release provides both source code distribution and pre-built assets:

#### 📦 NPM Distribution (Recommended)
- **Source Code Only**: Unminified TypeScript source files
- **Build Flexibility**: Use your own build tools and configurations  
- **Bundle Optimization**: Better tree-shaking and dead code elimination
- **Developer Experience**: Direct TypeScript source access for debugging

#### 🌐 GitHub Release Distribution
- **Pre-built Assets**: Minified and optimized for direct usage
- **Offline Usage**: Download and host locally
- **Quick Testing**: Ready-to-use built files

### 📊 Build Information
- **Built File Size**: $BUILD_SIZE (gzipped: $GZIP_SIZE)
- **Target**: ES2020, Modern Browsers

### 🚀 Quick Start

#### 📦 NPM Installation (Source Distribution)
\`\`\`bash
npm install seo-select@$NEW_VERSION
\`\`\`

\`\`\`javascript
// Your bundler will compile TypeScript source
import { SeoSelect } from 'seo-select';
import 'seo-select/components/seo-select-search';
\`\`\`

#### 📥 GitHub Release Assets (Pre-built)
- **Full Package**: \`$ZIP_NAME\`
- **Compressed**: \`$TAR_NAME\`
- **Single File**: \`index.js\` (minified, ready-to-use)

#### 🌐 Direct File Usage
\`\`\`html
<!-- Download from GitHub Release and host locally -->
<script type=\"module\" src=\"./dist/index.js\"></script>
\`\`\`

### 🔧 Migration Notes
- NPM package now contains TypeScript source files instead of compiled JavaScript
- For immediate usage without build tools, use GitHub Release assets
- All APIs remain backward compatible

### 🎯 Recommended Usage
- **For Development/Production**: Use NPM package with your bundler
- **For Quick Testing/Prototyping**: Use GitHub Release built files
- **For Offline/Local Hosting**: Download release archives

---
[📖 Full Documentation](https://github.com/seadonggyun4/seo-select#readme) | [🐛 Report Issues](https://github.com/seadonggyun4/seo-select/issues)
"

if [ $? -ne 0 ]; then
    echo "❌ GitHub release creation failed!"
    exit 1
fi

# 12. 정리
echo "🧹 Cleaning up temporary files..."
rm $ZIP_NAME $TAR_NAME

# 13. 배포 완료 안내
echo ""
echo "✅ Release $NEW_VERSION_TAG completed successfully!"
echo ""
echo "📝 Changes made:"
echo "  - Updated package.json version: $CURRENT_VERSION → $NEW_VERSION"
echo "  - Created git commit and tag: $NEW_VERSION_TAG"
echo "  - Published source code to npm: seo-select@$NEW_VERSION"
echo "  - Created GitHub Release with build artifacts"
echo ""
echo "🎯 Distribution Summary:"
echo "  📦 NPM (Source): https://www.npmjs.com/package/seo-select"  
echo "  📋 GitHub Release: https://github.com/seadonggyun4/seo-select/releases/tag/$NEW_VERSION_TAG"
echo "  📁 Built Assets: Available in GitHub Release"
echo ""
echo "💡 Usage:"
echo "  - For bundlers: npm install seo-select@$NEW_VERSION"
echo "  - For direct use: Download built files from GitHub Release"
echo ""
echo "🎉 Happy coding! 🚀"