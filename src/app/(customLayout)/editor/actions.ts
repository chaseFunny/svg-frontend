import {
  svgGeneratorControllerGetVersions,
  svgGeneratorControllerUpdateSvgVersion,
} from "@/services/svg/svgGenerations";

/**
 * 获取 SVG 版本数据
 * @param generationId SVG 生成 ID
 */
export async function getSvgVersions(generationId: string) {
  try {
    const params: API.SvgGeneratorControllerGetVersionsParams = {
      id: generationId,
    };

    const response = await svgGeneratorControllerGetVersions(params, {});
    return response;
  } catch (error) {
    console.error("获取 SVG 版本数据失败:", error);
    throw new Error("获取 SVG 版本数据失败");
  }
}

/**
 * 更新 SVG 版本内容
 * @param versionId 要更新的版本 ID
 * @param updateData 更新的数据
 */
export async function updateSvgVersion(versionId: string, updateData: API.SvgVersionUpdateDto) {
  try {
    const params: API.SvgGeneratorControllerUpdateSvgVersionParams = {
      id: versionId,
    };

    const response = await svgGeneratorControllerUpdateSvgVersion(params, updateData, {});
    return response;
  } catch (error) {
    console.error("更新 SVG 版本失败:", error);
    throw new Error("更新 SVG 版本失败");
  }
}
