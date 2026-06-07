#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

cd docs/.vitepress
rm -rf dist
# 生成静态文件
npm run docs:build
# 进入生成的文件夹
cd dist
#cp -r ../../images .
git init
git add -A
git commit -m 'deploy'
# 如果发布到 https://<USERNAME>.github.io
#git push -f https://github.com/caisense/CS-Note.git master:gh-pages
# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:caisense/CS-Note.git master:gh-pages

cd -