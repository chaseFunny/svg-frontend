import { toast } from "sonner";
import { onCleanSvgContent } from "./formatSvg";

export function downloadSvgAsPng(svgContent: string, filename = `svg-${Date.now()}.png`, scale = 4) {
  // 创建一个临时的 SVG 元素来获取准确尺寸
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = onCleanSvgContent(svgContent);
  const svgElement = tempDiv.querySelector("svg");

  if (!svgElement) {
    toast.error("无效的 SVG 内容");
    return;
  }

  // 获取 SVG 的尺寸
  let svgWidth = 0;
  let svgHeight = 0;

  // 首先尝试从 viewBox 属性获取
  const viewBox = svgElement.getAttribute("viewBox");
  if (viewBox) {
    const viewBoxValues = viewBox.split(/\s+/);
    if (viewBoxValues.length >= 4) {
      svgWidth = parseFloat(viewBoxValues[2]);
      svgHeight = parseFloat(viewBoxValues[3]);
    }
  }

  // 如果 viewBox 未获取到有效尺寸，尝试从 width/height 属性获取
  if (!svgWidth || !svgHeight) {
    // 尝试获取明确设置的宽高
    const width = svgElement.getAttribute("width");
    const height = svgElement.getAttribute("height");

    if (width && height) {
      // 提取数值部分（忽略单位）
      svgWidth = parseFloat(width);
      svgHeight = parseFloat(height);
    }
  }
  console.log(svgWidth, svgHeight);

  // 如果仍然无法获取尺寸，使用默认值
  if (!svgWidth || !svgHeight) {
    svgWidth = 300;
    svgHeight = 150;
    console.warn("无法从 SVG 获取尺寸，使用默认值 300x150");
  }

  // 创建 Canvas 元素
  const canvas = document.createElement("canvas");
  canvas.width = svgWidth * scale;
  canvas.height = svgHeight * scale;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    toast.error("浏览器不支持 Canvas，无法导出 PNG");
    return;
  }

  // 将 SVG 转换为 Blob URL
  const blob = new Blob([svgContent], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.onload = function () {
    // 确保图像平滑缩放
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // 清除画布并设置背景为透明
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(svgWidth * scale, svgHeight * scale);
    // 直接绘制并缩放图像
    ctx.drawImage(img, 0, 0, svgWidth * scale, svgHeight * scale, 0, 0, canvas.width, canvas.height);

    // 转换为 PNG 并下载
    try {
      const pngDataUrl = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.href = pngDataUrl;
      downloadLink.download = filename;

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      toast.success("PNG 导出成功");
    } catch (error) {
      console.error("PNG 导出错误：", error);
      toast.error("PNG 导出失败");
    }

    // 释放 Blob URL
    URL.revokeObjectURL(url);
  };

  img.onerror = function () {
    toast.error("SVG 加载失败，无法转换为 PNG");
    URL.revokeObjectURL(url);
  };

  // 设置图像源
  img.src = url;
}

export function downloadSvgAsSvg(svgContent: string) {
  const blob = new Blob([onCleanSvgContent(svgContent)], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `svg-${Date.now()}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success("SVG 下载成功");
}
