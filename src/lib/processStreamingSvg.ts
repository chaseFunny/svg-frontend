/**
 * 格式化 viewBox 字符串，确保其格式正确
 * @param viewBox viewBox 属性值
 * @returns 格式化后的 viewBox 字符串
 */
function formatViewBox(viewBox: string): string {
  // 移除所有多余的空格
  const cleanViewBox = viewBox.trim().replace(/\s+/g, " ");

  // 如果已经是正确格式（4 个数字），直接返回
  if (cleanViewBox.split(" ").length === 4) {
    return cleanViewBox;
  }

  // 尝试处理没有空格的情况
  if (!cleanViewBox.includes(" ")) {
    // 确保字符串长度是合理的（至少 8 个字符，因为需要 4 个数字）
    if (cleanViewBox.length >= 6) {
      const first = cleanViewBox[0];
      const second = cleanViewBox[1];
      const third = cleanViewBox.slice(2, 5);
      const fourth = cleanViewBox.slice(5);
      return `${first} ${second} ${third} ${fourth}`;
    }
  }

  // 如果无法正确解析，返回默认值
  return "0 0 800 600";
}

/**
 * 处理流式 SVG 内容，确保任何时候返回的都是合法可渲染的 SVG 代码
 * @param currentData 当前已累积的数据
 * @returns 处理后的合法 SVG 代码
 */
export function processStreamingSvg(currentData: string): string {
  // 合并新数据
  const combinedData = currentData;

  // 检查是否已经有完整的 SVG 标签
  const svgStartMatch = combinedData.match(/<svg[^>]*>/);
  if (!svgStartMatch) {
    // 如果还没有完整的开始标签，尝试构建一个临时的 SVG
    if (combinedData.includes("<svg")) {
      return '<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg"></svg>';
    }
    return ""; // 还没有任何 SVG 相关内容
  }

  const svgStart = svgStartMatch[0];
  const viewBoxMatch = svgStart.match(/viewBox="([^"]*)"/);
  const xmlns = svgStart.includes("xmlns") ? "" : ' xmlns="http://www.w3.org/2000/svg"';

  // 查找所有已打开但未关闭的标签
  const openTags: string[] = [];
  // const tagRegex = /<(\/?)([\w-]+)[^>]*>/g;
  // let match;

  // 创建一个临时 DOM 解析器来检测未闭合的标签
  const parser = new DOMParser();
  const tempSvg = parser.parseFromString(combinedData, "image/svg+xml");
  const parserErrors = tempSvg.getElementsByTagName("parsererror");

  if (parserErrors.length === 0) {
    // 如果没有解析错误，说明 SVG 是完整的
    return combinedData;
  }

  // 分析已有的标签结构
  let lastIndex = 0;
  let cleanedData = "";
  let inComment = false;

  // 对数据进行逐字符分析
  for (let i = 0; i < combinedData.length; i++) {
    const char = combinedData[i];
    const nextThree = combinedData.substr(i, 4);
    const prevTwo = i >= 2 ? combinedData.substr(i - 2, 3) : "";

    // 处理注释
    if (nextThree === "<!--" && !inComment) {
      inComment = true;
    } else if (prevTwo === "-->" && inComment) {
      inComment = false;
    }

    // 处理标签开始
    if (char === "<" && !inComment) {
      const endBracket = combinedData.indexOf(">", i);

      if (endBracket === -1) {
        // 标签未闭合，截断到这里
        cleanedData = combinedData.substring(0, i);
        break;
      }

      const tagContent = combinedData.substring(i, endBracket + 1);

      // 检查是否是自闭合标签或结束标签
      if (tagContent.match(/<\/[\w-]+>/) || tagContent.includes("/>")) {
        // 这是一个结束标签或自闭合标签
      } else if (tagContent.match(/<[\w-]+[^>]*>/)) {
        // 这是一个开始标签
        const tagName = tagContent.match(/<([\w-]+)/)?.[1];
        if (tagName) {
          openTags.push(tagName);
        }
      }

      lastIndex = endBracket + 1;
    }
  }

  // 如果数据在属性中间截断
  // let attributeCut = false;
  const lastAngleBracket = combinedData.lastIndexOf(">");
  if (lastAngleBracket !== -1 && combinedData.indexOf("<", lastAngleBracket) !== -1) {
    const potentialTag = combinedData.substring(combinedData.lastIndexOf("<"));
    if (!potentialTag.includes(">")) {
      // attributeCut = true;
      cleanedData = combinedData.substring(0, combinedData.lastIndexOf("<"));
    }
  }

  // 如果没有通过其他方式设置 cleanedData，使用到最后一个完整标签
  if (!cleanedData && lastIndex > 0) {
    cleanedData = combinedData.substring(0, lastIndex);
  }

  // 构建一个完整的 SVG
  let resultSvg = cleanedData || combinedData;
  console.log(viewBoxMatch, formatViewBox(viewBoxMatch?.[1] || "0 0 800 600"), "viewBoxMatch");

  // 确保 SVG 以根标签开始
  if (!resultSvg.startsWith("<svg")) {
    const viewBoxValue = viewBoxMatch ? formatViewBox(viewBoxMatch[1]) : "0 0 800 600";
    resultSvg = `<svg viewBox="${viewBoxValue}"${xmlns}>` + resultSvg;
  } else if (viewBoxMatch) {
    // 如果已经有 SVG 标签，但需要修正 viewBox
    const formattedViewBox = formatViewBox(viewBoxMatch[1]);
    resultSvg = resultSvg.replace(/viewBox="[^"]*"/, `viewBox="${formattedViewBox}"`);
  }

  // 确保所有打开的标签都有对应的关闭标签
  // 从后向前关闭标签
  openTags.reverse().forEach((tag) => {
    if (!resultSvg.endsWith(`</${tag}>`)) {
      resultSvg += `</${tag}>`;
    }
  });

  // 确保 SVG 以根标签结束
  if (!resultSvg.endsWith("</svg>")) {
    resultSvg += "</svg>";
  }

  return resultSvg;
}
