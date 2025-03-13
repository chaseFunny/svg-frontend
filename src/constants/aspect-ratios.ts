export interface AspectRatio {
  name: string;
  ratio: string;
  width: number;
  height: number;
}

export const ASPECT_RATIOS: AspectRatio[] = [
  { name: "标准", ratio: "4:5", width: 1080, height: 1350 },
  { name: "小红书配图", ratio: "3:4", width: 1242, height: 1656 },
  { name: "手机海报", ratio: "9:16", width: 1242, height: 2208 },
  { name: "横版海报", ratio: "9:5", width: 900, height: 500 },
  { name: "公众号首图", ratio: "21:9", width: 900, height: 383 },
  { name: "公众号文章", ratio: "1:1", width: 500, height: 500 },
  { name: "文章长图", ratio: "2:3", width: 1000, height: 1500 },
  { name: "PPT (16:9)", ratio: "16:9", width: 1920, height: 1080 },
  { name: "竖版直播背景", ratio: "6:13", width: 1242, height: 2690 },
  { name: "竖版视频封面", ratio: "9:16", width: 1242, height: 2208 },
  { name: "横版视频封面", ratio: "16:9", width: 1920, height: 1080 },
  { name: "商品主图", ratio: "1:1", width: 800, height: 800 },
  { name: "电商详情页", ratio: "3:4", width: 750, height: 1000 },
  { name: "移动店铺首页", ratio: "3:4", width: 750, height: 1000 },
  { name: "方形", ratio: "1:1", width: 1080, height: 1080 },
];

// 默认比例为 4:5
export const DEFAULT_ASPECT_RATIO = ASPECT_RATIOS.find((ratio) => ratio.ratio === "3:4") || ASPECT_RATIOS[3];
