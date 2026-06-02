本项目使用vuepress
# 本地开发预览
进入docs目录执行npm run docs:dev

# 编译并推送github生成gitpage
npm run deploy

# npm运行出错：
更换node版本至v16。 

使用nvm工具管理。

- 查看已安装node版本`nvm ls`：
  ```
    18.20.4
  * 16.20.2 (Currently using 64-bit executable)
  ```

- 选择需要的node版本：`nvm use 16.20.2`即可