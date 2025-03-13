declare namespace API {
  type AuthResponseDto = {
    /** 认证令牌 */
    token: string;
    /** 用户信息 */
    user: UserData;
  };

  type LoginDto = {
    /** 邮箱地址或用户名 */
    emailOrUsername: string;
    /** 密码 */
    password: string;
  };

  type PaginatedSvgGenerationResponse = {
    /** SVG generations */
    items: SvgGenerationWithVersionData[];
    /** Total count of items */
    total: number;
    /** Current page number */
    page: number;
    /** Page size */
    pageSize: number;
    /** Total number of pages */
    totalPages: number;
  };

  type RegisterDto = {
    /** 用户名 */
    username: string;
    /** 邮箱地址 */
    email: string;
    /** 密码 */
    password: string;
    /** 邮箱验证码 */
    verificationCode: string;
    /** 邀请码（邀请人ID） */
    inviteCode?: string;
  };

  type SendVerificationCodeDto = {
    /** 邮箱地址 */
    email: string;
  };

  type SvgGenerationData = {
    /** Generation unique ID */
    id: number;
    /** User ID */
    userId: number;
    /** Input content for generation */
    inputContent: string;
    /** Style preference */
    style?: string;
    /** Additional configuration parameters */
    configuration?: Record<string, any>;
    /** AI models used for generation */
    modelNames: string[];
    /** Title of the generation */
    title?: string;
    /** Creation timestamp */
    createdAt: string;
  };

  type SvgGenerationInput = {
    /** Input content for generation */
    inputContent: string;
    /** Style preference */
    style?: string;
    /** 宽高比例 */
    aspectRatio?: string;
    /** Additional configuration parameters */
    configuration?: Record<string, any>;
  };

  type SvgGenerationWithVersionData = {
    /** Generation unique ID */
    id: number;
    /** User ID */
    userId: number;
    /** Input content for generation */
    inputContent: string;
    /** Style preference */
    style?: string;
    /** Aspect ratio */
    aspectRatio?: string;
    /** Additional configuration parameters */
    configuration?: Record<string, any>;
    /** AI models used for generation */
    modelNames: string[];
    /** Title of the generation */
    title?: string;
    /** Whether the generation is public */
    isPublic: boolean;
    /** Creation timestamp */
    createdAt: string;
    /** Latest SVG version data */
    latestVersion: SvgVersionData;
  };

  type SvgGeneratorControllerCreateGenerationParams = {
    userId: string;
  };

  type SvgGeneratorControllerCreateGenerationStreamParams = {
    userId: string;
  };

  type SvgGeneratorControllerFindGenerationsParams = {
    userId?: string;
    /** 页码，默认为1 */
    page?: string;
    /** 每页大小，默认为20，最大为24 */
    pageSize?: string;
  };

  type SvgGeneratorControllerFindPublicGenerationsParams = {
    /** 页码，默认为1 */
    page?: string;
    /** 每页大小，默认为20，最大为24 */
    pageSize?: string;
  };

  type SvgGeneratorControllerGetVersionsParams = {
    id: string;
  };

  type SvgGeneratorControllerUpdatePublicStatusParams = {
    id: string;
  };

  type SvgGeneratorControllerUpdateSvgVersionParams = {
    id: string;
  };

  type SvgVersionData = {
    /** Version unique ID */
    id: number;
    /** Generation ID */
    generationId: number;
    /** SVG content */
    svgContent: string;
    /** SVG修改历史 */
    svgModifyList?: string[];
    /** Version number */
    versionNumber: number;
    /** Whether version is AI generated */
    isAiGenerated: boolean;
    /** Creation timestamp */
    createdAt: string;
    /** Last edit timestamp */
    lastEditedAt?: string;
    /** Last editor user ID */
    lastEditedBy?: number;
  };

  type SvgVersionUpdateDto = {
    /** 新的SVG内容 */
    svgContent: string;
    /** 用户ID */
    userId: number;
  };

  type UpdatePublicStatusDto = {
    /** 是否公开SVG生成记录 */
    isPublic: boolean;
  };

  type UserData = {
    /** User unique ID */
    id: number;
    /** Username */
    username: string;
    /** Email address */
    email?: string;
    /** User role */
    role: "ADMIN" | "USER";
    /** Remaining generation credits */
    remainingCredits: number;
    /** Whether user was invited */
    isInvited: boolean;
  };

  type VerifyEmailDto = {
    /** 邮箱地址 */
    email: string;
    /** 验证码 */
    code: string;
  };
}
