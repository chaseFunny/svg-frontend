import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Code2, Edit3, Palette, Sparkles, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* 页面标题 */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">关于 SVG 智能创作平台</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          革新性的 AI 驱动 SVG 图形生成与编辑工具，让创意表达更简单、更高效
        </p>
      </div>

      {/* 主要介绍 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6">重新定义图形创作</h2>
          <p className="text-lg mb-4">
            SVG 智能创作平台融合了最先进的 AI 大模型技术与直观的图形编辑体验，为设计师、开发者和内容创作者提供一站式 SVG
            图形解决方案。
          </p>
          <p className="text-lg mb-6">
            无论是需要快速生成图标、插图、数据可视化还是复杂图形，我们的平台都能帮助您在几秒钟内将想法转化为精美的 SVG
            图形。
          </p>
          <div className="flex gap-4 mt-2">
            <Button asChild>
              <Link href="/">
                开始使用 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/examples">查看示例</Link>
            </Button>
          </div>
        </div>
        <div className="relative h-[400px] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden flex items-center justify-center">
          {/* 这里可以放置一个代表性的 SVG 图形或平台截图 */}
          <div className="relative z-10 p-8 text-center">
            <Code2 className="w-16 h-16 mx-auto mb-4 text-primary" />
            <p className="text-lg font-semibold">AI 驱动的 SVG 生成技术</p>
          </div>
        </div>
      </div>

      <Separator className="my-16" />

      {/* 核心功能 */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">核心功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg p-8 shadow-sm border">
            <Sparkles className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">AI 智能生成</h3>
            <p className="text-muted-foreground">
              通过文字描述或参考图片，AI 大模型快速生成符合需求的高质量 SVG 图形，节省大量设计时间。
            </p>
          </div>
          <div className="bg-card rounded-lg p-8 shadow-sm border">
            <Edit3 className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">在线编辑能力</h3>
            <p className="text-muted-foreground">
              强大的在线编辑工具，支持图形调整、颜色修改、元素添加等操作，无需专业设计软件即可完成精细编辑。
            </p>
          </div>
          <div className="bg-card rounded-lg p-8 shadow-sm border">
            <Zap className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">高效导出与集成</h3>
            <p className="text-muted-foreground">
              一键导出多种格式，轻松集成到网站、应用或设计项目中，支持代码级优化和自定义调整。
            </p>
          </div>
        </div>
      </div>

      {/* 使用场景 */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">适用场景</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Palette className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">设计师与创意工作者</h3>
              <p className="text-muted-foreground">
                快速生成原型设计、插图和图标，提升设计效率。AI 辅助创意过程，帮助突破设计瓶颈，探索更多可能性。
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Code2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">开发者与技术团队</h3>
              <p className="text-muted-foreground">
                获取优化的 SVG 代码，无缝集成到前端项目。可编程的图形元素，满足动态数据可视化和交互需求。
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">内容创作者与营销团队</h3>
              <p className="text-muted-foreground">
                创建吸引眼球的社交媒体图形和营销素材，提升品牌视觉表达力。快速生成与修改，实现内容的及时更新。
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">教育与学习</h3>
              <p className="text-muted-foreground">
                轻松创建教学插图和图表，提升学习内容的可视化表达。无需专业设计知识，降低创作门槛。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 技术优势 */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">技术优势</h2>
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">先进的 AI 技术</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="h-6 w-6 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    ✓
                  </div>
                  <p>基于最新的大语言模型技术，理解复杂的设计意图</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-6 w-6 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    ✓
                  </div>
                  <p>专为 SVG 图形优化的 AI 模型，生成结果更精准</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-6 w-6 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    ✓
                  </div>
                  <p>持续学习与优化，生成质量不断提升</p>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">用户体验至上</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="h-6 w-6 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    ✓
                  </div>
                  <p>直观简洁的操作界面，降低学习成本</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-6 w-6 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    ✓
                  </div>
                  <p>实时预览与编辑，所见即所得</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-6 w-6 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    ✓
                  </div>
                  <p>响应式设计，跨设备一致体验</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 号召性用语 */}
      <div className="text-center bg-card rounded-lg p-12 border shadow-sm">
        <h2 className="text-3xl font-bold mb-4">立即体验 SVG 创作新时代</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          加入数千名创作者的行列，探索 AI 驱动的 SVG 图形创作可能性。从构思到实现，只需几秒钟。
        </p>
        <Button size="lg" asChild>
          <Link href="/">
            开始创作
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
