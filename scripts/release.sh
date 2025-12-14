#!/bin/bash

set -e  # 에러 발생 시 즉시 종료

# ============================================================================
# Configuration
# ============================================================================
VERSION_TYPE=$1
REQUIRED_TOOLS=("gh" "git" "jq" "node")

# ============================================================================
# Helper Functions
# ============================================================================
log_info() { echo "→ $1"; }
log_success() { echo "✓ $1"; }
log_error() { echo "✗ $1" >&2; exit 1; }
log_header() { echo -e "\n[$1]"; }

check_tool() {
    command -v "$1" &> /dev/null || log_error "$1 is not installed"
}

calculate_version() {
    local current=$1 type=$2
    IFS='.' read -ra v <<< "$current"
    case $type in
        patch) echo "${v[0]}.${v[1]}.$((v[2] + 1))" ;;
        minor) echo "${v[0]}.$((v[1] + 1)).0" ;;
        major) echo "$((v[0] + 1)).0.0" ;;
    esac
}

# ============================================================================
# Validation
# ============================================================================
[[ -z "$VERSION_TYPE" ]] && {
    echo "Usage: $0 <patch|minor|major>"
    echo "  patch: 1.0.0 → 1.0.1"
    echo "  minor: 1.0.0 → 1.1.0"
    echo "  major: 1.0.0 → 2.0.0"
    exit 1
}

[[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]] && log_error "Invalid type: $VERSION_TYPE"

# ============================================================================
# Pre-flight Checks
# ============================================================================
log_header "Pre-flight Checks"

for tool in "${REQUIRED_TOOLS[@]}"; do check_tool "$tool"; done
log_success "Required tools installed"

[[ -n "$(git status --porcelain)" ]] && log_error "Working directory not clean"
log_success "Working directory clean"

[[ ! -f "package.json" ]] && log_error "package.json not found"

CURRENT_VERSION=$(jq -r '.version' package.json)
NEW_VERSION=$(calculate_version "$CURRENT_VERSION" "$VERSION_TYPE")
TAG="v$NEW_VERSION"

echo ""
echo "  Current: $CURRENT_VERSION"
echo "  New:     $NEW_VERSION ($TAG)"
echo ""
read -p "Proceed? (y/N): " -n 1 -r
echo ""
[[ ! $REPLY =~ ^[Yy]$ ]] && exit 0

# ============================================================================
# Build & Publish
# ============================================================================
log_header "Build"

jq ".version = \"$NEW_VERSION\"" package.json > tmp.json && mv tmp.json package.json
log_info "Version updated to $NEW_VERSION"

npm run type-check
log_success "Type check passed"

npm run build
log_success "Build completed"

log_header "Publish"

npm publish
log_success "Published to npm"

# ============================================================================
# Git & GitHub
# ============================================================================
log_header "Git"

git add package.json
git commit -m "chore: release $TAG"
git tag -a "$TAG" -m "Release $TAG"
git push origin main
git push origin "$TAG"
log_success "Pushed to GitHub"

log_header "GitHub Release"

gh release create "$TAG" --title "$TAG" --notes "## Installation
\`\`\`bash
npm install seo-select@$NEW_VERSION
\`\`\`

[Documentation](https://github.com/seadonggyun4/seo-select#readme) | [Changelog](https://github.com/seadonggyun4/seo-select/releases)"

log_success "Release created"

# ============================================================================
# Done
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Released: seo-select@$NEW_VERSION"
echo "  npm install seo-select@$NEW_VERSION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
