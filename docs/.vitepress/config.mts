import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/javaweb_work/",
  title: "我的Javaweb作业",
  description: "Javaweb作业",
  themeConfig: {
    logo: "/logo.png",
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local'
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '作业', link: '/work/work01' }
    ],

    sidebar: [
      {
        text:"作业",
        items: [
          { text: '01-会话技术', link: '/work/work01' },
          { text: '02-filter', link: '/work/work02' },
          { text: '03-listener', link: '/work/work03' },
          { text: '04-sql练习', link: '/work/work04' },
          { text: '作业5', link: '/work/work05' },
          { text: '作业6', link: '/work/work06' },
          { text: '作业7', link: '/work/work07' },
          { text: '作业8', link: '/work/work08' },
        ]
      }
      ,
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sohandsomejie/javaweb_work' }
    ]
    ,
  footer: {
    message: 'Released under the MIT License.',
    copyright: 'Copyright © 2023-present javaweb-work'
  }
  }
})
