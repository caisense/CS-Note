module.exports = {
    title: '计算机面试指北',
    description: '计算机面试指北',
    base: '/CS-Note/',
    markdown: {
        lineNumbers: true // 代码显示行号
    },
    // plugins: ["demo-container"],

    themeConfig: {
        // 导航栏
        nav: [
            {text: 'Home', link: '/'},
            {
                text: 'Java', items: [
                    {text: 'Java基础', link: '/Java基础'},
                    {text: 'Java并发', link: '/Java并发'},
                    {text: 'Java高级', link: '/Java高级'}
                ]
            },
            {
                text: 'Spring', items: [
                    {text: 'Spring常见问题', link: '/Spring常见问题'},
                    {text: 'Spring常用注解', link: '/Spring常用注解'},
                    {text: 'Spring源码', link: '/Spring源码'},
                    {text: 'Spring事务', link: '/Spring事务'},
                    {text: 'SpringCloud-Netflix实战', link: '/SpringCloud-Netflix实战'},
                    {text: 'SpringCloud-Netflix源码', link: '/SpringCloud-Netflix源码'}
                ]
            },
            {
                text: '数据库', items: [
                    {text: 'MySQL', link: '/MySQL'},
                    {text: '数据库', link: '/数据库'},
                    {text: '存储', link: '/存储'}
                ]
            },
            {
                text: '计算机基础', items: [
                    {text: '计算机网络', link: '/计算机网络'},
                    {text: '操作系统', link: '/操作系统'}
                ]
            },
            {
                text: '分布式', items: [
                    {text: '分布式', link: '/分布式'},
                    {text: 'Redis', link: '/Redis'},
                    {text: '消息队列', link: '/消息队列'},
                    {text: '注册中心', link: '/注册中心'},
                    {text: '容器', link: '/容器'},
                    {text: 'RPC', link: '/RPC'}
                ]
            },
            {text: '算法', link: '/算法'},
            {
                text: '其他', items: [
                    {text: '设计模式', link: '/设计模式'},
                    {text: '系统设计', link: '/系统设计'},
                    {text: 'Git', link: '/Git'},
                    {text: '信息安全', link: '/信息安全'}
                ]
            },
            {
                text: '项目', items: [
                    {text: '高性能数字货币交易系统', link: '/高性能数字货币交易系统'},
                ]
            }
        ],
        // 侧边栏：自动生成
        sidebar: 'auto',
        logo: "images/hero.png",
        lastUpdated: 'Last Updated', // string | boolean
        // ----------------------git---------------------
        // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
        repo: 'https://github.com/caisense/CS-Note',
        // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
        // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
        // repoLabel: '查看源码',

        // 以下为可选的编辑链接选项

        // 假如你的文档仓库和项目本身不在一个仓库：
        // docsRepo: 'vuejs/vuepress',
        // 假如文档不是放在仓库的根目录下：
        // docsDir: 'docs',
        // 假如文档放在一个特定的分支下：
        // docsBranch: 'master',
        // 默认是 false, 设置为 true 来启用
        // editLinks: true,
        // 默认为 "Edit this page"
        editLinkText: '帮助我们改善此页面！'
    }
}