#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build
# 复制所有md和图片
find . -maxdepth 1 -type f -name "*.md" | cat -n | while read n f; do
    cp "$f" docs
done

cp -r images docs
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