VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Usage: ./scripts/release.sh <version>"
  echo "Example: ./scripts/release.sh v2.0.9"
  exit 1
fi

echo "🚀 Starting release process for $VERSION..."

# 1. 빌드
echo "📦 Building..."
npm run build

# 2. 압축 파일 생성
echo "📁 Creating zip file..."
ZIP_NAME="seo-select-dist-$VERSION.zip"
zip -r $ZIP_NAME dist/

# 3. npm 버전 업데이트 & 배포
echo "📤 Publishing to npm..."
npm version ${VERSION#v}  # v 제거
npm publish

# 4. GitHub 푸시
echo "📤 Pushing to GitHub..."
git push origin main
git push origin $VERSION

# 5. GitHub Release 생성
echo "🎉 Creating GitHub Release..."
gh release create $VERSION \
  $ZIP_NAME \
  --title "$VERSION - Single Bundle with Embedded Dependencies" \
  --notes "
## 🎉 What's New in $VERSION

### 🔧 CDN Improvements
- **Single Bundle**: All dependencies (including lit) bundled into one file
- **No Import Map Required**: Direct CDN usage without configuration
- **Simplified Setup**: Just add script tags

### 📥 Quick Start

#### CDN (Recommended)
\`\`\`html
<script type=\"module\" src=\"https://cdn.jsdelivr.net/gh/seadonggyun4/seo-select@$VERSION/dist/index.js\"></script>
\`\`\`

#### npm
\`\`\`bash
npm install seo-select@${VERSION#v}
\`\`\`

#### Download
Use the attached \`$ZIP_NAME\` file.

[View Full Documentation](https://github.com/seadonggyun4/seo-select#readme)
"

# 6. 정리
echo "🧹 Cleaning up..."
rm $ZIP_NAME

echo "✅ Release $VERSION completed successfully!"
echo "🔗 CDN: https://cdn.jsdelivr.net/gh/seadonggyun4/seo-select@$VERSION/dist/index.js"