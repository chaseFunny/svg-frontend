import SvgDialog from "@/components/svgGenerator";
import { siteConfig } from "@/config";
export default function Home() {
  return (
    <div className="container mx-auto py-8 lg:pt-20">
      <h1 className="text-3xl font-bold mb-6 text-center">{siteConfig.slogan}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
        只需两步，输入你的内容，点击生成，然后等待神奇事情发生
      </p>
      <div className="max-w-5xl mx-auto">
        <SvgDialog />
      </div>
    </div>
  );
}
