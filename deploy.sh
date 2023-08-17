#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

if [ ! -d "docs" ]; then
  mkdir docs
fi

if [ ! -d "docs/.vuepress" ]; then
  mkdir docs/.vuepress
fi

cp config.js docs/.vuepress

# 复制所有md
find . -maxdepth 1 -type f -name "*.md" | cat -n | while read n f; do
    cp "$f" docs
done
# 复制图片
cp -r images docs

# 生成静态文件
npm run docs:build
# 进入生成的文件夹
cd docs/.vuepress/dist
mv ../../images .
# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
git push -f https://github.com/caisense/CS-Note.git master:gh-pages

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -