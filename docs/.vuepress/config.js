module.exports = {
    dest: 'blog',
    base: '/blog/',
    title: 'hh`s blog',
    description: 'hh',
    markdown: {
        lineNumbers: true
    },
    themeConfig: {
        nav: [{
            text: 'Blog',
            link: '/article/JavaScript/QA-daily'
        }, {
            text: 'Project',
            link: '/project/flex/flex'
        }, {
            text: 'Resume',
            link: '/aboutMe'
        }],
        sidebarDepth: 3,
        sidebar: {
            '/article/': [
                'JavaScript/QA-daily',
                'JavaScript/QA-advanced',
                'Other/functional-programming',
                'Other/curring',
                'Other/unit-test',
                'CSS/grid/grid',
                'JavaScript/Class',
                'JavaScript/weakMap',
                'CSS/mouse-follow-hover',
                'JavaScript/clipboard',
                'JavaScript/screen/screen',
                'JavaScript/extension',
                'JavaScript/browser',
                'JavaScript/webpack/webpack-s1',
                'JavaScript/webpack/webpack-s2',
                'JavaScript/reconstruction/reconstruction',
                // 'JavaScript/promise',
                // 'JavaScript/spa-mpa',
                // 'JavaScript/ui-components-lib',
                // 'JavaScript/engineering',
                // 'CSS/adaptive',
                'JavaScript/api-rules',
                'JavaScript/token',
                'JavaScript/iview-render',
                'JavaScript/dev-build',
                'JavaScript/ssh-key',
                'JavaScript/ssh-login',
                'JavaScript/js-tricks',
                'JavaScript/pdf-review/pdf',
                'JavaScript/event-bus',
                'JavaScript/vue-cli3',
                'JavaScript/yarn-vs-npm',
                'JavaScript/micro-fe',
                'Other/vue-cli3-optimise',
                'Typescript/first-explore'
            ],
            '/project/': [
                'flex/flex',
                'flappyBird/flappyBird'
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
