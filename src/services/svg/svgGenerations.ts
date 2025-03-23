// @ts-ignore
/* eslint-disable */
import { request } from "@/lib/request";

/** Find SVG generations GET /api/v1/svg-generator/generations */
export async function svgGeneratorControllerFindGenerations(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.SvgGeneratorControllerFindGenerationsParams,
  options?: { [key: string]: any }
) {
  return request<API.PaginatedSvgGenerationResponse>(
    "/api/v1/svg-generator/generations",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Create SVG generation POST /api/v1/svg-generator/generations */
export async function svgGeneratorControllerCreateGeneration(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.SvgGeneratorControllerCreateGenerationParams,
  body: API.SvgGenerationInput,
  options?: { [key: string]: any }
) {
  return request<API.SvgGenerationData>("/api/v1/svg-generator/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新 SVG 生成记录的公开状态（仅管理员） PUT /api/v1/svg-generator/generations/${param0}/public-status */
export async function svgGeneratorControllerUpdatePublicStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.SvgGeneratorControllerUpdatePublicStatusParams,
  body: API.UpdatePublicStatusDto,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.SvgGenerationData>(
    `/api/v1/svg-generator/generations/${param0}/public-status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get versions of an SVG generation GET /api/v1/svg-generator/generations/${param0}/versions */
export async function svgGeneratorControllerGetVersions(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.SvgGeneratorControllerGetVersionsParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.SvgVersionData[]>(
    `/api/v1/svg-generator/generations/${param0}/versions`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 查询公开的 SVG 生成内容，无需认证 GET /api/v1/svg-generator/generations/public */
export async function svgGeneratorControllerFindPublicGenerations(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.SvgGeneratorControllerFindPublicGenerationsParams,
  options?: { [key: string]: any }
) {
  return request<API.PaginatedSvgGenerationResponse>(
    "/api/v1/svg-generator/generations/public",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Create SVG generation with stream response POST /api/v1/svg-generator/generations/stream */
export async function svgGeneratorControllerCreateGenerationStream(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.SvgGeneratorControllerCreateGenerationStreamParams,
  body: API.SvgGenerationInput,
  options?: { [key: string]: any }
) {
  return request<any>("/api/v1/svg-generator/generations/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    params: {
      ...params,
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新 SVG 版本内容 PUT /api/v1/svg-generator/generations/versions/${param0} */
export async function svgGeneratorControllerUpdateSvgVersion(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.SvgGeneratorControllerUpdateSvgVersionParams,
  body: API.SvgVersionUpdateDto,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.SvgVersionData>(
    `/api/v1/svg-generator/generations/versions/${param0}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  );
}
