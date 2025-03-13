/**
 * 清理 SVG 内容，提取纯 SVG 代码
 * 移除可能存在的 Markdown 代码块标记和其他非 SVG 内容
 *
 * @private
 * @param svgContent 原始 SVG 内容
 * @returns 清理后的纯 SVG 代码
 */
export function onCleanSvgContent(svgContent: string): string {
  // 如果以 <svg 开头，则直接返回
  if (svgContent.startsWith("<svg")) return svgContent;

  // 移除各种可能的代码块标记
  const cleaned = svgContent
    .replace(/```(svg|xml)?\s*/gi, "") // 删除开始的代码块标记（支持 ```svg 或 ```xml 或 ```）
    .replace(/```\s*$/g, "") // 删除结束的代码块标记
    .trim();

  // 提取 <svg> 到 </svg> 之间的内容
  const svgRegex = /<svg[\s\S]*?<\/svg>/i;
  const match = cleaned.match(svgRegex);

  if (match && match[0]) {
    return match[0];
  }

  // 如果没有找到完整的 SVG 标签，但内容以 <svg 开头
  if (cleaned.match(/<svg[\s\S]*$/i) && !cleaned.includes("</svg>")) {
    // 添加闭合标签
    return `${cleaned}</svg>`;
  }

  // 如果内容包含 </svg> 但不以 <svg 开头
  if (!cleaned.match(/^[\s\S]*<svg/i) && cleaned.includes("</svg>")) {
    // 尝试找到有效内容的开始
    const startIndex = cleaned.indexOf("<");
    if (startIndex >= 0) {
      return `<svg>${cleaned.substring(startIndex)}</svg>`;
    }
  }

  // 如果确实没有找到任何 SVG 相关内容，返回原始清理后的内容
  return cleaned;
}
