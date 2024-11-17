#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

#if [ ! -d "docs" ]; then
#  mkdir docs
#fi
#
#if [ ! -d "docs/.vuepress" ]; then
#  mkdir docs/.vuepress
#fi

#cp config.js docs/.vuepress
cd docs/.vuepress
rm -rf dist


# 生成静态文件
npm run docs:build
# 进入生成的文件夹
cd dist
cp -r ../../images .
# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
#git push -f https://github.com/caisense/CS-Note.git master:gh-pages

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:caisense/CS-Note.git master:gh-pages

cd -