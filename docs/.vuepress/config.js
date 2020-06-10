module.exports = {
    dest: 'blog',
    base: '/blog/',
    title: 'hh`s blog',
    description: 'hh',
    // head: ['link', {rel: 'icon', href: './public/fav.ico'}],
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        nav: [{
            text: 'Blog',
            link: '/article/JavaScript/QA-daily'
        }, {
            text: 'Resume',
            link: '/resume'
        }],
        sidebarDepth: 3,
        sidebar: {
            '/article/': [
                'JavaScript/QA-daily',
                'JavaScript/QA-advanced',
                'Other/curring',
                'JavaScript/Class',
                'JavaScript/weakMap',
                'JavaScript/clipboard',
                'JavaScript/browser',
                'JavaScript/webpack/webpack-s1',
                'JavaScript/webpack/webpack-s2',
                'JavaScript/reconstruction/reconstruction',
                'JavaScript/api-rules',
                'JavaScript/token',
                'JavaScript/js-tricks',
                'JavaScript/yarn-vs-npm',
                'js/http-cache',
                'js/event-loop',
                'js/complexity',
                'js/vue-react'
            ]
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@img': 'images'
            }
        }
    }
}
