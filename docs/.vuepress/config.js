module.exports = {
    title: '计算机',
    description: 'CZT的博客',
    base: '/CS-Note/',
    markdown: {
        lineNumbers: true // 代码显示行号
    },

    plugins: ["demo-container"],

    lastUpdated: 'Last Updated', // string | boolean
    themeConfig: {
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
            {
                text: '其他', items: [
                    {text: '设计模式', link: '/设计模式'},
                    {text: '系统设计', link: '/系统设计'},
                    {text: 'Git', link: '/Git'},
                    {text: '信息安全', link: '/信息安全'}
                ]
            },
        ],
        // sidebar: {
        //     '/Java/': [{
        //         title: 'Java',
        //         collapsable: false,  // 是否可折叠，默认可折叠true
        //         children: [
        //             '/Java/Java基础',
        //             '/Java/Java并发'
        //         ]
        //     }]
        //
        // }
        logo: "https://vuejs.org/images/logo.png",
        // 最近更新栏
        updateBar: {
            showToArticle: false, // 显示到文章页底部，默认true
        },
        sidebar: "structuring",
        category: false,
        tag: false,
        archive: false,
    }
}