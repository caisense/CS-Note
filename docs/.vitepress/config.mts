import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '计算机面试指北',
  description: '计算机面试指北',
  base: '/CS-Note/',

  // 忽略旧内容中的死链（VuePress 风格的链接、localhost 演示链接等）
  ignoreDeadLinks: true,

  // 排除 VuePress 旧首页，避免与 index.md 冲突
  // srcExclude: ['README.md', '.vuepress/**'],

  // Vite 插件：将占位符映射回实际文件名（解决图片文件名含单引号的问题）
  vite: {
    plugins: [
      {
        name: 'fix-image-filename-special-chars',
        enforce: 'pre',
        async resolveId(source, importer, options) {
          // 将 _SQ_ 占位符还原为单引号，映射到实际文件
          if (source.includes('_SQ_')) {
            const real = source.replace(/_SQ_/g, "'")
            const resolved = await this.resolve(real, importer, {
              skipSelf: true,
              ...options,
            })
            if (resolved) return resolved
          }
          return null
        },
      },
    ],
  },

  markdown: {
    lineNumbers: true,
    config: (md) => {
      // 已知的合法 HTML 标签（不会被转义）
      const knownTags = /^(a|abbr|address|area|article|aside|audio|b|base|bdi|bdo|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|data|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|h[1-6]|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|math|menu|meta|meter|nav|noscript|object|ol|optgroup|option|output|p|picture|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|slot|small|source|span|strong|style|sub|summary|sup|svg|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video|wbr)$/i

      // 预处理：将所有 <img> 标签转换为 markdown 图片语法 + 修复特殊字符文件名
      md.core.ruler.before('normalize', 'img_to_markdown', (state) => {
        // 1) <img> → ![]()
        state.src = state.src.replace(
          /<img\s+[^>]*?src=["']([^"']+)["'][^>]*?alt=["']([^"']*)["'][^>]*?\/?>/gi,
          (_, src, alt) => `![${alt}](${src})`,
        )
        state.src = state.src.replace(
          /<img\s+[^>]*?alt=["']([^"']*)["'][^>]*?src=["']([^"']+)["'][^>]*?\/?>/gi,
          (_, alt, src) => `![${alt}](${src})`,
        )
        state.src = state.src.replace(
          /<img\s+[^>]*?src=["']([^"']+)["'][^>]*?\/?>/gi,
          (_, src) => `![](${src})`,
        )

        // 2) 修复图片路径中的单引号（会破坏 Vite 生成的 JS import 语句）
        //    用占位符 _SQ_ 替换 '，后续由 Vite 插件映射回实际文件路径
        state.src = state.src.replace(
          /!\[([^\]]*)\]\(([^)]+)\)/g,
          (match, alt, path) => {
            if (path.includes("'")) {
              return `![${alt}](${path.replace(/'/g, '_SQ_')})`
            }
            return match
          },
        )
      })

      // 在 html_inline 之前插入自定义规则，过滤非标准 HTML 标签
      md.inline.ruler.before('html_inline', 'escape_unknown_html', (state, silent) => {
        const src = state.src
        const pos = state.pos

        if (src.charCodeAt(pos) !== 0x3c /* < */) return false

        const tail = src.slice(pos)
        // 匹配 HTML 标签：<[/]?tagname[^>]*[/]?>
        const match = tail.match(/^<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>/)
        if (!match) return false

        const [, closing, tag] = match

        if (knownTags.test(tag)) {
          // 已知 HTML 标签，交给 html_inline 处理
          return false
        }

        // 未知标签 → 转义为文本（处理 Java 泛型如 <T>, <K,V> 等）
        if (!silent) {
          const token = state.push('text', '', 0)
          token.content = tail.slice(0, match[0].length)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
        }
        state.pos += match[0].length
        return true
      })
    },
  },

  themeConfig: {
    // Logo
    logo: '/images/vitepress-logo-large.svg',

    // 导航栏
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Java',
        items: [
          { text: 'Java基础', link: '/Java基础' },
          { text: 'Java并发', link: '/Java并发' },
          { text: 'Java高级', link: '/Java高级' },
        ],
      },
      {
        text: 'Spring',
        items: [
          { text: 'Spring常见问题', link: '/Spring常见问题' },
          { text: 'Spring常用注解', link: '/Spring常用注解' },
          { text: 'Spring源码', link: '/Spring源码' },
          { text: 'Spring事务', link: '/Spring事务' },
          { text: 'SpringCloud-Netflix实战', link: '/SpringCloud-Netflix实战' },
          { text: 'SpringCloud-Netflix源码', link: '/SpringCloud-Netflix源码' },
        ],
      },
      {
        text: '数据库',
        items: [
          { text: 'MySQL', link: '/MySQL' },
          { text: '数据库', link: '/数据库' },
          { text: '存储', link: '/存储' },
        ],
      },
      {
        text: '计算机基础',
        items: [
          { text: '计算机网络', link: '/计算机网络' },
          { text: '操作系统', link: '/操作系统' },
        ],
      },
      {
        text: '分布式',
        items: [
          { text: '分布式', link: '/分布式' },
          { text: 'Redis', link: '/Redis' },
          { text: '消息队列', link: '/消息队列' },
          { text: '注册中心', link: '/注册中心' },
          { text: '容器', link: '/容器' },
          { text: 'RPC', link: '/RPC' },
        ],
      },
      { text: '算法', link: '/算法' },
      {
        text: '其他',
        items: [
          { text: '设计模式', link: '/设计模式' },
          { text: '系统设计', link: '/系统设计' },
          { text: 'Linux', link: '/Linux' },
          { text: 'Git', link: '/Git' },
          { text: '信息安全', link: '/信息安全' },
          { text: '编码', link: '/编码' },
        ],
      },
      {
        text: '项目',
        items: [
          { text: '高性能数字货币交易系统', link: '/高性能数字货币交易系统' },
          { text: '手写Spring', link: '/手写Spring' },
        ],
      },
    ],

    // 侧边栏
    sidebar: [
      {
        text: 'Java',
        collapsed: false,
        items: [
          { text: 'Java基础', link: '/Java基础' },
          { text: 'Java并发', link: '/Java并发' },
          { text: 'Java高级', link: '/Java高级' },
        ],
      },
      {
        text: 'Spring',
        collapsed: false,
        items: [
          { text: 'Spring常见问题', link: '/Spring常见问题' },
          { text: 'Spring常用注解', link: '/Spring常用注解' },
          { text: 'Spring源码', link: '/Spring源码' },
          { text: 'Spring事务', link: '/Spring事务' },
          { text: 'SpringCloud-Netflix实战', link: '/SpringCloud-Netflix实战' },
          { text: 'SpringCloud-Netflix源码', link: '/SpringCloud-Netflix源码' },
        ],
      },
      {
        text: '数据库',
        collapsed: false,
        items: [
          { text: 'MySQL', link: '/MySQL' },
          { text: '数据库', link: '/数据库' },
          { text: '存储', link: '/存储' },
        ],
      },
      {
        text: '计算机基础',
        collapsed: false,
        items: [
          { text: '计算机网络', link: '/计算机网络' },
          { text: '操作系统', link: '/操作系统' },
        ],
      },
      {
        text: '分布式',
        collapsed: false,
        items: [
          { text: '分布式', link: '/分布式' },
          { text: 'Redis', link: '/Redis' },
          { text: '消息队列', link: '/消息队列' },
          { text: '注册中心', link: '/注册中心' },
          { text: '容器', link: '/容器' },
          { text: 'RPC', link: '/RPC' },
        ],
      },
      {
        text: '算法',
        items: [
          { text: '算法', link: '/算法' },
        ],
      },
      {
        text: '其他',
        collapsed: true,
        items: [
          { text: '设计模式', link: '/设计模式' },
          { text: '系统设计', link: '/系统设计' },
          { text: 'Linux', link: '/Linux' },
          { text: 'Git', link: '/Git' },
          { text: '信息安全', link: '/信息安全' },
          { text: '编码', link: '/编码' },
        ],
      },
      {
        text: '项目',
        collapsed: true,
        items: [
          { text: '高性能数字货币交易系统', link: '/高性能数字货币交易系统' },
          { text: '手写Spring', link: '/手写Spring' },
        ],
      },
    ],

    // GitHub 链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/caisense/CS-Note' },
    ],

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/caisense/CS-Note/edit/master/docs/:path',
      text: '帮助我们改善此页面！',
    },

    // 本地搜索
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索',
          },
          modal: {
            displayDetails: '显示详情',
            noResultsText: '无结果',
            resetButtonTitle: '重置',
            footer: {
              closeText: '关闭',
              selectText: '选择',
              navigateText: '切换',
            },
          },
        },
      },
    },

    // 页脚
    footer: {
      message: 'Copyright © 2023-present Caisense',
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    // 大纲
    outline: {
      level: [1, 6],
      label: '目录',
    },

    // 上一页/下一页
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    // 中文化
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
  },
})
