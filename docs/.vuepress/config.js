module.exports = {
    title: '个人主页',
    description: 'CZT的博客',
    markdown: {
        lineNumbers: true // 代码显示行号
    },
    lastUpdated: 'Last Updated', // string | boolean
    themeConfig: {
        nav: [
            {text: 'Home', link: '/'},
            {
                text: 'Java', items: [
                    {text: 'Java基础', link: '/Java基础'},
                    {text: 'Java高级', link: '/Java高级'},
                    {text: 'Java并发', link: '/Java并发'}
                ]
            },
            {
                text: '数据库', items: [
                    {text: 'MySQL', link: '/MySQL'},
                    {text: '数据库', link: '/数据库'},
                    {text: 'Redis', link: '/Redis'},
                    {text: '存储', link: '/存储'}
                ]
            }
        ]
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

    }
}