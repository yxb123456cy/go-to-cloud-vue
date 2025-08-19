#!/bin/sh
# 跨平台发布脚本 (Windows Git Bash / Linux / macOS)

# 1. 运行测试
echo "=== Running tests ==="
npm run test
if [ $? -ne 0 ]; then
  echo "Tests failed. Aborting release."
  exit 1
fi

# 2. 构建项目
echo "=== Building project ==="
npm run build
if [ $? -ne 0 ]; then
  echo "Build failed. Aborting release."
  exit 1
fi

# 3. 暂存所有改动
echo "=== Staging changes ==="
git add .

# 4. 输入 commit message
read -p "Enter commit message for this release: " msg
if [ -z "$msg" ]; then
  msg="chore(release): automated release commit"
fi

git commit -m "$msg"

# 5. 自动生成版本和 CHANGELOG
echo "=== Running standard-version ==="
npm run release

# 6. 推送 commit 和 tag 到远程
echo "=== Pushing to remote ==="
git push origin HEAD
git push --tags

echo "=== Release complete ==="
