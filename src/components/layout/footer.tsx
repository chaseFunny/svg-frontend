// src/components/layout/footer.tsx
import { TypeSocialLink, siteConfig, socialLinks } from "@/config";
import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          {/* 社交媒体链接 */}
          <div className="flex space-x-4 mb-4 md:mb-0">
            {socialLinks.map(
              (
                link: TypeSocialLink // 根据 hide 属性决定是否渲染
              ) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  aria-label={link.text}
                  title={link.text}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.text}
                </Link>
              )
            )}
          </div>

          {/* 版权信息 */}
          <div className="text-center  text-gray-500 dark:text-gray-400 flex gap-2">
            <span>
              © {new Date().getFullYear()} {siteConfig.author}
            </span>
            <span>|</span>
            <Link target="_blank" href={"https://beian.miit.gov.cn/"}>
              浙ICP备2021039023号-3
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
