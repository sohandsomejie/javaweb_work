import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "./",
  title: "我的Javaweb作业",
  description: "Javaweb作业",
  themeConfig: {
    logo: "/logo.png",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '作业', items: [
        { text: '作业一', link: '/homework/homework1' },
        { text: '作业二', link: '/homework/homework2' },
        { text: '作业三', link: '/homework/homework3' },
        { text: '作业四', link: '/homework/homework4' },
        { text: '作业五', link: '/homework/homework5' }
      ] }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
    ,
  footer: {
    message: 'Released under the MIT License.',
    copyright: 'Copyright © 2023-present javaweb-work'
  }
  }
})
