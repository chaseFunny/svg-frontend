// 网站配置信息

import { Metadata } from "next";

export const siteConfig = {
  title: "SVG 秀",
  slogan: "轻松将内容转为美观的 SVG图片",
  description: "基于最新的 claude 3.7 sonnet 模型，生成美观实用的泳道图，SVG图表",
  url: "https://nextjs.org",
  blog: "https://luckysnail.cn",
  author: "luckySnail",
  keywords: ["Next.js", "React", "JavaScript", "nestjs", "luckySnail"],
  ogImage: "https://nextjs.org/og.png",
  twitterImage: "https://nextjs.org/twitter.png",
  lang: "zh-CN",
};

export const siteDefaultMetaConfig: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest", // 如果有 Web App Manifest 文件
};

/** 导航栏 */

export const navLinks = [
  {
    href: "/examples",
    text: "示例",
  },
  {
    href: "/about",
    text: "关于",
  },
  {
    href: "https://wj.qq.com/s2/18702714/865a/",
    text: "反馈",
    target: "_blank",
  },
];

/** footer 链接 */
export const socialLinks = [
  {
    href: "https://luckysnail.cn", // 微信公众号链接，同上，先占位
    text: "博客",
    isPicture: true,
    icon: null, // 同上
  },
  {
    href: "https://www.xiaohongshu.com/user/profile/5e2d938d000000000100ac82",
    text: "小红书",
    icon: null, // 小红书图标 lucide-react 中没有，同上
  },
];

export type TypeSocialLink = (typeof socialLinks)[number];
